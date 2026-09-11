import { Service } from '@angular/core';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root', // Makes this service available application-wide (singleton)
})
export class Taskservice {
  private apiUrl = 'https://localhost:7127/api/Tasks'; //  Base API URL for TasksController

  private http: HttpClient;
  constructor(http: HttpClient) {
    this.http = http; //HttpClient injected via Angular DI
  }
  // Create a new Tasks (POST request)
  create(TaskItem: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, TaskItem);
  }
  // Get all Tasks (GET request)
  getAll(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
  // Get a Tasks by ID (GET request with parameter)
  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
  // Update an existing Tasks (PUT request)
  update(id: number, TaskItem: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, TaskItem);
  }
  // Delete a Tasks by ID (DELETE request)
  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

}
