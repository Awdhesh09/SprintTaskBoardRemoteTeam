import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Taskservice } from '../services/taskservice';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tasks',
  standalone: true,                       // Standalone component (no NgModule needed)
  imports: [CommonModule, FormsModule],
  templateUrl: './tasks.html',
  styleUrls: ['./tasks.css']
})
export class Tasks implements OnInit {
  tasksData: any[] = [];                 // Stores list of schemes fetched from API
  errorMessage: string | null = null;     // Holds error messages for display
  // Form model for creating/updating tasks
  taskForm = {
    id: '',
    title: '',
    description: '',
    assignee: '',
    status: '',
    dueDate: '',
    sprint: '',
    createdAt: '',
    completedAt: ''
  };
  editingId: number | null = null; //Tracks which task is being edited
  constructor(
    private taskservice: Taskservice,
    private changeDetectorRef: ChangeDetectorRef
  ) { } //Injects service
  ngOnInit(): void {
    this.loadtask(); //Load Tasks when component initializes
  }
  // Fetch all Tasks from API
  loadtask(): void {
    this.taskservice.getAll().subscribe({
      next: data => {
        this.tasksData = Array.isArray(data) ? data : [];
        this.errorMessage = null;
        this.changeDetectorRef.detectChanges();
      },
      error: err => {
        this.errorMessage = 'Failed to load task data from server';
        this.changeDetectorRef.detectChanges();
        console.error(err);
      },
    });
  }
  // Create new task
  saveTask(): void {
    const newTask = { ...this.taskForm };
    this.taskservice.create(newTask).subscribe({
      next: () => {
        this.loadtask();  // reload list
        this.resetForm();   // reset form after save
      },
      error: err => {
        this.errorMessage = 'Failed to create task';
        console.error(err);
      }
    });
  }

  // Reset form fields
  resetForm(): void {
    this.taskForm = {
      id: '',
      title: '',
      description: '',
      assignee: '',
      status: '',
      dueDate: '',
      sprint: '',
      createdAt: '',
      completedAt: ''
    };
    this.editingId = null;
  }

  // Fill form with selected task data for editing
  editTask(task: any): void {
    this.editingId = task.id;
    // Format date to yyyy-MM-dd for form input
    const formatDate = (dateStr: string) => {
      if (!dateStr) return '';
      return new Date(dateStr).toISOString().split('T')[0];
    };
    this.taskForm = {
      id: task.id,
      title: task.title,
      description: task.description,
      assignee: task.assignee,
      status: task.status,
      dueDate: formatDate(task.dueDate),
      sprint: task.sprint,
      createdAt: formatDate(task.createdAt),
      completedAt: formatDate(task.completedAt)
    };
  }
  // Update existing task
  updateTask(): void {
    if (this.editingId === null || this.editingId === undefined) {
      this.errorMessage = 'No task selected for update';
      return;
    }
    const updated = { ...this.taskForm };
    this.taskservice.update(this.editingId, updated).subscribe({
      next: () => {
        this.loadtask();  // reload list
        this.resetForm();   // reset form after update
      },
      error: err => {
        this.errorMessage = `Failed to update task with id ${this.editingId}`;
        console.error(err);
      }
    });
  }
  // Delete task by ID
  deleteTask(id: number): void {
    this.taskservice.delete(id).subscribe({
      next: () => this.loadtask(), // reload list after delete
      error: err => {
        this.errorMessage = `Failed to delete task with id ${id}`;
        console.error(err);
      }
    });
  }
}