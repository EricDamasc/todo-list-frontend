// filepath: /e:/Eric/Documentos/Estudos/TCC/todo-list-frontend/src/app/app.component.ts
import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  isAuthenticated: boolean = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.isAuthenticated = !!localStorage.getItem('access_token');
  }

  onLoginSuccess(): void {
    this.isAuthenticated = true;
  }

  onLogout(): void {
    this.isAuthenticated = false;
    this.authService.logout();
  }
}