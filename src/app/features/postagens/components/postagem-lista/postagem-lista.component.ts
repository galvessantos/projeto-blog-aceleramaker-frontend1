import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';

import { Postagem } from '../../../../core/models/postagem.model';
import { PostagemService } from '../../../../core/services/postagem.service';

@Component({
  selector: 'app-postagem-lista',
  templateUrl: './postagem-lista.component.html',
  styleUrls: ['./postagem-lista.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ]
})
export class PostagemListaComponent implements OnInit {
  postagens: Postagem[] = [];
  loading = false;
  searchTerm = '';
  
  totalItems = 0;
  pageSize = 5;
  currentPage = 0;
  pageSizeOptions = [5, 10, 25];
  
  displayedColumns: string[] = ['titulo', 'autor', 'tema', 'data', 'acoes'];

  constructor(
    private postagemService: PostagemService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadPostagens();
  }

  loadPostagens(): void {
    this.loading = true;
    this.postagemService.getAllPosts(this.currentPage, this.pageSize, this.searchTerm).subscribe({
      next: (response) => {
        this.postagens = response.content;
        this.totalItems = response.totalElements;
        this.loading = false;
      },
      error: (error) => {
        this.snackBar.open('Erro ao carregar postagens: ' + error.message, 'Fechar', {
          duration: 5000
        });
        this.loading = false;
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadPostagens();
  }

  onSearch(): void {
    this.currentPage = 0;
    this.loadPostagens();
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.currentPage = 0;
    this.loadPostagens();
  }
}