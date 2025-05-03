import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';

import { Tema } from '../../../../core/models/tema.model';
import { TemaService } from '../../../../core/services/tema.service';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-tema-lista',
  templateUrl: './tema-lista.component.html',
  styleUrls: ['./tema-lista.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDialogModule
  ]
})
export class TemaListaComponent implements OnInit {
  temas: Tema[] = [];
  loading = false;
  displayedColumns: string[] = ['id', 'descricao', 'acoes'];

  constructor(
    private temaService: TemaService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadTemas();
  }

  loadTemas(): void {
    this.loading = true;
    this.temaService.getAllTemas().subscribe({
      next: (data) => {
        this.temas = data;
        this.loading = false;
      },
      error: (error) => {
        this.snackBar.open('Erro ao carregar temas: ' + error.message, 'Fechar', {
          duration: 5000
        });
        this.loading = false;
      }
    });
  }

  openDeleteDialog(tema: Tema): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirmar exclusão',
        message: `Tem certeza que deseja excluir o tema "${tema.descricao}"?`,
        confirmText: 'Excluir',
        cancelText: 'Cancelar'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteTema(tema.id);
      }
    });
  }

  private deleteTema(id: number): void {
    this.loading = true;
    
    this.temaService.deleteTema(id).subscribe({
      next: () => {
        this.snackBar.open('Tema excluído com sucesso!', 'Fechar', {
          duration: 3000
        });
        this.loadTemas();
      },
      error: (error) => {
        this.loading = false;
        this.snackBar.open('Erro ao excluir tema: ' + error.message, 'Fechar', {
          duration: 5000
        });
      }
    });
  }
}