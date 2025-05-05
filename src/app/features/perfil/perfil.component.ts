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
import { environment } from '../../../environments/environment';

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
  showSenhaForm = false;
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  environment = environment;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private usuarioService: UsuarioService,
    private snackBar: MatSnackBar
  ) {
    this.perfilForm = this.fb.group({
      nome: ['', [Validators.required, Validators.maxLength(100)]],
      email: [{ value: '', disabled: true }],
      username: [{ value: '', disabled: true }]
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
        next: (usuarioData: Usuario) => {
          this.usuario = usuarioData;
          this.perfilForm.patchValue({
            nome: usuarioData.nome,
            email: usuarioData.email,
            username: usuarioData.username
          });
          this.loading = false;
        },
        error: (errorData: any) => {
          this.snackBar.open('Erro ao carregar perfil: ' + errorData.message, 'Fechar', {
            duration: 5000
          });
          this.loading = false;
        }
      });
    }
    
    this.authService.authState.subscribe(user => {
      if (user) {
        this.usuario = user;
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
      const maxSize = 5 * 1024 * 1024;
      
      if (!allowedTypes.includes(this.selectedFile.type)) {
        this.snackBar.open('Apenas imagens JPG, PNG ou GIF são permitidas', 'Fechar', {
          duration: 3000
        });
        this.resetFileInput(input);
        return;
      }
      
      if (this.selectedFile.size > maxSize) {
        this.snackBar.open('A imagem deve ter no máximo 5MB', 'Fechar', {
          duration: 3000
        });
        this.resetFileInput(input);
        return;
      }
      
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }
  
  resetFileInput(input: HTMLInputElement): void {
    input.value = '';
    this.selectedFile = null;
    this.imagePreview = null;
  }

  toggleSenhaForm(): void {
    this.showSenhaForm = !this.showSenhaForm;
    if (!this.showSenhaForm) {
      this.senhaForm.reset();
    }
  }

  onSubmitPerfil(): void {
    if (this.perfilForm.valid) {
      this.submitting = true;
      
      const formData = new FormData();
      formData.append('nome', this.perfilForm.getRawValue().nome);
      
      if (this.selectedFile) {
        formData.append('foto', this.selectedFile, this.selectedFile.name);
      }
      
      this.usuarioService.atualizarPerfil(formData).subscribe({
        next: (usuarioData: Usuario) => {
          this.usuario = usuarioData;
          this.authService.updateCurrentUser(usuarioData);
          
          this.snackBar.open('Perfil atualizado com sucesso!', 'Fechar', {
            duration: 3000
          });
          this.submitting = false;
          this.selectedFile = null;
          this.imagePreview = null;
        },
        error: (errorData: any) => {
          this.snackBar.open('Erro ao atualizar perfil: ' + errorData.message, 'Fechar', {
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
          this.showSenhaForm = false;
        },
        error: (errorData: any) => {
          this.snackBar.open('Erro ao alterar senha: ' + errorData.message, 'Fechar', {
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

  getImageUrl(path: string | null | undefined): string {
    if (!path) {
      return '';
    }
    
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
  
    return `${environment.apiUrl}/${path}`;
  }
}