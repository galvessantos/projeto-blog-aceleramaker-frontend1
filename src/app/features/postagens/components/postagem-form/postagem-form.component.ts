import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';

import { Tema } from '../../../../core/models/tema.model';
import { CreatePostagem, UpdatePostagem } from '../../../../core/models/postagem.model';
import { PostagemService } from '../../../../core/services/postagem.service';
import { TemaService } from '../../../../core/services/tema.service';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-postagem-form',
  templateUrl: './postagem-form.component.html',
  styleUrls: ['./postagem-form.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ]
})
export class PostagemFormComponent implements OnInit {
  postagemForm: FormGroup;
  temas: Tema[] = [];
  loading = false;
  submitting = false;
  isEdit = false;
  postagemId: number | null = null;
  
  currentUserId: number = 0;

  constructor(
    private fb: FormBuilder,
    private postagemService: PostagemService,
    private temaService: TemaService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.postagemForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.maxLength(100)]],
      texto: ['', [Validators.required, Validators.maxLength(1000)]],
      temaId: [null, Validators.required]
    });
    
    this.currentUserId = this.authService.getUserId();
    console.log('ID do usuário atual no componente:', this.currentUserId);
  }

  ngOnInit(): void {
    this.loading = true;
    
    this.currentUserId = this.authService.getUserId();
    console.log('ID do usuário atual após ngOnInit:', this.currentUserId);
    
    if (!this.authService.isLoggedIn()) {
      console.error('Usuário não está logado!');
      this.snackBar.open('Você precisa estar logado para criar postagens.', 'Fechar', {
        duration: 5000
      });
      this.router.navigate(['/login']);
      return;
    }
    
    this.temaService.getAllTemas().subscribe({
      next: (temas) => {
        this.temas = temas;
        console.log('Temas carregados:', temas.length);
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar temas:', error);
        this.snackBar.open('Erro ao carregar temas: ' + error.message, 'Fechar', {
          duration: 5000
        });
        this.loading = false;
      }
    });
    
    const id = this.route.snapshot.paramMap.get('id');
    
    if (id) {
      this.isEdit = true;
      this.postagemId = +id;
      this.loading = true;
      
      this.postagemService.getPostById(+id).subscribe({
        next: (postagem) => {
          console.log('Postagem carregada para edição:', postagem);
          this.postagemForm.patchValue({
            titulo: postagem.titulo,
            texto: postagem.texto,
            temaId: postagem.tema.id
          });
          this.loading = false;
        },
        error: (error) => {
          console.error('Erro ao carregar postagem para edição:', error);
          this.snackBar.open('Erro ao carregar postagem: ' + error.message, 'Fechar', {
            duration: 5000
          });
          this.loading = false;
        }
      });
    }
  }

  onSubmit(): void {
    console.log('Formulário submetido, validação:', this.postagemForm.valid);
    console.log('Valores do formulário:', this.postagemForm.value);
    
    if (this.postagemForm.valid) {
      this.submitting = true;
      
      this.currentUserId = this.authService.getUserId();
      console.log('ID do usuário no momento da submissão:', this.currentUserId);
      
      if (this.currentUserId <= 0) {
        console.error('ID do usuário inválido!');
        this.snackBar.open('Erro: ID do usuário inválido. Tente fazer login novamente.', 'Fechar', {
          duration: 5000
        });
        this.submitting = false;
        return;
      }
      
      if (this.isEdit && this.postagemId) {
        const updateData: UpdatePostagem = {
          titulo: this.postagemForm.value.titulo,
          texto: this.postagemForm.value.texto,
          temaId: this.postagemForm.value.temaId
        };
        
        console.log('Enviando dados para atualização:', updateData);
        
        this.postagemService.updatePost(this.postagemId, updateData).subscribe({
          next: (response) => {
            console.log('Postagem atualizada com sucesso:', response);
            this.snackBar.open('Postagem atualizada com sucesso!', 'Fechar', {
              duration: 3000
            });
            this.router.navigate(['/postagens']);
          },
          error: (error) => {
            console.error('Erro ao atualizar postagem:', error);
            console.error('Status:', error.status);
            console.error('Mensagem:', error.message);
            if (error.error) {
              console.error('Detalhes do erro:', error.error);
            }
            
            this.submitting = false;
            this.snackBar.open('Erro ao atualizar postagem: ' + (error.error?.message || error.message), 'Fechar', {
              duration: 5000
            });
          }
        });
      } else {
        const createData: CreatePostagem = {
          titulo: this.postagemForm.value.titulo,
          texto: this.postagemForm.value.texto,
          temaId: this.postagemForm.value.temaId,
          usuarioId: this.currentUserId
        };
        
        console.log('Enviando dados para criação:', createData);
        
        this.postagemService.createPost(createData).subscribe({
          next: (response) => {
            console.log('Postagem criada com sucesso:', response);
            this.snackBar.open('Postagem criada com sucesso!', 'Fechar', {
              duration: 3000
            });
            this.router.navigate(['/postagens']);
          },
          error: (error) => {
            console.error('Erro ao criar postagem:', error);
            console.error('Status:', error.status);
            console.error('Mensagem:', error.message);
            if (error.error) {
              console.error('Detalhes do erro:', error.error);
            }
            
            this.submitting = false;
            this.snackBar.open('Erro ao criar postagem: ' + (error.error?.message || error.message), 'Fechar', {
              duration: 5000
            });
          }
        });
      }
    } else {

      console.log('Formulário inválido!');
      Object.keys(this.postagemForm.controls).forEach(key => {
        const control = this.postagemForm.get(key);
        if (control?.invalid) {
          console.log(`Campo inválido: ${key}`, control.errors);
        }
      });
      
      this.snackBar.open('Por favor, corrija os erros no formulário.', 'Fechar', {
        duration: 3000
      });
    }
  }
}