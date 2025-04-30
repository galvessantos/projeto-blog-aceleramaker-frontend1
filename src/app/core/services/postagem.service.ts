import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Postagem, CreatePostagem, UpdatePostagem } from '../models/postagem.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PostagemService {
  private apiUrl = `${environment.apiUrl}/postagens`;

  constructor(private http: HttpClient) { }

  getAllPosts(page: number = 0, size: number = 10, titulo?: string): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    if (titulo) {
      params = params.set('titulo', titulo);
    }
    
    return this.http.get<any>(this.apiUrl, { params });
  }

  getPostById(id: number): Observable<Postagem> {
    return this.http.get<Postagem>(`${this.apiUrl}/${id}`);
  }

  createPost(post: CreatePostagem): Observable<Postagem> {
    return this.http.post<Postagem>(this.apiUrl, post);
  }

  updatePost(id: number, post: UpdatePostagem): Observable<Postagem> {
    return this.http.put<Postagem>(`${this.apiUrl}/${id}`, post);
  }

  deletePost(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  getPostsByTema(temaId: number, page: number = 0, size: number = 10): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    return this.http.get<any>(`${this.apiUrl}/tema/${temaId}`, { params });
  }

  getPostsByUsuario(usuarioId: number, page: number = 0, size: number = 10): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    return this.http.get<any>(`${this.apiUrl}/usuario/${usuarioId}`, { params });
  }
}