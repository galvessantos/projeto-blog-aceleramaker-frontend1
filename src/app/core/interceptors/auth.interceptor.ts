import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  
  constructor(private authService: AuthService, private router: Router) {}
  
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.authService.getToken();
    console.log('Interceptor processando URL:', request.url);
    console.log('Método HTTP:', request.method);
    console.log('Headers antes:', request.headers.keys());
    console.log('Token presente:', !!token);
    
    if (token) {
      const authReq = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      
      console.log('Headers depois:', authReq.headers.keys());
      console.log('Authorization header:', authReq.headers.get('Authorization')?.substring(0, 20) + '...');
      
      return next.handle(authReq).pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Erro interceptado:', error.status, error.message);
          if (error.status === 401 || error.status === 403) {
            console.log('Erro de autenticação/autorização, redirecionando para login');
            this.authService.logout();
            this.router.navigate(['/login']);
          }
          return throwError(() => error);
        })
      );
    }
    
    console.log('Requisição sem token será enviada');
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Erro interceptado (sem token):', error.status, error.message);
        if (error.status === 401 || error.status === 403) {
          console.log('Erro de autenticação/autorização, redirecionando para login');
          this.authService.logout();
          this.router.navigate(['/login']);
        }
        return throwError(() => error);
      })
    );
  }
}