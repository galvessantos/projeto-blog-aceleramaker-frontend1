import { Injectable } from '@angular/core'; 
import { HttpClient } from '@angular/common/http'; 
import { Observable, tap, BehaviorSubject } from 'rxjs'; 
import { Router } from '@angular/router'; 
import { environment } from '../../../environments/environment'; 
import { LoginRequest, RegisterRequest, AuthResponse, Usuario } from '../models/usuario.model';  

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = environment.apiUrl;
  private currentUserSubject = new BehaviorSubject<Usuario | null>(null);
  
  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.loadUserFromLocalStorage();
  }
  
  get authState() {
    return this.currentUserSubject.asObservable();
  }
  
  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<any>(`${this.baseUrl}/auth/login`, credentials)
      .pipe(
        tap(response => {
          console.log('Resposta do login:', response);
          
          localStorage.setItem('token', response.token);
          
          if (response.usuario) {
            localStorage.setItem('user', JSON.stringify(response.usuario));
            this.currentUserSubject.next(response.usuario);
          } else {

            try {
              const parts = response.token.split('.');
              if (parts.length === 3) {
                const payload = JSON.parse(atob(parts[1]));
                console.log('Payload do token:', payload);
                
                const usuario: Usuario = {
                  id: payload.userId || payload.id || 0,
                  username: payload.sub || payload.username || credentials.login,
                  email: payload.email || '',
                  nome: payload.nome || payload.name || credentials.login,
                  foto: payload.foto || ''
                };
                
                localStorage.setItem('user', JSON.stringify(usuario));
                this.currentUserSubject.next(usuario);
              }
            } catch (error) {
              console.error('Erro ao processar token:', error);
            }
          }
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
    
    this.router.navigate(['/login']);
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
  
  updateCurrentUser(user: Usuario): void {
    this.currentUserSubject.next(user);
    
    localStorage.setItem('user', JSON.stringify(user));
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
          
          const possibleIdFields = ['userId', 'id', 'sub', 'user_id'];
          
          for (const field of possibleIdFields) {
            if (decodedPayload[field] !== undefined && decodedPayload[field] !== null) {
              const userId = Number(decodedPayload[field]);
              if (!isNaN(userId)) {
                console.log(`ID do usuário extraído do token (campo ${field}):`, userId);
                return userId;
              }
            }
          }
          
          console.log('Payload do token:', decodedPayload);
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