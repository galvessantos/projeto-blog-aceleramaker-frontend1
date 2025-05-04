import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginRequest, RegisterRequest, AuthResponse, Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = environment.apiUrl;
  private currentUserSubject = new BehaviorSubject<Usuario | null>(null);
  
  constructor(private http: HttpClient) {
    this.loadUserFromLocalStorage();
  }
  
  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/auth/login`, credentials)
      .pipe(
        tap(response => {
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.usuario));
          this.currentUserSubject.next(response.usuario);
        })
      );
  }
  
  register(userData: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/auth/register`, userData);
  }
  
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
  }
  
  getToken(): string | null {
    return localStorage.getItem('token');
  }
  
  isLoggedIn(): boolean {
    return !!this.getToken();
  }
  
  getCurrentUser(): Usuario | null {
    return this.currentUserSubject.value;
  }
  
  getUserId(): number {
    const currentUser = this.getCurrentUser();
    if (currentUser && currentUser.id !== undefined && currentUser.id !== null) {
      const userId = Number(currentUser.id);
      if (!isNaN(userId)) {
        console.log('ID do usuário obtido do objeto:', userId);
        return userId;
      }
    }
    
    console.log('Tentando extrair ID do token JWT...');
    const token = this.getToken();
    if (token) {
      try {
        const parts = token.split('.');
        if (parts.length === 3) {
          const payload = atob(parts[1]);
          const decodedPayload = JSON.parse(payload);
          
          if (decodedPayload.userId !== undefined && decodedPayload.userId !== null) {
            const userId = Number(decodedPayload.userId);
            if (!isNaN(userId)) {
              console.log('ID do usuário extraído do token:', userId);
              return userId;
            }
          }
        }
      } catch (error) {
        console.error('Erro ao decodificar token:', error);
      }
    }
    
    console.error('Impossível obter ID do usuário válido');
    return 0;
  }
  
  private loadUserFromLocalStorage(): void {
    const userJson = localStorage.getItem('user');
    
    if (userJson) {
      try {
        const user = JSON.parse(userJson);
        this.currentUserSubject.next(user);
        console.log('Usuário carregado do localStorage:', user);
      } catch (error) {
        console.error('Erro ao carregar usuário do localStorage:', error);
        this.logout();
      }
    }
  }
}