import { Component, EventEmitter, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { Task } from '../../models/task.model';
import { TaskService } from './task.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { CreateTaskDialogComponent } from '../../shared/create-task-dialog/create-task-dialog.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
})
export class TasksComponent implements OnInit {
  @Output() logOut = new EventEmitter<void>();
  tasks: Task[] = [];
  paginatedTasks: Task[] = [];
  taskActual: Task = {
    task_id: '',
    user_id: '',
    title: '',
    description: '',
    completed: false,
    created_at: '',
    due_date: '',
    priority: '',
  };
  filteredTasks: Task[] = [];
  selectedPriority: string = '';
  searchText: string = '';
  phoneForm: FormGroup;
  originalTaskState: { [key: string]: boolean } = {};
  taskChanged: { [key: string]: boolean } = {};
  userEmail: string = '';

  carregando: boolean = false;
  pageSize: number = 10;
  currentPage: number = 0;

  @ViewChild('helpDialog') helpDialog!: TemplateRef<any>;
  @ViewChild('aboutDialog') aboutDialog!: TemplateRef<any>;
  @ViewChild('phoneNumberDialog') phoneNumberDialog!: TemplateRef<any>;
  @ViewChild('confirmUpdateDialog') confirmUpdateDialog!: TemplateRef<any>;
  confirmUpdateDialogRef!: MatDialogRef<any>;

