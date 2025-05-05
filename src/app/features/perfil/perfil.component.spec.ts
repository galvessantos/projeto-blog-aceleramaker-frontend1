import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BehaviorSubject, throwError } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { PerfilComponent } from './perfil.component';
import { AuthService } from '../../core/services/auth.service';
import { UsuarioService } from '../../core/services/usuario.service';
import { Usuario } from '../../core/models/usuario.model';

describe('PerfilComponent', () => {
  let fixture: ComponentFixture<PerfilComponent>;
  let component: PerfilComponent;
  let authService: jasmine.SpyObj<AuthService>;
  let usuarioService: jasmine.SpyObj<UsuarioService>;
  let snackBar: jasmine.SpyObj<MatSnackBar>;

  beforeEach(async () => {
    authService = jasmine.createSpyObj(
      'AuthService',
      ['getCurrentUser', 'updateCurrentUser', 'getUserId'],
      { authState: new BehaviorSubject<Usuario | null>(null) }
    );
    usuarioService = jasmine.createSpyObj('UsuarioService', [
      'getPerfilUsuario',
      'atualizarPerfil',
      'alterarSenha'
    ]);
    snackBar = jasmine.createSpyObj('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, MatSnackBarModule, PerfilComponent],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: UsuarioService, useValue: usuarioService },
        { provide: MatSnackBar, useValue: snackBar }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(PerfilComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});