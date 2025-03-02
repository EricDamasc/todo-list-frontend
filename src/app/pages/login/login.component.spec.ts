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
      login: jasmine.createSpy('login').and.returnValue(of({ access_token: 'test_token' })),
      register: jasmine.createSpy('register').and.returnValue(of({ success: true }))
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

  it('should switch mode', () => {
    component.isLoginMode = true;
    component.onSwitchMode();
    expect(component.isLoginMode).toBeFalse();
    component.onSwitchMode();
    expect(component.isLoginMode).toBeTrue();
  });

  it('should login successfully', () => {
    component.isLoginMode = true;
    component.email = 'test@example.com';
    component.password = 'password';
    const form = { valid: true, reset: jasmine.createSpy('reset') } as any;

    component.onSubmit(form);

    expect(authServiceMock.login).toHaveBeenCalledWith('test@example.com', 'password');
    expect(routerMock.navigate).toHaveBeenCalledWith(['/tasks']);
    expect(component.carregando).toBeFalse();
  });

  it('should handle login error', () => {
    authServiceMock.login.and.returnValue(throwError('error'));
    component.isLoginMode = true;
    component.email = 'test@example.com';
    component.password = 'password';
    const form = { valid: true, reset: jasmine.createSpy('reset') } as any;

    spyOn(window, 'alert');
    component.onSubmit(form);

    expect(authServiceMock.login).toHaveBeenCalledWith('test@example.com', 'password');
    expect(window.alert).toHaveBeenCalledWith('Login falhou! Verifique suas credenciais.');
    expect(component.carregando).toBeFalse();
  });

  it('should register successfully', () => {
    component.isLoginMode = false;
    component.username = 'testuser';
    component.email = 'test@example.com';
    component.password = 'password';
    component.confirmPassword = 'password';
    const form = { valid: true, reset: jasmine.createSpy('reset') } as any;

    spyOn(window, 'alert');
    component.onSubmit(form);

    expect(authServiceMock.register).toHaveBeenCalledWith('testuser', 'test@example.com', 'password');
    expect(window.alert).toHaveBeenCalledWith('Registro bem-sucedido! Faça login para continuar.');
    expect(component.isLoginMode).toBeTrue();
    expect(component.carregando).toBeFalse();
  });

  it('should handle register error', () => {
    authServiceMock.register.and.returnValue(throwError('error'));
    component.isLoginMode = false;
    component.username = 'testuser';
    component.email = 'test@example.com';
    component.password = 'password';
    component.confirmPassword = 'password';
    const form = { valid: true, reset: jasmine.createSpy('reset') } as any;

    spyOn(window, 'alert');
    component.onSubmit(form);

    expect(authServiceMock.register).toHaveBeenCalledWith('testuser', 'test@example.com', 'password');
    expect(window.alert).toHaveBeenCalledWith('Registro falhou! Tente novamente.');
    expect(component.carregando).toBeFalse();
  });

  it('should not submit if form is invalid', () => {
    const form = { valid: false, reset: jasmine.createSpy('reset') } as any;

    component.onSubmit(form);

    expect(authServiceMock.login).not.toHaveBeenCalled();
    expect(authServiceMock.register).not.toHaveBeenCalled();
  });

  it('should not register if passwords do not match', () => {
    component.isLoginMode = false;
    component.username = 'testuser';
    component.email = 'test@example.com';
    component.password = 'password';
    component.confirmPassword = 'differentpassword';
    const form = { valid: true, reset: jasmine.createSpy('reset') } as any;

    spyOn(console, 'error');
    component.onSubmit(form);

    expect(console.error).toHaveBeenCalledWith('As senhas não coincidem');
    expect(authServiceMock.register).not.toHaveBeenCalled();
  });
});