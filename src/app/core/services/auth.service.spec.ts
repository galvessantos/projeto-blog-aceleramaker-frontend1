import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';
import { LoginRequest, RegisterRequest, AuthResponse, Usuario } from '../models/usuario.model';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let router: Router;
  const apiUrl = `${environment.apiUrl}`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [AuthService]
    });
    
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login user and store token', () => {
    const loginData: LoginRequest = {
      login: 'usuario_teste',
      senha: 'senha123'
    };

    const mockResponse: AuthResponse = {
      token: 'fake-token',
      tipo: 'Bearer',
      usuario: {
        id: 1,
        nome: 'Usuário Teste',
        username: 'usuario_teste',
        email: 'teste@email.com'
      }
    };

    service.login(loginData).subscribe(response => {
      expect(response).toEqual(mockResponse);
      expect(localStorage.getItem('token')).toBe('fake-token');
      expect(localStorage.getItem('user')).toBe(JSON.stringify(mockResponse.usuario));
    });

    const req = httpMock.expectOne(`${apiUrl}/auth/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(loginData);
    req.flush(mockResponse);
  });

  it('should register user', () => {
    const registerData: RegisterRequest = {
      nome: 'Novo Usuário',
      username: 'novo_usuario',
      email: 'novo@email.com',
      senha: 'senha123'
    };

    const mockResponse: AuthResponse = {
      token: 'new-token',
      tipo: 'Bearer',
      usuario: {
        id: 2,
        nome: 'Novo Usuário',
        username: 'novo_usuario',
        email: 'novo@email.com'
      }
    };

    service.register(registerData).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${apiUrl}/auth/register`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(registerData);
    req.flush(mockResponse);
  });

  it('should logout and clear storage', () => {
    spyOn(router, 'navigate');
    spyOn(localStorage, 'removeItem');
    
    localStorage.setItem('token', 'fake-token');
    localStorage.setItem('user', JSON.stringify({ id: 1, nome: 'Teste' }));
    
    service.logout();
    
    expect(localStorage.removeItem).toHaveBeenCalledWith('token');
    expect(localStorage.removeItem).toHaveBeenCalledWith('user');
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should check if user is logged in', () => {
    localStorage.removeItem('token');
    expect(service.isLoggedIn()).toBeFalse();
    
    localStorage.setItem('token', 'fake-token');
    expect(service.isLoggedIn()).toBeTrue();
  });

  it('should get current user', () => {
    const mockUser: Usuario = {
      id: 1,
      nome: 'Usuário Teste',
      username: 'usuario_teste',
      email: 'teste@email.com'
    };
    
    localStorage.setItem('user', JSON.stringify(mockUser));
    service.login({login: 'test', senha: 'test'}).subscribe();
    const req = httpMock.expectOne(`${apiUrl}/auth/login`);
    req.flush({
      token: 'fake-token',
      tipo: 'Bearer',
      usuario: mockUser
    });
    
    expect(service.getCurrentUser()).toEqual(mockUser);
  });

  it('should update current user', () => {
    const mockUser: Usuario = {
      id: 1,
      nome: 'Usuário Teste',
      username: 'usuario_teste',
      email: 'teste@email.com'
    };
    
    const updatedUser: Usuario = {
      ...mockUser,
      nome: 'Nome Atualizado'
    };
    
    service.updateCurrentUser(updatedUser);
    
    expect(localStorage.getItem('user')).toBe(JSON.stringify(updatedUser));
    expect(service.getCurrentUser()).toEqual(updatedUser);
  });

  it('should get user ID from current user', () => {
    const mockUser: Usuario = {
      id: 5,
      nome: 'Usuário Teste',
      username: 'usuario_teste',
      email: 'teste@email.com'
    };
    
    spyOn(service, 'getCurrentUser').and.returnValue(mockUser);
    
    expect(service.getUserId()).toBe(5);
  });
});
