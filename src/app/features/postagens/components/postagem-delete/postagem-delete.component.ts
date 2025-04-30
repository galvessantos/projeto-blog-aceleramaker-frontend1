import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';

import { Postagem } from '../../../../core/models/postagem.model';
import { PostagemService } from '../../../../core/services/postagem.service';

@Component({
  selector: 'app-postagem-delete',
  templateUrl: './postagem-delete.component.html',
  styleUrls: ['./postagem-delete.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDividerModule
  ]
})
export class PostagemDeleteComponent implements OnInit {
  postagem: Postagem | null = null;
  loading = false;
  deleting = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private postagemService: PostagemService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loading = true;
    const id = this.route.snapshot.paramMap.get('id');
    
    if (id) {
      this.postagemService.getPostById(+id).subscribe({
        next: (data) => {
          this.postagem = data;
          this.loading = false;
        },
        error: (error) => {
          this.snackBar.open('Erro ao carregar postagem: ' + error.message, 'Fechar', {
            duration: 5000
          });
          this.loading = false;
          this.router.navigate(['/postagens']);
        }
      });
    }
  }

  confirmDelete(): void {
    if (this.postagem && this.postagem.id) {
      this.deleting = true;
      
      this.postagemService.deletePost(this.postagem.id).subscribe({
        next: () => {
          this.snackBar.open('Postagem excluída com sucesso!', 'Fechar', {
            duration: 3000
          });
          this.router.navigate(['/postagens']);
        },
        error: (error) => {
          this.deleting = false;
          this.snackBar.open('Erro ao excluir postagem: ' + error.message, 'Fechar', {
            duration: 5000
          });
        }
      });
    }
  }
}