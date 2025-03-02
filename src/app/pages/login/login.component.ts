import { Component, EventEmitter, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  @Output() loginSuccess = new EventEmitter<void>();
  isLoginMode = true;
  username = '';
  email = '';
  password = '';
  confirmPassword = '';
  carregando = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    this.carregando = true;
    if (!form.valid) {
      return;
    }

    const email = this.email;
    const password = this.password;

    if (this.isLoginMode) {
      // Lógica de login
      this.authService.login(email, password).subscribe(response => {
        console.log(response);
        if (response.access_token) {
          localStorage.setItem('access_token', response.access_token);
          this.loginSuccess.emit();
          this.router.navigate(['/tasks']);
          this.carregando = false;
        } else {
          this.carregando = false;
          alert('Login falhou! Token inválido.');
        }
      }, error => {
        this.carregando = false;
        alert('Login falhou! Verifique suas credenciais.');
      });
    } else {
      // Lógica de registro
      const username = this.username;
      const confirmPassword = this.confirmPassword;

      if (password !== confirmPassword) {
        console.error('As senhas não coincidem');
        return;
      }
      this.carregando = false;
      this.authService.register(username, email, password).subscribe(response => {
        console.log(response);
        if (response.success) {
          alert('Registro bem-sucedido! Faça login para continuar.');
          this.isLoginMode = true;
        } else {
          alert('Registro falhou! Tente novamente.');
        }
      }, error => {
        alert('Registro falhou! Tente novamente.');
      });
    }

    form.reset();
  }
}