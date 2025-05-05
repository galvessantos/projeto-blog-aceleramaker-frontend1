import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Postagem, CreatePostagem, UpdatePostagem, PageResponse } from '../models/postagem.model';

@Injectable({
  providedIn: 'root'
})
export class PostagemService {
  private apiUrl = `${environment.apiUrl}/postagens`;
  
  constructor(private http: HttpClient) {}
  
  getAllPosts(page: number = 0, size: number = 10, titulo: string = ''): Observable<PageResponse<Postagem>> {
    let url = `${this.apiUrl}?page=${page}&size=${size}`;
    
    if (titulo) {
      url += `&titulo=${titulo}`;
    }
    
    console.log('Buscando postagens:', url);
    return this.http.get<PageResponse<Postagem>>(url).pipe(
      tap(response => console.log('Postagens recebidas:', response.content.length)),
      catchError(error => {
        console.error('Erro ao buscar postagens:', error);
        return throwError(() => error);
      })
    );
  }
  
  getPostById(id: number): Observable<Postagem> {
    console.log('Buscando postagem por ID:', id);
    return this.http.get<Postagem>(`${this.apiUrl}/${id}`).pipe(
      tap(response => console.log('Postagem recebida:', response)),
      catchError(error => {
        console.error('Erro ao buscar postagem por ID:', error);
        return throwError(() => error);
      })
    );
  }
  
  createPost(postagem: CreatePostagem): Observable<Postagem> {
    console.log('PostagemService: enviando dados para criação:', postagem);
    return this.http.post<Postagem>(this.apiUrl, postagem).pipe(
      tap(response => console.log('PostagemService: resposta da criação:', response)),
      catchError(error => {
        console.error('PostagemService: erro na criação:', error);
        console.error('Status:', error.status);
        console.error('Mensagem:', error.message);
        if (error.error) {
          console.error('Detalhes do erro:', error.error);
        }
        return throwError(() => error);
      })
    );
  }
  
  updatePost(id: number, postagem: UpdatePostagem): Observable<Postagem> {
    console.log('Atualizando postagem:', id, postagem);
    return this.http.put<Postagem>(`${this.apiUrl}/${id}`, postagem).pipe(
      tap(response => console.log('Postagem atualizada:', response)),
      catchError(error => {
        console.error('Erro ao atualizar postagem:', error);
        return throwError(() => error);
      })
    );
  }
  
  deletePost(id: number): Observable<void> {
    console.log('Excluindo postagem:', id);
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => console.log('Postagem excluída com sucesso')),
      catchError(error => {
        console.error('Erro ao excluir postagem:', error);
        return throwError(() => error);
      })
    );
  }

  getAllPostsWithFilters(params: any): Observable<PageResponse<Postagem>> {
    let httpParams = new HttpParams()
      .set('page', params.page.toString())
      .set('size', params.size.toString());
    
    if (params.titulo) {
      httpParams = httpParams.set('titulo', params.titulo);
    }
    
    if (params.autor) {
      httpParams = httpParams.set('autor', params.autor);
    }
    
    if (params.temaId) {
      httpParams = httpParams.set('temaId', params.temaId);
    }
    
    if (params.dataInicio) {
      httpParams = httpParams.set('dataInicio', params.dataInicio);
    }
    
    if (params.dataFim) {
      httpParams = httpParams.set('dataFim', params.dataFim);
    }
    
    return this.http.get<PageResponse<Postagem>>(this.apiUrl, { params: httpParams }).pipe(
      tap(response => console.log('Postagens filtradas recebidas:', response.content.length)),
      catchError(error => {
        console.error('Erro ao buscar postagens com filtros:', error);
        return throwError(() => error);
      })
    );
  }
}