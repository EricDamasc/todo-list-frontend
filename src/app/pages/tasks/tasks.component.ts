import { Component, EventEmitter, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { Task } from '../../models/task.model';
import { TaskService } from './task.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { CreateTaskDialogComponent } from '../../shared/create-task-dialog/create-task-dialog.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
})
export class TasksComponent implements OnInit {
  @Output() logOut = new EventEmitter<void>();
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  selectedPriority: string = '';
  searchText: string = '';
  phoneForm: FormGroup;
  originalTaskState: { [key: string]: boolean } = {};
  taskChanged: { [key: string]: boolean } = {};
  userEmail: string = '';

  carregando: boolean = false;

  @ViewChild('aboutDialog') aboutDialog!: TemplateRef<any>;
  @ViewChild('phoneNumberDialog') phoneNumberDialog!: TemplateRef<any>;

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

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  applyFilters(): void {
    this.filteredTasks = this.tasks.filter(task => {
      const matchesPriority = this.selectedPriority ? task.priority === this.selectedPriority : true;
      const matchesText = task.title.toLowerCase().includes(this.searchText.toLowerCase());
      return matchesPriority && matchesText;
    });
  }

  // getTasks(): Observable<Task[]> {
  //   this.carregando = true;
  //  const tasks: Task[] = [
  //     {
  //       task_id: '1',
  //       user_id: 'ericdamasc',
  //       title: 'Tarefa 1',
  //       description: 'Descrição da Tarefa 1',
  //       completed: false,
  //       created_at: '2025-02-01',
  //       due_date: '2025-03-01',
  //       priority: 'alta'
  //     },
  //     {
  //       task_id: '2',
  //       user_id: 'ericdamasc',
  //       title: 'Tarefa 2',
  //       description: 'Descrição da Tarefa 2',
  //       completed: true,
  //       created_at: '2025-02-02',
  //       due_date: '2025-03-02',
  //       priority: 'média'
  //     },
  //     {
  //       task_id: '3',
  //       user_id: 'ericdamasc',
  //       title: 'Tarefa 3',
  //       description: 'Descrição da Tarefa 3',
  //       completed: false,
  //       created_at: '2025-02-03',
  //       due_date: '2025-03-03',
  //       priority: 'baixa'
  //     }
  // ];
  // this.carregando = false;
  // this.showNotification('Tarefas carregadas com sucesso! ✅', 'success');
  //   return of(tasks);
  // }

  // Carregar todas as tarefas
  loadTasks(): void {
    this.carregando = true;
    this.taskService.getTasks().subscribe({
      next: (tasks: Task[]) => {
        this.tasks = tasks;
        this.applyFilters();
        this.tasks.forEach(task => {
          this.originalTaskState[task.task_id] = task.completed;
        });
        this.carregando = false;
        this.showNotification('Tarefas carregadas com sucesso! ✅', 'success');
      },
      error: (err: any) => {
        console.error('Erro ao carregar tarefas', err);
        this.carregando = false;
        this.showNotification('Erro ao carregar tarefas ❌', 'error');
      }
    });
  }

  // Criar uma nova tarefa
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
        this.tasks.push(task);
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

  // Adicione um novo método para abrir o diálogo de edição
  openEditTaskDialog(task: Task): void {
    const dialogRef = this.dialog.open(CreateTaskDialogComponent, {
      width: '550px',
      autoFocus: true,
      data: { task } // Passa a tarefa selecionada como dados para o diálogo
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updateTask(result);
      }
    });
  }
  
  toggleCompleted(task: Task): void {
    task.completed = !task.completed;
    // Verifique se o estado atual é diferente do estado original
    this.taskChanged[task.task_id] = task.completed === this.originalTaskState[task.task_id];
  }

  updateTask(task: Task): void {
    this.carregando = true;
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
        this.carregando = true;
        this.taskService.deleteTask(user_id, task_id).subscribe({
          next: () => {
            this.tasks = this.tasks.filter((task) => task.task_id !== task_id);
            this.carregando = false;
            this.showNotification('Tarefa excluída com sucesso! ✅', 'success');
            this.loadTasks();
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
