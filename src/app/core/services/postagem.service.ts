import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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
    
    return this.http.get<PageResponse<Postagem>>(url);
  }
  
  getPostById(id: number): Observable<Postagem> {
    return this.http.get<Postagem>(`${this.apiUrl}/${id}`);
  }
  
  createPost(postagem: CreatePostagem): Observable<Postagem> {
    return this.http.post<Postagem>(this.apiUrl, postagem);
  }
  
  updatePost(id: number, postagem: UpdatePostagem): Observable<Postagem> {
    return this.http.put<Postagem>(`${this.apiUrl}/${id}`, postagem);
  }
  
  deletePost(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}