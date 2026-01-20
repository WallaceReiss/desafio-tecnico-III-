import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';

export interface AuthUser {
  id: string;
  email: string;
  nome: string;
}

export interface AuthResponse {
  access_token: string;
  user: AuthUser;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/auth';
  private currentUserSubject = new BehaviorSubject<AuthUser | null>(this.getUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  private getUserFromStorage(): AuthUser | null {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
  }

  get currentUser(): AuthUser | null {
    return this.currentUserSubject.value;
  }

  get token(): string | null {
    return localStorage.getItem('access_token');
  }

  get isAuthenticated(): boolean {
    return !!this.token;
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap(response => this.handleAuthSuccess(response))
      );
  }

  register(nome: string, email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, { nome, email, password })
      .pipe(
        tap(response => this.handleAuthSuccess(response))
      );
  }

  private handleAuthSuccess(response: AuthResponse): void {
    localStorage.setItem('access_token', response.access_token);
    localStorage.setItem('currentUser', JSON.stringify(response.user));
    
    localStorage.setItem('userName', response.user.nome);
    localStorage.setItem('userEmail', response.user.email);
    
    this.salvarNaLista(response.user);
    
    this.currentUserSubject.next(response.user);
  }

  private salvarNaLista(user: AuthUser): void {
    const usuariosStr = localStorage.getItem('usuarios') || '[]';
    const usuarios = JSON.parse(usuariosStr);
    
    const jaExiste = usuarios.find((u: any) => u.email === user.email);
    
    if (jaExiste) {
      jaExiste.loginAt = new Date();
    } else {
      usuarios.push({
        id: user.id,
        nome: user.nome,
        email: user.email,
        loginAt: new Date()
      });
    }
    
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    this.currentUserSubject.next(null);
    
    // Força navegação para login
    this.router.navigate(['/login']).then(() => {
      window.location.reload();
    });
  }
}
