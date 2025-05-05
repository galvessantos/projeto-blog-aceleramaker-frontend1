import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { LoginComponent } from './login.component';
import { AuthService } from '../../../../core/services/auth.service';

describe('LoginComponent', () => {
 let component: LoginComponent;
 let fixture: ComponentFixture<LoginComponent>;
 let authService: jasmine.SpyObj<AuthService>;
 let router: Router;

 const mockAuthResponse = {
   token: 'fake-token',
   tipo: 'Bearer',
   usuario: {
     id: 1,
     nome: 'Usuário Teste',
     username: 'usuario_teste',
     email: 'teste@email.com'
   }
 };

 beforeEach(async () => {
   const authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);

   await TestBed.configureTestingModule({
     imports: [
       HttpClientTestingModule,
       RouterTestingModule,
       ReactiveFormsModule,
       BrowserAnimationsModule,
       MatSnackBarModule,
       LoginComponent
     ],
     providers: [
       { provide: AuthService, useValue: authServiceSpy }
     ]
   }).compileComponents();

   authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
   router = TestBed.inject(Router);

   authService.login.and.returnValue(of(mockAuthResponse));

   fixture = TestBed.createComponent(LoginComponent);
   component = fixture.componentInstance;
   fixture.detectChanges();
 });

 it('should create', () => {
   expect(component).toBeTruthy();
 });

 it('should initialize login form', () => {
   expect(component.loginForm).toBeTruthy();
   expect(component.loginForm.get('login')).toBeTruthy();
   expect(component.loginForm.get('senha')).toBeTruthy();
 });

 it('should validate required fields', () => {
   const loginControl = component.loginForm.get('login');
   const senhaControl = component.loginForm.get('senha');

   loginControl?.setValue('');
   senhaControl?.setValue('');

   expect(loginControl?.valid).toBeFalse();
   expect(senhaControl?.valid).toBeFalse();
   expect(component.loginForm.valid).toBeFalse();

   loginControl?.setValue('usuario_teste');
   senhaControl?.setValue('senha123');

   expect(loginControl?.valid).toBeTrue();
   expect(senhaControl?.valid).toBeTrue();
   expect(component.loginForm.valid).toBeTrue();
 });

 it('should call login service on form submit', fakeAsync(() => {
   spyOn(router, 'navigate');

   component.loginForm.setValue({
     login: 'usuario_teste',
     senha: 'senha123'
   });

   component.onSubmit();
   tick();

   expect(authService.login).toHaveBeenCalledWith({
     login: 'usuario_teste',
     senha: 'senha123'
   });
   expect(router.navigate).toHaveBeenCalledWith(['/postagens']);
 }));

 it('should handle login error', fakeAsync(() => {
   authService.login.and.returnValue(throwError(() => ({
     error: { message: 'Credenciais inválidas' }
   })));

   component.loginForm.setValue({
     login: 'usuario_errado',
     senha: 'senha_errada'
   });

   component.onSubmit();
   tick();
 }));

 it('should not submit if form is invalid', () => {
   component.loginForm.setValue({
     login: '',
     senha: ''
   });

   component.onSubmit();

   expect(authService.login).not.toHaveBeenCalled();
 });
});