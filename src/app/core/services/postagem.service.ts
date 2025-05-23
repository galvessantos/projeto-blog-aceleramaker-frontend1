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
    
    return this.http.get<PageResponse<Postagem>>(url).pipe(
      catchError(error => {
        return throwError(() => error);
      })
    );
  }
  
  getPostById(id: number): Observable<Postagem> {
    return this.http.get<Postagem>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        return throwError(() => error);
      })
    );
  }
  
  createPost(postagem: CreatePostagem): Observable<Postagem> {
    return this.http.post<Postagem>(this.apiUrl, postagem).pipe(
      catchError(error => {
        if (error.error) {
        }
        return throwError(() => error);
      })
    );
  }
  
  updatePost(id: number, postagem: UpdatePostagem): Observable<Postagem> {
    return this.http.put<Postagem>(`${this.apiUrl}/${id}`, postagem).pipe(
      catchError(error => {
        return throwError(() => error);
      })
    );
  }
  
  deletePost(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
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
      catchError(error => {
        return throwError(() => error);
      })
    );
  }
}