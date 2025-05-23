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

          localStorage.setItem('token', response.token);
          
          if (response.usuario) {
            localStorage.setItem('user', JSON.stringify(response.usuario));
            this.currentUserSubject.next(response.usuario);
          } else {
            try {
              const parts = response.token.split('.');
              if (parts.length === 3) {
                const payload = JSON.parse(atob(parts[1]));
                
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
    const token = this.getToken();
    const hasToken = !!token;
    return hasToken;
  }
  
  getCurrentUser(): Usuario | null {
    const user = this.currentUserSubject.value;
    return user;
  }
  
  updateCurrentUser(user: Usuario): void {
    this.currentUserSubject.next(user);
    localStorage.setItem('user', JSON.stringify(user));
  }
  
  getUserId(): number {
    const currentUser = this.getCurrentUser();
    if (currentUser && currentUser.id !== undefined && currentUser.id !== null) {
      const userId = Number(currentUser.id);
      if (!isNaN(userId) && userId > 0) {
        return userId;
      }
    }
    
    const userJson = localStorage.getItem('user');
    if (userJson) {
      try {
        const userFromStorage = JSON.parse(userJson);
        if (userFromStorage && userFromStorage.id) {
          const userId = Number(userFromStorage.id);
          if (!isNaN(userId) && userId > 0) {
            if (!currentUser || currentUser.id !== userId) {
              this.currentUserSubject.next(userFromStorage);
            }
            return userId;
          }
        }
      } catch (error) {
      }
    }
    
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
              if (!isNaN(userId) && userId > 0) {
                return userId;
              }
            }
          }
          
        }
      } catch (error) {
      }
    }
    
    return 0;
  }
  
  private loadUserFromLocalStorage(): void {
    const userJson = localStorage.getItem('user');
    
    if (userJson) {
      try {
        const user = JSON.parse(userJson);
        this.currentUserSubject.next(user);
      } catch (error) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
  }
}