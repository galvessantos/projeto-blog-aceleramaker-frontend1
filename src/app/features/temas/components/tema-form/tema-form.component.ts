import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';

import { Tema, CreateTema } from '../../../../core/models/tema.model';
import { TemaService } from '../../../../core/services/tema.service';

@Component({
  selector: 'app-tema-form',
  templateUrl: './tema-form.component.html',
  styleUrls: ['./tema-form.component.scss'],
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
    MatSnackBarModule
  ]
})
export class TemaFormComponent implements OnInit {
  temaForm: FormGroup;
  loading = false;
  submitting = false;
  isEdit = false;
  temaId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private temaService: TemaService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.temaForm = this.fb.group({
      descricao: ['', [Validators.required, Validators.maxLength(255)]]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    
    if (id) {
      this.isEdit = true;
      this.temaId = +id;
      this.loading = true;
      
      this.temaService.getTemaById(+id).subscribe({
        next: (tema) => {
          this.temaForm.patchValue({
            descricao: tema.descricao
          });
          this.loading = false;
        },
        error: (error) => {
          this.snackBar.open('Erro ao carregar tema: ' + error.message, 'Fechar', {
            duration: 5000
          });
          this.loading = false;
        }
      });
    }
  }

  onSubmit(): void {
    if (this.temaForm.valid) {
      this.submitting = true;
      const temaData: CreateTema = this.temaForm.value;
      
      if (this.isEdit && this.temaId) {
        this.temaService.updateTema(this.temaId, temaData).subscribe({
          next: () => {
            this.snackBar.open('Tema atualizado com sucesso!', 'Fechar', {
              duration: 3000
            });
            this.router.navigate(['/temas']);
          },
          error: (error) => {
            this.submitting = false;
            this.snackBar.open('Erro ao atualizar tema: ' + error.message, 'Fechar', {
              duration: 5000
            });
          }
        });
      } else {
        this.temaService.createTema(temaData).subscribe({
          next: () => {
            this.snackBar.open('Tema criado com sucesso!', 'Fechar', {
              duration: 3000
            });
            this.router.navigate(['/temas']);
          },
          error: (error) => {
            this.submitting = false;
            this.snackBar.open('Erro ao criar tema: ' + error.message, 'Fechar', {
              duration: 5000
            });
          }
        });
      }
    }
  }
}