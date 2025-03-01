import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { CreateTaskDialogComponent } from './create-task-dialog.component';
import { Task } from 'src/app/models/task.model';
import { MaterialModule } from '../material.module';
import { AppModule } from 'src/app/app.module';

describe('CreateTaskDialogComponent', () => {
  let component: CreateTaskDialogComponent;
  let fixture: ComponentFixture<CreateTaskDialogComponent>;
  let dialogRefMock: any;

  beforeEach(async () => {
    dialogRefMock = {
      close: jasmine.createSpy('close')
    };

    await TestBed.configureTestingModule({
      declarations: [CreateTaskDialogComponent],
      imports: [AppModule, MaterialModule, ReactiveFormsModule, MatDialogModule],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefMock },
        { provide: MAT_DIALOG_DATA, useValue: { task: null } },
        FormBuilder
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTaskDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with default values when no task is provided', () => {
    expect(component.taskForm.value).toEqual({
      title: '',
      description: '',
      due_date: '',
      priority: ''
    });
  });

  it('should initialize the form with provided task values', () => {
    const task: Task = {
      title: 'Test Task',
      description: 'Test Description',
      due_date: '2025-03-01',
      priority: 'High',
      completed: false,
      created_at: '2025-03-01T00:00:00.000Z',
      task_id: "1",
      user_id: "1"
    };

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      declarations: [CreateTaskDialogComponent],
      imports: [AppModule, MaterialModule, ReactiveFormsModule, MatDialogModule],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefMock },
        { provide: MAT_DIALOG_DATA, useValue: { task } },
        FormBuilder
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateTaskDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.taskForm.value).toEqual({
      title: 'Test Task',
      description: 'Test Description',
      due_date: '2025-03-01',
      priority: 'High'
    });
  });

  it('should close the dialog on onNoClick', () => {
    component.onNoClick();
    expect(dialogRefMock.close).toHaveBeenCalled();
  });

  it('should close the dialog with updated task on onSubmit', () => {
    const task: Task = {
      title: 'Test Task',
      description: 'Test Description',
      due_date: '2025-03-01',
      priority: 'High',
      completed: false,
      created_at: '2025-03-01T00:00:00.000Z',
      task_id: "1",
      user_id: "1"
    };

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      declarations: [CreateTaskDialogComponent],
      imports: [AppModule, MaterialModule, ReactiveFormsModule, MatDialogModule],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefMock },
        { provide: MAT_DIALOG_DATA, useValue: { task } },
        FormBuilder
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateTaskDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.taskForm.setValue({
      title: 'Updated Task',
      description: 'Updated Description',
      due_date: '2025-03-02',
      priority: 'Medium'
    });

    component.onSubmit();

    expect(dialogRefMock.close).toHaveBeenCalledWith({
      ...task,
      ...component.taskForm.value
    });
  });

  it('should not close the dialog if the form is invalid on onSubmit', () => {
    component.taskForm.setValue({
      title: '',
      description: '',
      due_date: '',
      priority: ''
    });

    component.onSubmit();

    expect(dialogRefMock.close).not.toHaveBeenCalled();
  });
});