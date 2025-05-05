import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';

import { PostagemListaComponent } from './postagem-lista.component';
import { PostagemService } from '../../../../core/services/postagem.service';
import { TemaService } from '../../../../core/services/tema.service';

describe('PostagemListaComponent', () => {
  let component: PostagemListaComponent;
  let fixture: ComponentFixture<PostagemListaComponent>;
  let postagemService: jasmine.SpyObj<PostagemService>;
  let temaService: jasmine.SpyObj<TemaService>;

  const mockPageResponse = {
    content: [
      {
        id: 1,
        titulo: 'Postagem 1',
        texto: 'Texto da postagem 1',
        creationTimestamp: '2025-04-20T10:30:00',
        updateTimestamp: '2025-04-20T10:30:00',
        tema: { id: 1, descricao: 'Angular' },
        usuario: {
          id: 1, 
          nome: 'Usuário Teste', 
          username: 'usuario_teste', 
          email: 'teste@email.com'
        }
      },
      {
        id: 2,
        titulo: 'Postagem 2',
        texto: 'Texto da postagem 2',
        creationTimestamp: '2025-04-21T14:20:00',
        updateTimestamp: '2025-04-21T14:20:00',
        tema: { id: 2, descricao: 'Spring Boot' },
        usuario: {
          id: 1, 
          nome: 'Usuário Teste', 
          username: 'usuario_teste', 
          email: 'teste@email.com'
        }
      }
    ],
    pageable: {
      pageNumber: 0,
      pageSize: 10,
      sort: {
        empty: true,
        sorted: false,
        unsorted: true
      },
      offset: 0,
      unpaged: false,
      paged: true
    },
    last: true,
    totalElements: 2,
    totalPages: 1,
    size: 10,
    number: 0,
    sort: {
      empty: true,
      sorted: false,
      unsorted: true
    },
    first: true,
    numberOfElements: 2,
    empty: false
  };

  const mockTemas = [
    { id: 1, descricao: 'Angular' },
    { id: 2, descricao: 'Spring Boot' },
    { id: 3, descricao: 'Java' }
  ];

  beforeEach(async () => {
    const postagemServiceSpy = jasmine.createSpyObj('PostagemService', [
      'getAllPostsWithFilters', 'getAllPosts'
    ]);
    const temaServiceSpy = jasmine.createSpyObj('TemaService', ['getAllTemas']);

    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MatSnackBarModule,
        BrowserAnimationsModule,
        PostagemListaComponent
      ],
      providers: [
        { provide: PostagemService, useValue: postagemServiceSpy },
        { provide: TemaService, useValue: temaServiceSpy }
      ]
    }).compileComponents();

    postagemService = TestBed.inject(PostagemService) as jasmine.SpyObj<PostagemService>;
    temaService = TestBed.inject(TemaService) as jasmine.SpyObj<TemaService>;

    postagemService.getAllPostsWithFilters.and.returnValue(of(mockPageResponse));
    postagemService.getAllPosts.and.returnValue(of(mockPageResponse));
    temaService.getAllTemas.and.returnValue(of(mockTemas));

    fixture = TestBed.createComponent(PostagemListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load postagens on init', () => {
    expect(postagemService.getAllPostsWithFilters).toHaveBeenCalled();
    expect(component.postagens.length).toBe(2);
    expect(component.totalItems).toBe(2);
  });

  it('should load temas on init', () => {
    expect(temaService.getAllTemas).toHaveBeenCalled();
    expect(component.temas.length).toBe(3);
  });

  it('should toggle expanded state of a postagem', () => {
    const postagem = mockPageResponse.content[0];
    expect(component.isExpanded(postagem)).toBeFalsy();
    
    component.toggleExpanded(postagem);
    expect(component.isExpanded(postagem)).toBeTruthy();
    
    component.toggleExpanded(postagem);
    expect(component.isExpanded(postagem)).toBeFalsy();
  });

  it('should search postagens when onSearch is called', fakeAsync(() => {
    component.searchTerm = 'Angular';
    component.onSearch();
    tick();

    expect(component.currentPage).toBe(0);
    expect(postagemService.getAllPostsWithFilters).toHaveBeenCalled();
  }));

  it('should clear search term when clearSearch is called', fakeAsync(() => {
    component.searchTerm = 'Angular';
    component.clearSearch();
    tick();

    expect(component.searchTerm).toBe('');
    expect(component.currentPage).toBe(0);
    expect(postagemService.getAllPostsWithFilters).toHaveBeenCalled();
  }));

  it('should toggle advanced search panel', () => {
    expect(component.showAdvancedSearch).toBeFalsy();
    component.toggleAdvancedSearch();
    expect(component.showAdvancedSearch).toBeTruthy();
    component.toggleAdvancedSearch();
    expect(component.showAdvancedSearch).toBeFalsy();
  });

  it('should clear all filters when clearAllFilters is called', fakeAsync(() => {
    component.searchTerm = 'Angular';
    component.authorFilter = 'John';
    component.themeFilter = '1';
    component.startDate = new Date();
    component.endDate = new Date();

    component.clearAllFilters();
    tick();

    expect(component.searchTerm).toBe('');
    expect(component.authorFilter).toBe('');
    expect(component.themeFilter).toBe('');
    expect(component.startDate).toBeNull();
    expect(component.endDate).toBeNull();
    expect(component.currentPage).toBe(0);
    expect(postagemService.getAllPostsWithFilters).toHaveBeenCalled();
  }));

  it('should handle error when loading postagens fails', fakeAsync(() => {
    postagemService.getAllPostsWithFilters.and.returnValue(throwError(() => new Error('Erro ao carregar')));
    
    component.loadPostagens();
    tick();

    expect(component.loading).toBeFalse();
    expect(component.postagens.length).toBe(0);
  }));
});