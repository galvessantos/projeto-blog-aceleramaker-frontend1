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
  
  currentUserId = 1;

  constructor(
    private fb: FormBuilder,
    private postagemService: PostagemService,
    private temaService: TemaService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.postagemForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.maxLength(100)]],
      texto: ['', [Validators.required, Validators.maxLength(1000)]],
      temaId: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loading = true;
    
    this.temaService.getAllTemas().subscribe({
      next: (temas) => {
        this.temas = temas;
        this.loading = false;
      },
      error: (error) => {
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
          this.postagemForm.patchValue({
            titulo: postagem.titulo,
            texto: postagem.texto,
            temaId: postagem.tema.id
          });
          this.loading = false;
        },
        error: (error) => {
          this.snackBar.open('Erro ao carregar postagem: ' + error.message, 'Fechar', {
            duration: 5000
          });
          this.loading = false;
        }
      });
    }
  }

  onSubmit(): void {
    if (this.postagemForm.valid) {
      this.submitting = true;
      
      if (this.isEdit && this.postagemId) {
        const updateData: UpdatePostagem = {
          titulo: this.postagemForm.value.titulo,
          texto: this.postagemForm.value.texto,
          temaId: this.postagemForm.value.temaId
        };
        
        this.postagemService.updatePost(this.postagemId, updateData).subscribe({
          next: () => {
            this.snackBar.open('Postagem atualizada com sucesso!', 'Fechar', {
              duration: 3000
            });
            this.router.navigate(['/postagens']);
          },
          error: (error) => {
            this.submitting = false;
            this.snackBar.open('Erro ao atualizar postagem: ' + error.message, 'Fechar', {
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
        
        this.postagemService.createPost(createData).subscribe({
          next: () => {
            this.snackBar.open('Postagem criada com sucesso!', 'Fechar', {
              duration: 3000
            });
            this.router.navigate(['/postagens']);
          },
          error: (error) => {
            this.submitting = false;
            this.snackBar.open('Erro ao criar postagem: ' + error.message, 'Fechar', {
              duration: 5000
            });
          }
        });
      }
    }
  }
}