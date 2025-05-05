import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { TemaFormComponent } from './tema-form.component';
import { TemaService } from '../../../../core/services/tema.service';
import { of, throwError } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

describe('TemaFormComponent', () => {
 let component: TemaFormComponent;
 let fixture: ComponentFixture<TemaFormComponent>;
 let temaService: jasmine.SpyObj<TemaService>;
 let snackBar: jasmine.SpyObj<MatSnackBar>;
 let router: jasmine.SpyObj<Router>;
 let activatedRoute: jasmine.SpyObj<ActivatedRoute>;

 beforeEach(async () => {
   temaService = jasmine.createSpyObj('TemaService', ['getTemaById', 'createTema', 'updateTema']);
   snackBar = jasmine.createSpyObj('MatSnackBar', ['open']);
   router = jasmine.createSpyObj('Router', ['navigate']);
   activatedRoute = jasmine.createSpyObj('ActivatedRoute', [], {
     snapshot: { paramMap: { get: (key: string) => (key === 'id' ? '1' : null) } }
   });

   await TestBed.configureTestingModule({
     imports: [
       ReactiveFormsModule,
       MatCardModule,
       MatFormFieldModule,
       MatInputModule,
       MatButtonModule,
       MatSnackBarModule,
       RouterModule,
       TemaFormComponent
     ],
     providers: [
       { provide: TemaService, useValue: temaService },
       { provide: MatSnackBar, useValue: snackBar },
       { provide: Router, useValue: router },
       { provide: ActivatedRoute, useValue: activatedRoute }
     ]
   }).compileComponents();

   fixture = TestBed.createComponent(TemaFormComponent);
   component = fixture.componentInstance;
 });

 it('should create the component', () => {
   expect(component).toBeTruthy();
 });

 it('should load tema for editing when id is provided in route', () => {
   const tema = { id: 1, descricao: 'Tema de Teste' };
   temaService.getTemaById.and.returnValue(of(tema));

   component.ngOnInit();

   expect(component.isEdit).toBeTrue();
   expect(component.temaForm.value.descricao).toBe('Tema de Teste');
   expect(temaService.getTemaById).toHaveBeenCalledWith(1);
 });

 it('should call createTema when form is submitted and no id is provided', () => {
   activatedRoute.snapshot.paramMap.get = () => null;
   component.temaForm.setValue({ descricao: 'Novo Tema' });
   temaService.createTema.and.returnValue(of({ id: 1, descricao: 'Novo Tema' }));

   component.onSubmit();

   expect(temaService.createTema).toHaveBeenCalledWith({ descricao: 'Novo Tema' });
   expect(router.navigate).toHaveBeenCalledWith(['/temas']);
 });

 it('should call updateTema when form is submitted and id is provided', () => {
   component.isEdit = true;
   component.temaId = 1;
   component.temaForm.setValue({ descricao: 'Tema Atualizado' });
   temaService.updateTema.and.returnValue(of({ id: 1, descricao: 'Tema Atualizado' }));

   component.onSubmit();

   expect(temaService.updateTema).toHaveBeenCalledWith(1, { descricao: 'Tema Atualizado' });
   expect(router.navigate).toHaveBeenCalledWith(['/temas']);
 });
});