import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { TemaService } from './tema.service';
import { environment } from '../../../environments/environment';
import { Tema, CreateTema } from '../models/tema.model';

describe('TemaService', () => {
  let service: TemaService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/temas`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TemaService]
    });
    
    service = TestBed.inject(TemaService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all temas', () => {
    const mockTemas: Tema[] = [
      { id: 1, descricao: 'Angular' },
      { id: 2, descricao: 'Spring Boot' },
      { id: 3, descricao: 'Java' }
    ];

    service.getAllTemas().subscribe(temas => {
      expect(temas.length).toBe(3);
      expect(temas).toEqual(mockTemas);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockTemas);
  });

  it('should get tema by id', () => {
    const mockTema: Tema = { id: 1, descricao: 'Angular' };

    service.getTemaById(1).subscribe(tema => {
      expect(tema).toEqual(mockTema);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockTema);
  });

  it('should create tema', () => {
    const createTema: CreateTema = { descricao: 'Novo Tema' };
    const mockResponse: Tema = { id: 4, descricao: 'Novo Tema' };

    service.createTema(createTema).subscribe(tema => {
      expect(tema).toEqual(mockResponse);
      expect(tema.id).toBe(4);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(createTema);
    req.flush(mockResponse);
  });

  it('should update tema', () => {
    const updateTema: CreateTema = { descricao: 'Tema Atualizado' };
    const mockResponse: Tema = { id: 1, descricao: 'Tema Atualizado' };

    service.updateTema(1, updateTema).subscribe(tema => {
      expect(tema).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updateTema);
    req.flush(mockResponse);
  });

  it('should delete tema', () => {
    service.deleteTema(1).subscribe();

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});