import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.authService.login(this.email, this.password).subscribe(
      (response) => {
        if (response.access_token) {
          localStorage.setItem('access_token', response.access_token);
          this.router.navigate(['/tasks']); // Redireciona para a tela de tarefas
        } else {
          alert('Login falhou! Token inválido.');
        }
      },
      (error) => {
        alert('Login falhou! Verifique suas credenciais.');
      }
    );
  }
}