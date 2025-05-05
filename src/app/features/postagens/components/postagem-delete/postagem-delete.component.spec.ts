import { ComponentFixture, TestBed, fakeAsync, tick, flush } from '@angular/core/testing';
import { PostagemDeleteComponent } from './postagem-delete.component';
import { ActivatedRoute, Router } from '@angular/router';
import { PostagemService } from '../../../../core/services/postagem.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Postagem } from '../../../../core/models/postagem.model';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';

describe('PostagemDeleteComponent', () => {
  let component: PostagemDeleteComponent;
  let fixture: ComponentFixture<PostagemDeleteComponent>;
  let postagemServiceSpy: jasmine.SpyObj<PostagemService>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;
  let routerSpy: jasmine.SpyObj<Router>;
  const mockPostagem: Postagem = {
    id: 1,
    titulo: 'Postagem de Teste',
    texto: 'Texto da postagem',
    creationTimestamp: '2025-05-05T10:00:00Z',
    updateTimestamp: '2025-05-05T10:00:00Z',
    usuario: { id: 1, nome: 'Test User', username: 'testuser', email: 'test@example.com' },
    tema: { id: 1, descricao: 'Tema de Teste' }
  };

  beforeEach(async () => {
    postagemServiceSpy = jasmine.createSpyObj('PostagemService', ['getPostById', 'deletePost']);
    snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const activatedRouteStub = {
      snapshot: {
        paramMap: {
          get: () => '1'
        }
      }
    };

    await TestBed.configureTestingModule({
      imports: [PostagemDeleteComponent, MatSnackBarModule, RouterTestingModule],
      providers: [
        { provide: PostagemService, useValue: postagemServiceSpy },
        { provide: MatSnackBar, useValue: snackBarSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteStub }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostagemDeleteComponent);
    component = fixture.componentInstance;
  });

  it('should load postagem on init', fakeAsync(() => {
    postagemServiceSpy.getPostById.and.returnValue(of(mockPostagem));
    fixture.detectChanges();
    tick();
    flush();
    expect(postagemServiceSpy.getPostById).toHaveBeenCalledWith(1);
    expect(component.postagem).toEqual(mockPostagem);
    expect(component.loading).toBeFalse();
  }));
});