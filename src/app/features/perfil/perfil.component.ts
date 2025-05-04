import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';

import { AuthService } from '../../core/services/auth.service';
import { UsuarioService } from '../../core/services/usuario.service';
import { Usuario } from '../../core/models/usuario.model';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDividerModule,
    MatIconModule
  ]
})
export class PerfilComponent implements OnInit {
  perfilForm: FormGroup;
  senhaForm: FormGroup;
  loading = false;
  submitting = false;
  changingPassword = false;
  usuario: Usuario | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private usuarioService: UsuarioService,
    private snackBar: MatSnackBar
  ) {
    this.perfilForm = this.fb.group({
      nome: ['', [Validators.required, Validators.maxLength(100)]],
      email: [{value: '', disabled: true}],
      username: [{value: '', disabled: true}]
    });

    this.senhaForm = this.fb.group({
      senhaAtual: ['', [Validators.required]],
      novaSenha: ['', [Validators.required, Validators.minLength(6)]],
      confirmacaoSenha: ['', [Validators.required]]
    }, { validators: this.checkSenhas });
  }

  ngOnInit(): void {
    this.loading = true;
    this.usuario = this.authService.getCurrentUser();
    
    if (this.usuario) {
      this.perfilForm.patchValue({
        nome: this.usuario.nome,
        email: this.usuario.email,
        username: this.usuario.username
      });
      this.loading = false;
    } else {
      this.usuarioService.getPerfilUsuario().subscribe({
        next: (usuario) => {
          this.usuario = usuario;
          this.perfilForm.patchValue({
            nome: usuario.nome,
            email: usuario.email,
            username: usuario.username
          });
          this.loading = false;
        },
        error: (error) => {
          this.snackBar.open('Erro ao carregar perfil: ' + error.message, 'Fechar', {
            duration: 5000
          });
          this.loading = false;
        }
      });
    }
  }

  onSubmitPerfil(): void {
    if (this.perfilForm.valid) {
      this.submitting = true;
      
      const perfilData = {
        nome: this.perfilForm.getRawValue().nome,
        username: this.usuario?.username || '',
        email: this.usuario?.email || ''
      };
      
      this.usuarioService.atualizarPerfil(perfilData).subscribe({
        next: (usuario) => {
          this.usuario = usuario;
          
          if (usuario) {
            const currentUser = this.authService.getCurrentUser();
            if (currentUser) {
              const updatedUser = { ...currentUser, nome: usuario.nome };
              localStorage.setItem('user', JSON.stringify(updatedUser));
              this.authService.updateCurrentUser(updatedUser);
            }
          }
          
          this.snackBar.open('Perfil atualizado com sucesso!', 'Fechar', {
            duration: 3000
          });
          this.submitting = false;
        },
        error: (error) => {
          this.snackBar.open('Erro ao atualizar perfil: ' + error.message, 'Fechar', {
            duration: 5000
          });
          this.submitting = false;
        }
      });
    }
  }

  onSubmitSenha(): void {
    if (this.senhaForm.valid) {
      this.changingPassword = true;
      const senhaData = {
        senhaAtual: this.senhaForm.value.senhaAtual,
        novaSenha: this.senhaForm.value.novaSenha
      };
      
      this.usuarioService.alterarSenha(senhaData).subscribe({
        next: () => {
          this.snackBar.open('Senha alterada com sucesso!', 'Fechar', {
            duration: 3000
          });
          this.senhaForm.reset();
          this.changingPassword = false;
        },
        error: (error) => {
          this.snackBar.open('Erro ao alterar senha: ' + error.message, 'Fechar', {
            duration: 5000
          });
          this.changingPassword = false;
        }
      });
    }
  }

  checkSenhas(group: FormGroup): { [key: string]: boolean } | null {
    const novaSenha = group.get('novaSenha')?.value;
    const confirmacaoSenha = group.get('confirmacaoSenha')?.value;
    
    if (novaSenha && confirmacaoSenha && novaSenha !== confirmacaoSenha) {
      group.get('confirmacaoSenha')?.setErrors({ notMatch: true });
      return { notMatch: true };
    }
    
    return null;
  }
}