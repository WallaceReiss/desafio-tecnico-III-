import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Exame, PaginatedResponse } from '../models/paciente.model';

@Injectable({
  providedIn: 'root'
})
export class ExameService {
  private apiUrl = 'http://localhost:3000/exames';

  constructor(private http: HttpClient) { }

  criar(exame: Exame): Observable<Exame> {
    return this.http.post<Exame>(this.apiUrl, exame);
  }

  buscarTodos(page: number = 1, pageSize: number = 10): Observable<PaginatedResponse<Exame>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
    
    return this.http.get<PaginatedResponse<Exame>>(this.apiUrl, { params });
  }

  buscarPorId(id: string): Observable<Exame> {
    return this.http.get<Exame>(`${this.apiUrl}/${id}`);
  }

  deletar(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
