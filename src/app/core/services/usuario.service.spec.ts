import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UsuarioService } from './usuario.service';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';
import { Usuario } from '../models/usuario.model';

describe('UsuarioService', () => {
  let service: UsuarioService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/v1/usuarios`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        UsuarioService,
        { provide: AuthService, useValue: { getUserId: () => 1, updateCurrentUser: () => {} } }
      ]
    });
    service = TestBed.inject(UsuarioService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get the user profile', () => {
    const mockUsuario: Usuario = {
      id: 1,
      nome: 'John Doe',
      email: 'john.doe@example.com',
      username: 'john.doe'
    };
    service.getPerfilUsuario().subscribe(usuario => {
      expect(usuario).toEqual(mockUsuario);
    });
    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUsuario);
  });

  it('should handle error when user ID is invalid', () => {
    const auth = TestBed.inject(AuthService);
    spyOn(auth, 'getUserId').and.returnValue(0);
    service.getPerfilUsuario().subscribe(
      () => fail('expected error'),
      error => expect(error.message).toBe('Usuário não autenticado ou ID inválido')
    );
  });

  it('should update the user profile', () => {
    const formData = new FormData();
    formData.append('nome', 'Updated Name');
    formData.append('senha', 'newpassword');
    const updatedUser: Usuario = {
      id: 1,
      nome: 'Updated Name',
      email: 'updated@example.com',
      username: 'updated.username'
    };
    service.atualizarPerfil(formData).subscribe(usuario => {
      expect(usuario).toEqual(updatedUser);
    });
    const req = httpMock.expectOne(`${apiUrl}/perfil`);
    expect(req.request.method).toBe('PUT');
    req.flush(updatedUser);
  });

  it('should handle error when updating profile', () => {
    const formData = new FormData();
    formData.append('nome', 'Updated Name');
    formData.append('senha', 'newpassword');
    service.atualizarPerfil(formData).subscribe(
      () => fail('expected error'),
      error => expect(error.message).toBe('Erro ao atualizar perfil')
    );
    const req = httpMock.expectOne(`${apiUrl}/perfil`);
    expect(req.request.method).toBe('PUT');
    req.flush({ message: 'Error message' }, { status: 400, statusText: 'Bad Request' });
  });

  it('should change the user password', () => {
    const senhaData = { senhaAtual: 'oldpassword', novaSenha: 'newpassword' };
    service.alterarSenha(senhaData).subscribe(() => expect(true).toBeTrue());
    const req = httpMock.expectOne(`${apiUrl}/alterar-senha`);
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('should handle error when changing password', () => {
    const senhaData = { senhaAtual: 'oldpassword', novaSenha: 'newpassword' };
    service.alterarSenha(senhaData).subscribe(
      () => fail('expected error'),
      error => expect(error.message.startsWith('Não foi possível alterar a senha')).toBeTrue()
    );
    const req = httpMock.expectOne(`${apiUrl}/alterar-senha`);
    expect(req.request.method).toBe('POST');
    req.flush({ message: 'Error message' }, { status: 400, statusText: 'Bad Request' });
  });
});