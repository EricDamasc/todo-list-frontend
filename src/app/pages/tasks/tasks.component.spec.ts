import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TasksComponent } from './tasks.component';
import { TaskService } from './task.service';
import { AuthService } from '../../services/auth.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatPaginatorModule } from '@angular/material/paginator';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { AppModule } from 'src/app/app.module';
import { MaterialModule } from 'src/app/shared/material.module';
import { MatMenu, MatMenuModule } from '@angular/material/menu';

describe('TasksComponent', () => {
  let component: TasksComponent;
  let fixture: ComponentFixture<TasksComponent>;
  let taskService: jasmine.SpyObj<TaskService>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;
  let snackBar: jasmine.SpyObj<MatSnackBar>;
  let dialog: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    const taskServiceSpy = jasmine.createSpyObj('TaskService', [
      'getTasks',
      'createTask',
      'updateTask',
      'deleteTask',
    ]);
    const authServiceSpy = jasmine.createSpyObj('AuthService', [
      'getUserEmail',
      'logout',
    ]);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
    const dialogSpy = jasmine.createSpyObj('MatDialog', ['open', 'closeAll']);

    await TestBed.configureTestingModule({
      declarations: [TasksComponent],
      imports: [
        NoopAnimationsModule,
        MatPaginatorModule,
        BrowserDynamicTestingModule,
        AppModule,
        MaterialModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatSnackBarModule,
        MatMenuModule,
      ],
      providers: [
        { provide: TaskService, useValue: taskServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: MatSnackBar, useValue: snackBarSpy },
        { provide: MatDialog, useValue: dialogSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TasksComponent);
    component = fixture.componentInstance;
    taskService = TestBed.inject(TaskService) as jasmine.SpyObj<TaskService>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    snackBar = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
    dialog = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;

    authService.getUserEmail.and.returnValue('test@example.com');
    taskService.getTasks.and.returnValue(of([]));
  });

  it('should load tasks on init', () => {
    component.ngOnInit();
    expect(taskService.getTasks).toHaveBeenCalled();
  });

  it('should apply filters and update paginated tasks', () => {
    component.tasks = [
      {
        task_id: '1',
        user_id: 'user1',
        title: 'Task 1',
        description: 'Description 1',
        completed: false,
        created_at: '2025-02-01',
        due_date: '2025-03-01',
        priority: 'alta',
      },
      {
        task_id: '2',
        user_id: 'user2',
        title: 'Task 2',
        description: 'Description 2',
        completed: true,
        created_at: '2025-02-02',
        due_date: '2025-03-02',
        priority: 'média',
      },
    ];
    component.applyFilters();
    expect(component.filteredTasks.length).toBe(2);
    expect(component.paginatedTasks.length).toBe(2);
  });

  it('should handle page change', () => {
    component.filteredTasks = Array.from({ length: 20 }, (_, i) => ({
      task_id: `${i + 1}`,
      user_id: `user${i + 1}`,
      title: `Task ${i + 1}`,
      description: `Description ${i + 1}`,
      completed: false,
      created_at: '2025-02-01',
      due_date: '2025-03-01',
      priority: 'alta',
    }));
    component.onPageChange({ pageIndex: 1, pageSize: 10, length: 20 });
    expect(component.currentPage).toBe(1);
    expect(component.pageSize).toBe(10);
    expect(component.paginatedTasks.length).toBe(10);
  });

  it('should add a task', () => {
    const newTask = {
      task_id: '3',
      user_id: 'user3',
      title: 'Task 3',
      description: 'Description 3',
      completed: false,
      created_at: '2025-02-03',
      due_date: '2025-03-03',
      priority: 'baixa',
    };
    taskService.createTask.and.returnValue(of(newTask));
    component.addTask('Task 3', 'Description 3', '2025-03-03', 'baixa');
    expect(taskService.createTask).toHaveBeenCalled();
  });

  it('should handle task creation error', () => {
    taskService.createTask.and.returnValue(throwError('error'));
    component.addTask('Task 3', 'Description 3', '2025-03-03', 'baixa');
    expect(snackBar.open).toHaveBeenCalledWith(
      'Erro ao adicionar tarefa ❌',
      '',
      {
        duration: 4000,
        panelClass: 'error',
        horizontalPosition: 'center',
        announcementMessage: 'Erro!',
      }
    );
  });
  it('should update a task', () => {
    const updatedTask = {
      task_id: '1',
      user_id: 'user1',
      title: 'Updated Task 1',
      description: 'Updated Description 1',
      completed: false,
      created_at: '2025-02-01',
      due_date: '2025-03-01',
      priority: 'alta',
    };
    taskService.updateTask.and.returnValue(of(updatedTask));
    component.updateTask(updatedTask);
    expect(taskService.updateTask).toHaveBeenCalled();
  });

  it('should handle task update error', () => {
    taskService.updateTask.and.returnValue(throwError('error'));
    component.updateTask({
      task_id: '1',
      user_id: 'user1',
      title: 'Task 1',
      description: 'Description 1',
      completed: false,
      created_at: '2025-02-01',
      due_date: '2025-03-01',
      priority: 'alta',
    });
    expect(snackBar.open).toHaveBeenCalledWith(
      'Erro ao atualizar tarefa tarefa ❌',
      '',
      {
        duration: 4000,
        panelClass: 'error',
        horizontalPosition: 'center',
        announcementMessage: 'Erro!',
      }
    );
  });

  it('should delete a task', () => {
    taskService.deleteTask.and.returnValue(of(void 0));
    component.deleteTask('user1', '1');
    expect(taskService.deleteTask).toHaveBeenCalled();
  });

  it('should open and close dialogs', () => {
    component.openHelpDialog();
    expect(dialog.open).toHaveBeenCalled();
    component.closeHelpDialog();
    expect(dialog.closeAll).toHaveBeenCalled();
  });

  it('should logout and navigate to login', () => {
    component.logout();
    expect(authService.logout).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should share task via Email', () => {
    const task = {
      task_id: '1',
      user_id: 'user1',
      title: 'Task 1',
      description: 'Description 1',
      completed: false,
      created_at: '2025-02-01',
      due_date: '2025-03-01',
      priority: 'alta',
    };
    spyOn(window, 'open');
    component.shareTaskViaEmail(task);
    expect(window.open).toHaveBeenCalled();
  });
});
