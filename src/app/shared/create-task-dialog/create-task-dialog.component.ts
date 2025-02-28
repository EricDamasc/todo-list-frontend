import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Task } from 'src/app/models/task.model';

@Component({
  selector: 'app-create-task-dialog',
  templateUrl: './create-task-dialog.component.html',
  styleUrls: ['./create-task-dialog.component.scss']
})
export class CreateTaskDialogComponent {
  taskForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<CreateTaskDialogComponent>,
    @Inject(FormBuilder) private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: { task: Task | null }
  ) {
    // Define valores padrão para data.task se for null
    const task = data?.task || { title: '', description: '', due_date: '', priority: '' };

    this.taskForm = this.fb.group({
      title: [task.title, Validators.required],
      description: [task.description],
      due_date: [task.due_date, Validators.required],
      priority: [task.priority, Validators.required]
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      const updatedTask = {
        ...this.data.task,
        ...this.taskForm.value
      };
      this.dialogRef.close(updatedTask);
    }
  }
}