  constructor(
    private taskService: TaskService,
    public dialog: MatDialog,
    public router: Router,
    public authService: AuthService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
  ) {
    this.phoneForm = this.fb.group({
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\+\d{1,3}\d{9,15}$/)]]
    });
  }

  ngOnInit(): void {
    this.userEmail = this.authService.getUserEmail();
    this.loadTasks();
    this.carregando = false;
  }

  openHelpDialog(): void {
    this.dialog.open(this.helpDialog, {
      width: '100%',
    });
  }

  closeHelpDialog(): void {
    this.dialog.closeAll();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  applyFilters(): void {
    this.filteredTasks = this.tasks.filter(task => {
      const matchesPriority = this.selectedPriority ? task.priority === this.selectedPriority : true;
      const matchesText = task.title ? task.title.toLowerCase().includes(this.searchText ? this.searchText.toLowerCase() : '') : false;
      return matchesPriority && matchesText;
    });
    this.updatePaginatedTasks();
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.updatePaginatedTasks();
  }

  updatePaginatedTasks(): void {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedTasks = this.filteredTasks.slice(startIndex, endIndex);
  }

  // Carregar todas as tarefas
  loadTasks(): void {
    this.taskService.getTasks().subscribe({
      next: (tasks: Task[]) => {
        this.tasks = tasks;
        this.applyFilters();
        this.tasks.forEach(task => {
          this.originalTaskState[task.task_id] = task.completed;
        });
        this.carregando = false;
        if (this.tasks.length === 0) {
          this.showNotification('Nenhuma tarefa encontrada. ℹ️', 'success');
        } else {
          this.showNotification('Tarefas carregadas com sucesso! ✅', 'success');
        }
      },
      error: (err: any) => {
        console.error('Erro ao carregar tarefas', err);
        this.carregando = false;
        this.showNotification('Erro ao carregar tarefas ❌', 'error');
      }
    });
  }

  addTask(title: string, description: string, due_date: string, priority: string): void {
    if (!title.trim() || !priority.trim()) return;
  
    const newTask: Task = {
      task_id: crypto.randomUUID(),
      user_id: this.userEmail,
      title,
      description,
      completed: false,
      created_at: new Date().toISOString(),
      due_date: new Date(due_date).toISOString(),
      priority,
    };
  
    this.carregando = true;
    this.taskService.createTask(newTask).subscribe({
      next: (task: Task) => {
        this.loadTasks();
        this.applyFilters();
        this.carregando = false;
        this.showNotification('Tarefa adicionada com sucesso! ✅', 'success');
        this.loadTasks();
      },
      error: (err: any) => {
        console.error('Erro ao adicionar tarefa', err);
        this.carregando = false;
        this.showNotification('Erro ao adicionar tarefa ❌', 'error');
      },
    });
  }

  openEditTaskDialog(task: Task): void {
    const dialogRef = this.dialog.open(CreateTaskDialogComponent, {
      width: '550px',
      autoFocus: true,
      data: { task },
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updateTask(result);
      }
    });
  }
  
  toggleCompleted(task: Task): void {
    task.completed = !task.completed;
    this.taskChanged[task.task_id] = task.completed !== this.originalTaskState[task.task_id];
    this.openConfirmUpdateDialog(task);
  }
  
  openConfirmUpdateDialog(task: Task): void {
    this.taskActual = task;
    this.confirmUpdateDialogRef = this.dialog.open(this.confirmUpdateDialog, {
      width: '400px',
      data: task
    });
  
    this.confirmUpdateDialogRef.afterClosed().subscribe(result => {
      if (!result) {
        // Reverter a alteração se o modal for fechado sem confirmação
        task.completed = this.originalTaskState[task.task_id];
        this.taskChanged[task.task_id] = false;
      }
    });
  }
  
  closeConfirmUpdateDialog(task: Task): void {
    this.confirmUpdateDialogRef.close();
    // Reverter a alteração se o modal for fechado sem confirmação
    task.completed = this.originalTaskState[task.task_id];
    this.taskChanged[task.task_id] = false;
  }
  
  updateTask(task: Task): void {
    task = task === null || task ? task : this.taskActual;
    if (this.confirmUpdateDialogRef) {
      this.confirmUpdateDialogRef.close();
    }
    this.taskService.updateTask(task).subscribe({
      next: (updatedTask: Task) => {
        this.tasks = this.tasks.map((t) =>
          t.task_id === updatedTask.task_id ? updatedTask : t
        );
        this.applyFilters();
        this.taskChanged[task.task_id] = false;
        // Atualize o estado original após a confirmação
        this.originalTaskState[task.task_id] = task.completed;
        this.carregando = false;
        this.showNotification('Tarefa atualizada com sucesso! ✅', 'success');
        this.loadTasks();
      },
      error: (err: any) => {
        this.carregando = false;
        console.error('Erro ao atualizar tarefa', err);
        this.showNotification('Erro ao atualizar tarefa tarefa ❌', 'error');
      },
    });
  }

  // Excluir uma tarefa
  deleteTask(user_id: string, task_id: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '360px',
      data: { task_id },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.carregando = false;
        this.taskService.deleteTask(user_id, task_id).subscribe({
          next: () => {
            this.loadTasks();
            this.tasks = this.tasks.filter((task) => task.task_id !== task_id);
            this.showNotification('Tarefa excluída com sucesso! ✅', 'success');
          },
          error: (err: any) => {
            this.carregando = false;
            console.error('Erro ao excluir tarefa', err);
            this.showNotification('Erro ao excluir tarefa ❌', 'error');
          },
        });
      }
    });
  }

  showNotification(message: string, type: 'success' | 'error'): void {
    this.snackBar.open(message, '', {
      duration: 4000,
      panelClass: type,
      horizontalPosition: 'center',
      announcementMessage: type === 'success' ? 'Sucesso!' : 'Erro!',      
    });
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
      width: '550px',
      autoFocus: true,
      data: { task: null },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.addTask(result.title, result.description, result.due_date, result.priority);
        this.carregando = false;
      }
    });
  }

  onCancel(): void {
    this.dialog.closeAll();
  }

  onShare(): void {
    if (this.phoneForm.valid) {
      this.dialog.closeAll();
    }
  }

  shareTaskViaWhatsApp(task: Task): void {
    const dialogRef = this.dialog.open(this.phoneNumberDialog, {
      width: '300px',
      autoFocus: true
    });
  
    dialogRef.afterClosed().subscribe(() => {
      const phoneNumber = this.phoneForm.get('phoneNumber')?.value;
      if (phoneNumber) {
        const message = `Tarefa: ${task.title}\nDescrição: ${task.description}\nData de criação: ${task.created_at}\nPrevisão de entrega: ${task.due_date}\nPrioridade: ${task.priority}\nConcluída: ${task.completed ? 'Sim' : 'Não'}\nID do Usuário: ${task.user_id}`;
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
      }
    });
  }

  shareTaskViaEmail(task: Task): void {
    const message = `Tarefa: ${task.title}\nDescrição: ${task.description}\nData de criação: ${task.created_at}\nPrevisão de entrega: ${task.due_date}\nPrioridade: ${task.priority}\nConcluída: ${task.completed ? 'Sim' : 'Não'}\nID do Usuário: ${task.user_id}`;
    const emailUrl = `mailto:?subject=${encodeURIComponent('Detalhes da Tarefa: ' + task.title)}&body=${encodeURIComponent(message)}`;
    window.open(emailUrl, '_blank');
  }

  openAboutDialog(): void {
    this.dialog.open(this.aboutDialog, {
      width: '400px',
    });
  }

  closeAboutDialog(): void {
    this.dialog.closeAll();
  }
}
