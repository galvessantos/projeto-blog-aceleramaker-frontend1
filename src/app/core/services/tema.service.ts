import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Tema, CreateTema } from '../models/tema.model';

@Injectable({
  providedIn: 'root'
})
export class TemaService {
  private apiUrl = `${environment.apiUrl}/temas`;
  
  constructor(private http: HttpClient) {}
  
  getAllTemas(): Observable<Tema[]> {
    return this.http.get<Tema[]>(this.apiUrl);
  }
  
  getTemaById(id: number): Observable<Tema> {
    return this.http.get<Tema>(`${this.apiUrl}/${id}`);
  }
  
  createTema(tema: CreateTema): Observable<Tema> {
    return this.http.post<Tema>(this.apiUrl, tema);
  }
  
  updateTema(id: number, tema: CreateTema): Observable<Tema> {
    return this.http.put<Tema>(`${this.apiUrl}/${id}`, tema);
  }
  
  deleteTema(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}