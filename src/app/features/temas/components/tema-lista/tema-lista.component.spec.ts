import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TemaListaComponent } from './tema-lista.component';
import { TemaService } from '../../../../core/services/tema.service';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

describe('TemaListaComponent', () => {
  let fixture: ComponentFixture<TemaListaComponent>;
  let component: TemaListaComponent;
  let temaService: jasmine.SpyObj<TemaService>;
  let snackBar: jasmine.SpyObj<MatSnackBar>;
  let dialog: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    temaService = jasmine.createSpyObj('TemaService', ['getAllTemas', 'deleteTema']);
    snackBar = jasmine.createSpyObj('MatSnackBar', ['open']);
    dialog = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      imports: [
        TemaListaComponent,
        MatTableModule,
        MatProgressSpinnerModule,
        MatSnackBarModule,
        MatDialogModule,
        RouterTestingModule
      ],
      providers: [
        { provide: TemaService, useValue: temaService },
        { provide: MatSnackBar, useValue: snackBar },
        { provide: MatDialog, useValue: dialog },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => null
              }
            }
          }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(TemaListaComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});