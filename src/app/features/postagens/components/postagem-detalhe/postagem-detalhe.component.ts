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
import { AuthService } from '../../../../core/services/auth.service';

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
  currentUserId: number = 0;

  constructor(
    private route: ActivatedRoute,
    private postagemService: PostagemService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.currentUserId = this.authService.getUserId();
  }

  ngOnInit(): void {
    this.loading = true;
    this.currentUserId = this.authService.getUserId();
    console.log('PostagemDetalheComponent - ID do usuário atual:', this.currentUserId);
    
    const id = this.route.snapshot.paramMap.get('id');
    
    if (id) {
      this.postagemService.getPostById(+id).subscribe({
        next: (data) => {
          this.postagem = data;
          console.log('Postagem carregada:', {
            id: data.id,
            usuarioId: data.usuario.id,
            usuarioNome: data.usuario.nome,
            currentUserId: this.currentUserId,
            isOwner: this.isOwner()
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
  
  isOwner(): boolean {
    if (!this.postagem) return false;
    
    const postagemUserId = Number(this.postagem.usuario.id);
    const currentUserId = Number(this.currentUserId);
    
    const result = !isNaN(postagemUserId) && 
                   !isNaN(currentUserId) && 
                   postagemUserId === currentUserId;
                   
    console.log('PostagemDetalheComponent - isOwner:', result, {
      postagemUsuarioId: this.postagem.usuario.id,
      currentUserId: this.currentUserId,
      convertedPostagemId: postagemUserId,
      convertedCurrentId: currentUserId
    });
    
    return result;
  }
}