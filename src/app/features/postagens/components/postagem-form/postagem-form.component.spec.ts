import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { of, throwError } from 'rxjs';

import { PostagemFormComponent } from './postagem-form.component';
import { PostagemService } from '../../../../core/services/postagem.service';
import { TemaService } from '../../../../core/services/tema.service';
import { AuthService } from '../../../../core/services/auth.service';

describe('PostagemFormComponent', () => {
  let component: PostagemFormComponent;
  let fixture: ComponentFixture<PostagemFormComponent>;
  let postagemService: jasmine.SpyObj<PostagemService>;
  let temaService: jasmine.SpyObj<TemaService>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: Router;

  const mockTemas = [
    { id: 1, descricao: 'Angular' },
    { id: 2, descricao: 'Spring Boot' },
    { id: 3, descricao: 'Java' }
  ];

  const mockPostagem = {
    id: 1,
    titulo: 'Postagem de Teste',
    texto: 'Conteúdo da postagem de teste',
    tema: { id: 1, descricao: 'Angular' },
    usuario: { id: 1, nome: 'Usuário Teste', username: 'usuario_teste', email: 'teste@email.com' },
    creationTimestamp: '2025-04-25T10:30:00',
    updateTimestamp: '2025-04-25T10:30:00'
  };

  beforeEach(async () => {
    const postagemServiceSpy = jasmine.createSpyObj('PostagemService', [
      'createPost', 'updatePost', 'getPostById'
    ]);
    const temaServiceSpy = jasmine.createSpyObj('TemaService', ['getAllTemas']);
    const authServiceSpy = jasmine.createSpyObj('AuthService', [
      'getUserId', 'isLoggedIn'
    ]);

    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        MatSnackBarModule,
        PostagemFormComponent
      ],
      providers: [
        { provide: PostagemService, useValue: postagemServiceSpy },
        { provide: TemaService, useValue: temaServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({})
            }
          }
        }
      ]
    }).compileComponents();

    postagemService = TestBed.inject(PostagemService) as jasmine.SpyObj<PostagemService>;
    temaService = TestBed.inject(TemaService) as jasmine.SpyObj<TemaService>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router);

    temaService.getAllTemas.and.returnValue(of(mockTemas));
    authService.getUserId.and.returnValue(1);
    authService.isLoggedIn.and.returnValue(true);
    postagemService.createPost.and.returnValue(of(mockPostagem));

    fixture = TestBed.createComponent(PostagemFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load temas on init', () => {
    expect(temaService.getAllTemas).toHaveBeenCalled();
    expect(component.temas.length).toBe(3);
  });

  it('should initialize form in creation mode', () => {
    expect(component.isEdit).toBeFalse();
    expect(component.postagemForm).toBeTruthy();
    expect(component.postagemForm.get('titulo')).toBeTruthy();
    expect(component.postagemForm.get('texto')).toBeTruthy();
    expect(component.postagemForm.get('temaId')).toBeTruthy();
  });

  it('should validate required fields', () => {
    const tituloControl = component.postagemForm.get('titulo');
    const textoControl = component.postagemForm.get('texto');
    const temaIdControl = component.postagemForm.get('temaId');

    tituloControl?.setValue('');
    textoControl?.setValue('');
    temaIdControl?.setValue(null);

    expect(tituloControl?.valid).toBeFalse();
    expect(textoControl?.valid).toBeFalse();
    expect(temaIdControl?.valid).toBeFalse();
    expect(component.postagemForm.valid).toBeFalse();

    tituloControl?.setValue('Título Válido');
    textoControl?.setValue('Texto válido para a postagem');
    temaIdControl?.setValue(1);

    expect(tituloControl?.valid).toBeTrue();
    expect(textoControl?.valid).toBeTrue();
    expect(temaIdControl?.valid).toBeTrue();
    expect(component.postagemForm.valid).toBeTrue();
  });

  it('should create post when form is submitted in creation mode', fakeAsync(() => {
    spyOn(router, 'navigate');
    
    component.postagemForm.setValue({
      titulo: 'Nova Postagem',
      texto: 'Conteúdo da nova postagem',
      temaId: 1
    });

    component.onSubmit();
    tick();

    expect(postagemService.createPost).toHaveBeenCalledWith({
      titulo: 'Nova Postagem',
      texto: 'Conteúdo da nova postagem',
      temaId: 1,
      usuarioId: 1
    });
    expect(router.navigate).toHaveBeenCalledWith(['/postagens']);
  }));

  it('should handle error when creating post fails', fakeAsync(() => {
    postagemService.createPost.and.returnValue(throwError(() => new Error('Erro ao criar')));
    
    component.postagemForm.setValue({
      titulo: 'Nova Postagem',
      texto: 'Conteúdo da nova postagem',
      temaId: 1
    });

    component.onSubmit();
    tick();

    expect(component.submitting).toBeFalse();
  }));
});

