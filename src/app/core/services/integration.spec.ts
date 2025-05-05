import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { PostagemService } from './postagem.service';
import { AuthService } from './auth.service';
import { AuthInterceptor } from '../interceptors/auth.interceptor';
import { environment } from '../../../environments/environment';

describe('Integration Tests', () => {
  let postagemService: PostagemService;
  let authService: AuthService;
  let httpMock: HttpTestingController;
  const apiUrl = environment.apiUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        PostagemService,
        AuthService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthInterceptor,
          multi: true
        }
      ]
    });

    postagemService = TestBed.inject(PostagemService);
    authService = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);

    // Mock do localStorage
    const mockLocalStorage = {
      getItem: jasmine.createSpy('getItem').and.returnValue('fake-token'),
      setItem: jasmine.createSpy('setItem'),
      removeItem: jasmine.createSpy('removeItem')
    };
    spyOn(localStorage, 'getItem').and.callFake(mockLocalStorage.getItem);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should add auth token to requests', fakeAsync(() => {
    spyOn(authService, 'getToken').and.returnValue('fake-token');

    postagemService.getAllPosts().subscribe();

    const req = httpMock.expectOne(`${apiUrl}/postagens?page=0&size=10`);
    expect(req.request.headers.has('Authorization')).toBeTrue();
    expect(req.request.headers.get('Authorization')).toBe('Bearer fake-token');
    req.flush({ content: [], totalElements: 0 });
  }));

  it('should handle HTTP errors properly', fakeAsync(() => {
    spyOn(authService, 'getToken').and.returnValue('fake-token');

    let errorCaught = false;
    postagemService.getPostById(999).subscribe({
      next: () => {},
      error: (error) => {
        errorCaught = true;
        expect(error).toBeTruthy();
      }
    });

    const req = httpMock.expectOne(`${apiUrl}/postagens/999`);
    req.flush('Not Found', { status: 404, statusText: 'Not Found' });
    tick();

    expect(errorCaught).toBeTrue();
  }));

  it('should properly serialize JSON in POST requests', fakeAsync(() => {
    spyOn(authService, 'getToken').and.returnValue('fake-token');

    const createData = {
      titulo: 'Teste de Integração',
      texto: 'Conteúdo de teste',
      temaId: 1,
      usuarioId: 1
    };

    postagemService.createPost(createData).subscribe();

    const req = httpMock.expectOne(`${apiUrl}/postagens`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(createData);
    req.flush({ id: 1, ...createData });
  }));

  it('should handle complete request-response cycle', fakeAsync(() => {
    spyOn(authService, 'getToken').and.returnValue('fake-token');

    const mockResponse = {
      content: [
        { id: 1, titulo: 'Postagem 1', texto: 'Conteúdo 1' },
        { id: 2, titulo: 'Postagem 2', texto: 'Conteúdo 2' }
      ],
      totalElements: 2,
      totalPages: 1,
      number: 0,
      size: 10
    };

    let result: any;
    postagemService.getAllPosts().subscribe(res => {
      result = res;
    });

    const req = httpMock.expectOne(`${apiUrl}/postagens?page=0&size=10`);
    req.flush(mockResponse);
    tick();

    expect(result).toBeTruthy();
    expect(result.content.length).toBe(2);
    expect(result.totalElements).toBe(2);
  }));
});