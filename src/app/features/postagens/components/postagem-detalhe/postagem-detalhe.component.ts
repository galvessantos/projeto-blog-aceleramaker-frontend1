import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';

import { Postagem } from '../../../../core/models/postagem.model';
import { PostagemService } from '../../../../core/services/postagem.service';

@Component({
  selector: 'app-postagem-detalhe',
  templateUrl: './postagem-detalhe.component.html',
  styleUrls: ['./postagem-detalhe.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ]
})
export class PostagemDetalheComponent implements OnInit {
  postagem: Postagem | null = null;
  loading = false;

  constructor(
    private route: ActivatedRoute,
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
        }
      });
    }
  }
}