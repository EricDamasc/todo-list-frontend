import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { LoginComponent } from './login.component';
import { AuthService } from 'src/app/services/auth.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceMock: any;
  let routerMock: any;

  beforeEach(async () => {
    authServiceMock = {
      login: jasmine.createSpy('login').and.returnValue(of({ access_token: 'test_token' }))
    };

    routerMock = {
      navigate: jasmine.createSpy('navigate')
    };

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
        HttpClientTestingModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call authService.login on login', () => {
    const email = 'test@example.com';
    const password = 'password';
    component.email = email;
    component.password = password;

    component.login();

    expect(authServiceMock.login).toHaveBeenCalledWith(email, password);
  });

  it('should store access_token in localStorage and navigate to /tasks on successful login', () => {
    const email = 'test@example.com';
    const password = 'password';
    component.email = email;
    component.password = password;

    component.login();

    expect(localStorage.getItem('access_token')).toBe('test_token');
    expect(routerMock.navigate).toHaveBeenCalledWith(['/tasks']);
  });

  it('should emit loginSuccess on successful login', () => {
    spyOn(component.loginSuccess, 'emit');

    component.login();

    expect(component.loginSuccess.emit).toHaveBeenCalled();
  });

  it('should alert on failed login due to invalid token', () => {
    authServiceMock.login.and.returnValue(of({}));

    spyOn(window, 'alert');

    component.login();

    expect(window.alert).toHaveBeenCalledWith('Login falhou! Token inválido.');
  });

  it('should alert on failed login due to error', () => {
    authServiceMock.login.and.returnValue(throwError('error'));

    spyOn(window, 'alert');

    component.login();

    expect(window.alert).toHaveBeenCalledWith('Login falhou! Verifique suas credenciais.');
  });
});