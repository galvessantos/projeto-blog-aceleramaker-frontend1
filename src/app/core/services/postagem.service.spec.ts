import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { PostagemService } from './postagem.service';
import { environment } from '../../../environments/environment';
import { Postagem, CreatePostagem, UpdatePostagem } from '../models/postagem.model';

describe('PostagemService', () => {
  let service: PostagemService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/postagens`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PostagemService]
    });
    
    service = TestBed.inject(PostagemService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all posts', () => {
    const mockResponse = {
      content: [
        { id: 1, titulo: 'Postagem 1', texto: 'Conteúdo 1' },
        { id: 2, titulo: 'Postagem 2', texto: 'Conteúdo 2' }
      ],
      totalElements: 2,
      totalPages: 1,
      number: 0,
      size: 10
    };

    service.getAllPosts().subscribe(response => {
      expect(response.content.length).toBe(2);
      expect(response.totalElements).toBe(2);
    });

    const req = httpMock.expectOne(`${apiUrl}?page=0&size=10`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should get all posts with title filter', () => {
    const mockResponse = {
      content: [
        { id: 1, titulo: 'Angular', texto: 'Conteúdo 1' }
      ],
      totalElements: 1,
      totalPages: 1,
      number: 0,
      size: 10
    };

    service.getAllPosts(0, 10, 'Angular').subscribe(response => {
      expect(response.content.length).toBe(1);
      expect(response.content[0].titulo).toBe('Angular');
    });

    const req = httpMock.expectOne(`${apiUrl}?page=0&size=10&titulo=Angular`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should get post by id', () => {
    const mockPost = { 
      id: 1, 
      titulo: 'Postagem Teste', 
      texto: 'Conteúdo teste',
      creationTimestamp: '2025-04-20T10:30:00',
      updateTimestamp: '2025-04-20T10:30:00',
      tema: { id: 1, descricao: 'Angular' },
      usuario: {
        id: 1, 
        nome: 'Usuário Teste', 
        username: 'usuario_teste', 
        email: 'teste@email.com'
      }
    };

    service.getPostById(1).subscribe(post => {
      expect(post).toBeTruthy();
      expect(post.id).toBe(1);
      expect(post.titulo).toBe('Postagem Teste');
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockPost);
  });

  it('should create a post', () => {
    const createPostData: CreatePostagem = {
      titulo: 'Nova Postagem',
      texto: 'Texto da nova postagem',
      temaId: 1,
      usuarioId: 1
    };

    const mockResponse = {
      id: 3,
      titulo: 'Nova Postagem',
      texto: 'Texto da nova postagem',
      creationTimestamp: '2025-04-25T14:30:00',
      updateTimestamp: '2025-04-25T14:30:00',
      tema: { id: 1, descricao: 'Angular' },
      usuario: {
        id: 1, 
        nome: 'Usuário Teste', 
        username: 'usuario_teste', 
        email: 'teste@email.com'
      }
    };

    service.createPost(createPostData).subscribe(response => {
      expect(response).toBeTruthy();
      expect(response.id).toBe(3);
      expect(response.titulo).toBe('Nova Postagem');
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(createPostData);
    req.flush(mockResponse);
  });

  it('should update a post', () => {
    const updatePostData: UpdatePostagem = {
      titulo: 'Postagem Atualizada',
      texto: 'Texto atualizado',
      temaId: 2
    };

    const mockResponse = {
      id: 1,
      titulo: 'Postagem Atualizada',
      texto: 'Texto atualizado',
      creationTimestamp: '2025-04-20T10:30:00',
      updateTimestamp: '2025-04-25T15:30:00',
      tema: { id: 2, descricao: 'Spring Boot' },
      usuario: {
        id: 1, 
        nome: 'Usuário Teste', 
        username: 'usuario_teste', 
        email: 'teste@email.com'
      }
    };

    service.updatePost(1, updatePostData).subscribe(response => {
      expect(response).toBeTruthy();
      expect(response.id).toBe(1);
      expect(response.titulo).toBe('Postagem Atualizada');
      expect(response.tema.id).toBe(2);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatePostData);
    req.flush(mockResponse);
  });

  it('should delete a post', () => {
    service.deletePost(1).subscribe();

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should get posts with advanced filters', () => {
    const params = {
      page: 0,
      size: 10,
      titulo: 'Angular',
      autor: 'João',
      temaId: '1',
      dataInicio: '2025-04-01',
      dataFim: '2025-04-30'
    };

    const mockResponse = {
      content: [
        { id: 1, titulo: 'Angular', texto: 'Conteúdo sobre Angular' }
      ],
      totalElements: 1,
      totalPages: 1,
      number: 0,
      size: 10
    };

    service.getAllPostsWithFilters(params).subscribe(response => {
      expect(response.content.length).toBe(1);
      expect(response.content[0].titulo).toBe('Angular');
    });

    const req = httpMock.expectOne(request => {
      return request.url === apiUrl && 
             request.params.get('titulo') === 'Angular' &&
             request.params.get('autor') === 'João' &&
             request.params.get('temaId') === '1' &&
             request.params.get('dataInicio') === '2025-04-01' &&
             request.params.get('dataFim') === '2025-04-30';
    });
    
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
});