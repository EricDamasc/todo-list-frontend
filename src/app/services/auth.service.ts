import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private userEmail: string = '';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(response => {
        if (response && response.access_token) {
          localStorage.setItem('access_token', response.access_token);
          localStorage.setItem('username', response.username);
          this.userEmail = response.username;
        }
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(error);
      })
    );
  }

  register(username: string, email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, { username, email, password });
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('username');
    this.userEmail = '';
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token') && !!localStorage.getItem('username');
  }

  getUserEmail(): string {
    return this.userEmail;
  }

}
