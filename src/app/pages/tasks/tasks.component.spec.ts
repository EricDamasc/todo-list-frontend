import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { of } from 'rxjs';
import { TasksComponent } from './tasks.component';
import { TaskService } from './task.service';
import { AuthService } from '../../services/auth.service';
import { Task } from '../../models/task.model';
import { AppModule } from 'src/app/app.module';
import { MaterialModule } from 'src/app/shared/material.module';

describe('TasksComponent', () => {
  let component: TasksComponent;
  let fixture: ComponentFixture<TasksComponent>;
  let taskServiceMock: any;
  let authServiceMock: any;
  let dialogMock: any;
  let snackBarMock: any;
  let routerMock: any;

  beforeEach(async () => {
    taskServiceMock = {
      getTasks: jasmine.createSpy('getTasks').and.returnValue(of([])),
      createTask: jasmine.createSpy('createTask').and.returnValue(of({})),
      updateTask: jasmine.createSpy('updateTask').and.returnValue(of({})),
      deleteTask: jasmine.createSpy('deleteTask').and.returnValue(of({}))
    };

    authServiceMock = {
      getUserEmail: jasmine.createSpy('getUserEmail').and.returnValue('test@example.com'),
      logout: jasmine.createSpy('logout')
    };

    dialogMock = {
      open: jasmine.createSpy('open').and.returnValue({
        afterClosed: () => of(true)
      }),
      closeAll: jasmine.createSpy('closeAll')
    };

    snackBarMock = {
      open: jasmine.createSpy('open')
    };

    routerMock = {
      navigate: jasmine.createSpy('navigate')
    };

    await TestBed.configureTestingModule({
      declarations: [TasksComponent],
      imports: [
        AppModule,
        MaterialModule,
        MatMenuModule,
        HttpClientTestingModule,
        RouterTestingModule,
        ReactiveFormsModule
      ],
      providers: [
        { provide: TaskService, useValue: taskServiceMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: MatDialog, useValue: dialogMock },
        { provide: MatSnackBar, useValue: snackBarMock },
        FormBuilder
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // it('should load tasks on init', () => {
  //   expect(taskServiceMock.getTasks).toHaveBeenCalled();
  // });

  // it('should apply filters correctly', () => {
  //   component.tasks = [
  //     { task_id: '1', title: 'Task 1', description: '', due_date: '', priority: 'alta', completed: false, created_at: '', user_id: '' },
  //     { task_id: '2', title: 'Task 2', description: '', due_date: '', priority: 'média', completed: false, created_at: '', user_id: '' }
  //   ];
  //   component.selectedPriority = 'alta';
  //   component.searchText = 'Task 1';
  //   component.applyFilters();
  //   expect(component.filteredTasks.length).toBe(1);
  //   expect(component.filteredTasks[0].title).toBe('Task 1');
  // });

  // it('should add a task', () => {
  //   component.addTask('New Task', 'Description', '2025-03-01', 'alta');
  //   expect(taskServiceMock.createTask).toHaveBeenCalled();
  // });

  // it('should update a task', () => {
  //   const task: Task = { task_id: '1', title: 'Updated Task', description: '', due_date: '', priority: 'alta', completed: false, created_at: '', user_id: '' };
  //   component.updateTask(task);
  //   expect(taskServiceMock.updateTask).toHaveBeenCalledWith(task);
  // });

  // it('should delete a task', () => {
  //   component.deleteTask('user_id', 'task_id');
  //   expect(dialogMock.open).toHaveBeenCalled();
  // });

  // it('should show notification', () => {
  //   component.showNotification('Test message', 'success');
  //   expect(snackBarMock.open).toHaveBeenCalledWith('Test message', '', {
  //     duration: 4000,
  //     panelClass: 'success',
  //     horizontalPosition: 'center',
  //     announcementMessage: 'Sucesso!'
  //   });
  // });

  // it('should open create task dialog', () => {
  //   component.openCreateTaskDialog();
  //   expect(dialogMock.open).toHaveBeenCalled();
  // });

  // it('should open edit task dialog', () => {
  //   const task: Task = { task_id: '1', title: 'Task', description: '', due_date: '', priority: 'alta', completed: false, created_at: '', user_id: '' };
  //   component.openEditTaskDialog(task);
  //   expect(dialogMock.open).toHaveBeenCalled();
  // });

  // it('should toggle task completion', () => {
  //   const task: Task = { task_id: '1', title: 'Task', description: '', due_date: '', priority: 'alta', completed: false, created_at: '', user_id: '' };
  //   component.toggleCompleted(task);
  //   expect(task.completed).toBe(true);
  // });

  // it('should share task via WhatsApp', () => {
  //   const task: Task = { task_id: '1', title: 'Task', description: '', due_date: '', priority: 'alta', completed: false, created_at: '', user_id: '' };
  //   component.shareTaskViaWhatsApp(task);
  //   expect(dialogMock.open).toHaveBeenCalled();
  // });

  // it('should share task via email', () => {
  //   const task: Task = { task_id: '1', title: 'Task', description: '', due_date: '', priority: 'alta', completed: false, created_at: '', user_id: '' };
  //   spyOn(window, 'open');
  //   component.shareTaskViaEmail(task);
  //   expect(window.open).toHaveBeenCalled();
  // });

  // it('should open about dialog', () => {
  //   component.openAboutDialog();
  //   expect(dialogMock.open).toHaveBeenCalled();
  // });

  // it('should close about dialog', () => {
  //   component.closeAboutDialog();
  //   expect(dialogMock.closeAll).toHaveBeenCalled();
  // });
});