import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Usuario } from '../models/usuario.model';

export interface AtualizarPerfilRequest {
  nome: string;
  username: string;
  email: string;
}

export interface AlterarSenhaRequest {
  senhaAtual: string;
  novaSenha: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = `${environment.apiUrl}/usuarios`;
  
  constructor(private http: HttpClient) {}
  
  getPerfilUsuario(): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/perfil`);
  }
  
  atualizarPerfil(perfilData: AtualizarPerfilRequest): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}/atualizar`, perfilData);
  }
  
  alterarSenha(senhaData: AlterarSenhaRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/alterar-senha`, senhaData);
  }
}