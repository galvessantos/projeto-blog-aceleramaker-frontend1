import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';

import { environment } from '../../../../../environments/environment';
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
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatMenuModule
  ]
})
export class PostagemListaComponent implements OnInit {
  postagens: Postagem[] = [];
  expandedPosts = new Set<number>();
  loading = false;
  searchTerm = '';
  
  totalItems = 0;
  pageSize = 10;
  currentPage = 0;
  pageSizeOptions = [5, 10, 25];
  
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
      this.postagens = response.content.map(post => {
        if (post.usuario && post.usuario.foto) {
          if (!post.usuario.foto.startsWith('http') && !post.usuario.foto.startsWith('data:')) {
            post.usuario.foto = `${environment.apiUrl}/${post.usuario.foto}`;
          }
        }
        return post;
      });
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
  
  toggleExpanded(postagem: Postagem): void {
    const id = postagem.id;
    if (this.expandedPosts.has(id)) {
      this.expandedPosts.delete(id);
    } else {
      this.expandedPosts.add(id);
    }
  }
  
  isExpanded(postagem: Postagem): boolean {
    return this.expandedPosts.has(postagem.id);
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