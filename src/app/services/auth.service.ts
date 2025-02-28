import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://kloc449ejb.execute-api.us-east-1.amazonaws.com/api/login'; // Substitua pelo endpoint da AWS
  private userEmail: string = '';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, { email, password }).pipe(
      tap(response => {
        if (response && response.access_token) {
          localStorage.setItem('access_token', response.access_token);
          this.userEmail = email;
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('acess_token');
    this.userEmail = '';
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  }

  getUserEmail(): string {
    return this.userEmail;
  }
}
