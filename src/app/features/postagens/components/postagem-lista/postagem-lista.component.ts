import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { environment } from '../../../../../environments/environment';
import { Postagem } from '../../../../core/models/postagem.model';
import { PostagemService } from '../../../../core/services/postagem.service';
import { TemaService } from '../../../../core/services/tema.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Tema } from '../../../../core/models/tema.model';

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
    MatMenuModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ opacity: 0, height: '0', overflow: 'hidden' }),
        animate('300ms ease-out', style({ opacity: 1, height: '*' }))
      ]),
      transition(':leave', [
        style({ opacity: 1, height: '*', overflow: 'hidden' }),
        animate('300ms ease-in', style({ opacity: 0, height: '0' }))
      ])
    ])
  ]
})
export class PostagemListaComponent implements OnInit {
  postagens: Postagem[] = [];
  expandedPosts = new Set<number>();
  loading = false;
  searchTerm = '';
  activeTab = 'para-voce';
  showAdvancedSearch = false;
  authorFilter = '';
  themeFilter = '';
  startDate: Date | null = null;
  endDate: Date | null = null;
  temas: Tema[] = [];
  currentUserId: number = 0;
  
  totalItems = 0;
  pageSize = 10;
  currentPage = 0;
  pageSizeOptions = [5, 10, 25];
  
  constructor(
    private postagemService: PostagemService,
    private temaService: TemaService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.currentUserId = this.authService.getUserId();
  }
  
  ngOnInit(): void {
    this.currentUserId = this.authService.getUserId();
    console.log('PostagemListaComponent - ID do usuário atual:', this.currentUserId);
    
    if (this.currentUserId === 0) {
      setTimeout(() => {
        this.currentUserId = this.authService.getUserId();
        console.log('PostagemListaComponent - ID do usuário atual (segunda tentativa):', this.currentUserId);
      }, 100);
    }
    
    this.loadPostagens();
    this.loadTemas();
  }
  
  loadTemas(): void {
    this.temaService.getAllTemas().subscribe({
      next: (response) => {
        this.temas = response;
      },
      error: (error) => {
        console.error('Erro ao carregar temas:', error);
      }
    });
  }

  loadPostagens(): void {
    this.loading = true;
    
    const params = {
      page: this.currentPage,
      size: this.pageSize,
      titulo: this.searchTerm,
      autor: this.authorFilter,
      temaId: this.themeFilter,
      dataInicio: this.formatDateForApi(this.startDate),
      dataFim: this.formatDateForApi(this.endDate)
    };
    
    this.postagemService.getAllPostsWithFilters(params).subscribe({
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
  
  formatDateForApi(date: Date | null): string | null {
    if (!date) return null;
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  }
  
  toggleAdvancedSearch(): void {
    this.showAdvancedSearch = !this.showAdvancedSearch;
  }
  
  clearAllFilters(): void {
    this.searchTerm = '';
    this.authorFilter = '';
    this.themeFilter = '';
    this.startDate = null;
    this.endDate = null;
    this.currentPage = 0;
    this.loadPostagens();
  }
  
  applyAdvancedSearch(): void {
    this.currentPage = 0;
    this.loadPostagens();
  }
  
  setActiveTab(tab: string): void {
    this.activeTab = tab;
    this.loadPostagens();
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
  
  isOwner(postagem: Postagem): boolean {
    const isOwnerResult = postagem.usuario.id === this.currentUserId;
    console.log('Verificando propriedade da postagem:', {
      postagemId: postagem.id,
      postagemUsuarioId: postagem.usuario.id,
      currentUserId: this.currentUserId,
      isOwner: isOwnerResult,
      postagemUsuarioNome: postagem.usuario.nome
    });
    return isOwnerResult;
  }
}