import { TestBed } from '@angular/core/testing';
import { HTTP_INTERCEPTORS, HttpClient, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { AuthInterceptor } from './auth.interceptor';
import { of } from 'rxjs';
import { AuthService } from '../services/auth.service';

describe('AuthInterceptor', () => {
  let interceptor: AuthInterceptor;
  let authServiceMock: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    authServiceMock = jasmine.createSpyObj('AuthService', ['getToken', 'logout']);
    
    TestBed.configureTestingModule({
      providers: [
        AuthInterceptor,
        { 
          provide: AuthService, 
          useValue: authServiceMock 
        },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthInterceptor,
          multi: true,
        },
      ],
    });

    interceptor = TestBed.inject(AuthInterceptor);
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should add Authorization header if token exists', () => {
    const token = 'fake-token';
    authServiceMock.getToken.and.returnValue(token); 

    const req = new HttpRequest('GET', '/test');
    const handler: HttpHandler = {
      handle: (request) => {
        expect(request.headers.has('Authorization')).toBeTrue();
        expect(request.headers.get('Authorization')).toBe(`Bearer ${token}`);
        return of(new HttpResponse({ status: 200 }));
      }
    };

    interceptor.intercept(req, handler).subscribe();
  });

  it('should not add Authorization header if token does not exist', () => {
    authServiceMock.getToken.and.returnValue(null);  

    const req = new HttpRequest('GET', '/test');
    const handler: HttpHandler = {
      handle: (request) => {
        expect(request.headers.has('Authorization')).toBeFalse();
        return of(new HttpResponse({ status: 200 }));
      }
    };

    interceptor.intercept(req, handler).subscribe();
  });
});
