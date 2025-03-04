import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../../models/task.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private getHeaders() {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/tasks`, {
      headers: this.getHeaders(),
    });
  }

  createTask(task: Task): Observable<Task> {
    const user_id = task.user_id;
    const params = new HttpParams().set('user_id', user_id);
    return this.http.post<Task>(`${this.apiUrl}/tasks`, [task], {
      params,
      headers: this.getHeaders(),
    });
  }

  updateTask(task: Task): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/tasks/${task.task_id}`, task, {
      headers: this.getHeaders(),
    });
  }

  deleteTask(user_id: string, id: string): Observable<void> {
    const params = new HttpParams().set('user_id', user_id);
    return this.http.delete<void>(`${this.apiUrl}/tasks/${id}`, {
      params,
      headers: this.getHeaders(),
    });
  }
}