describe('PostagemFormComponent - Edit Mode', () => {
  let component: PostagemFormComponent;
  let fixture: ComponentFixture<PostagemFormComponent>;
  let postagemService: jasmine.SpyObj<PostagemService>;
  let temaService: jasmine.SpyObj<TemaService>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: Router;

  const mockTemas = [
    { id: 1, descricao: 'Angular' },
    { id: 2, descricao: 'Spring Boot' },
    { id: 3, descricao: 'Java' }
  ];

  const mockPostagem = {
    id: 1,
    titulo: 'Postagem de Teste',
    texto: 'Conteúdo da postagem de teste',
    tema: { id: 1, descricao: 'Angular' },
    usuario: { id: 1, nome: 'Usuário Teste', username: 'usuario_teste', email: 'teste@email.com' },
    creationTimestamp: '2025-04-25T10:30:00',
    updateTimestamp: '2025-04-25T10:30:00'
  };

  beforeEach(async () => {
    const postagemServiceSpy = jasmine.createSpyObj('PostagemService', [
      'createPost', 'updatePost', 'getPostById'
    ]);
    const temaServiceSpy = jasmine.createSpyObj('TemaService', ['getAllTemas']);
    const authServiceSpy = jasmine.createSpyObj('AuthService', [
      'getUserId', 'isLoggedIn'
    ]);

    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        MatSnackBarModule,
        PostagemFormComponent
      ],
      providers: [
        { provide: PostagemService, useValue: postagemServiceSpy },
        { provide: TemaService, useValue: temaServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({ id: '1' })
            }
          }
        }
      ]
    }).compileComponents();

    postagemService = TestBed.inject(PostagemService) as jasmine.SpyObj<PostagemService>;
    temaService = TestBed.inject(TemaService) as jasmine.SpyObj<TemaService>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router);

    temaService.getAllTemas.and.returnValue(of(mockTemas));
    authService.getUserId.and.returnValue(1);
    authService.isLoggedIn.and.returnValue(true);
    postagemService.getPostById.and.returnValue(of(mockPostagem));
    postagemService.updatePost.and.returnValue(of(mockPostagem));

    fixture = TestBed.createComponent(PostagemFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should load postagem data in edit mode', () => {
    expect(postagemService.getPostById).toHaveBeenCalledWith(1);
    expect(component.isEdit).toBeTrue();
    expect(component.postagemId).toBe(1);
    expect(component.postagemForm.get('titulo')?.value).toBe('Postagem de Teste');
    expect(component.postagemForm.get('texto')?.value).toBe('Conteúdo da postagem de teste');
    expect(component.postagemForm.get('temaId')?.value).toBe(1);
  });

  it('should update post when form is submitted in edit mode', fakeAsync(() => {
    spyOn(router, 'navigate');
    
    component.postagemForm.setValue({
      titulo: 'Postagem Atualizada',
      texto: 'Conteúdo atualizado',
      temaId: 2
    });

    component.onSubmit();
    tick();

    expect(postagemService.updatePost).toHaveBeenCalledWith(1, {
      titulo: 'Postagem Atualizada',
      texto: 'Conteúdo atualizado',
      temaId: 2
    });
    expect(router.navigate).toHaveBeenCalledWith(['/postagens']);
  }));

  it('should handle error when updating post fails', fakeAsync(() => {
    postagemService.updatePost.and.returnValue(throwError(() => new Error('Erro ao atualizar')));
    
    component.postagemForm.setValue({
      titulo: 'Postagem Atualizada',
      texto: 'Conteúdo atualizado',
      temaId: 2
    });

    component.onSubmit();
    tick();

    expect(component.submitting).toBeFalse();
  }));
});