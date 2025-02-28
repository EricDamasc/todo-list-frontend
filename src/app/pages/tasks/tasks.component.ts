import { Component, OnInit } from '@angular/core';
import { Task } from '../../models/task.model';
import { TaskService } from './task.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { CreateTaskDialogComponent } from '../../shared/create-task-dialog/create-task-dialog.component';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
})
export class TasksComponent implements OnInit {
  tasks: Task[] = [];
  userName: string = 'Usuário Logado';

  constructor(
    private taskService: TaskService,
    public dialog: MatDialog,
    public router: Router,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  // Carregar todas as tarefas
  loadTasks(): void {
    this.taskService.getTasks().subscribe({
      next: (tasks: Task[]) => (this.tasks = tasks),
      error: (err: any) => console.error('Erro ao carregar tarefas', err),
    });
  }

  // Criar uma nova tarefa
  addTask(
    title: string,
    description: string,
    due_date: string,
    priority: string
  ): void {
    if (!title.trim() || !priority.trim()) return;

    const newTask: Task = {
      task_id: crypto.randomUUID(),
      user_id: 'ericdamasc', // Você pode mudar isso para pegar o usuário logado
      title,
      description,
      completed: false,
      due_date,
      priority,
    };

    this.taskService.createTask(newTask).subscribe({
      next: (task: Task) => this.tasks.push(task),
      error: (err: any) => console.error('Erro ao adicionar tarefa', err),
    });
  }

  // Atualizar uma tarefa (marcar como concluída ou editar)
  updateTask(task: Task): void {
    this.taskService.updateTask(task).subscribe({
      next: (updatedTask: Task) => {
        this.tasks = this.tasks.map((t) =>
          t.task_id === updatedTask.task_id ? updatedTask : t
        );
      },
      error: (err: any) => console.error('Erro ao atualizar tarefa', err),
    });
  }

  // Excluir uma tarefa
  deleteTask(task_id: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '360px',
      data: { task_id },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.taskService.deleteTask(task_id).subscribe({
          next: () => {
            this.tasks = this.tasks.filter((task) => task.task_id !== task_id);
          },
          error: (err: any) => console.error('Erro ao excluir tarefa', err),
        });
      }
    });
  }

  // Alterar o estado de completado
  toggleCompleted(task: Task): void {
    task.completed = !task.completed;
    this.updateTask(task);
  }

  // Definir a classe do card com base na prioridade
  getPriorityClass(priority: string): string {
    switch (priority.toLowerCase()) {
      case 'alta':
        return 'high';
      case 'média':
        return 'medium';
      case 'baixa':
        return 'low';
      default:
        return '';
    }
  }

  // Abrir o diálogo de criação de tarefas
  openCreateTaskDialog(): void {
    const dialogRef = this.dialog.open(CreateTaskDialogComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.addTask(result.title, result.description, result.due_date, result.priority);
      }
    });
  }
}
