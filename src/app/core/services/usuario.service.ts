import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Usuario } from '../models/usuario.model';
import { AuthService } from './auth.service';

export interface AtualizarPerfilRequest {
  nome: string;
  senha: string;
  foto?: string;
}

export interface AlterarSenhaRequest {
  senhaAtual: string;
  novaSenha: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = `${environment.apiUrl}/v1/usuarios`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  getPerfilUsuario(): Observable<Usuario> {
    const userId = this.authService.getUserId();
    if (userId && userId > 0) {
      return this.http.get<Usuario>(`${this.apiUrl}/${userId}`)
        .pipe(
          tap(usuario => {
            this.authService.updateCurrentUser(usuario);
          }),
          catchError(error => throwError(() => new Error('Não foi possível carregar o perfil. ' + error.message)))
        );
    }
    return throwError(() => new Error('Usuário não autenticado ou ID inválido'));
  }

  getUsuarioAtual(): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/me`)
      .pipe(
        tap(usuario => {
          this.authService.updateCurrentUser(usuario);
        }),
        catchError(error => {
          console.error('Erro ao buscar usuário atual:', error);
          return throwError(() => error);
        })
      );
  }

  atualizarPerfil(formData: FormData): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}/perfil`, formData)
      .pipe(
        tap(usuario => this.authService.updateCurrentUser(usuario)),
        catchError(() => throwError(() => new Error('Erro ao atualizar perfil')))
      );
  }

  alterarSenha(senhaData: AlterarSenhaRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/alterar-senha`, senhaData)
      .pipe(
        catchError(error => throwError(() => new Error('Não foi possível alterar a senha. ' + error.message)))
      );
  }
}