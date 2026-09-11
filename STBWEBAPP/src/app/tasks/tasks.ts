import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Taskservice } from '../services/taskservice';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

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
  pageNumber = 1;
  pageSize = 4;
  totalPages = 0;
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
    this.taskservice.getAll(this.pageNumber, this.pageSize).subscribe({
      next: data => {
        this.tasksData = data?.items ?? data?.Items ?? [];
        this.totalPages = data?.totalPages ?? data?.TotalPages ?? 0;
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
  goToPage(pageNumber: number): void {
    if (pageNumber < 1 || (this.totalPages > 0 && pageNumber > this.totalPages)) {
      return;
    }
    this.pageNumber = pageNumber;
    this.loadtask();
  }

  changePageSize(pageSize: number): void {
    this.pageSize = Number(pageSize);
    this.pageNumber = 1;
    this.loadtask();
  }

  private toApiDate(value: string): string {
    if (!value) {
      return value;
    }

    return /^\d{4}-\d{2}-\d{2}$/.test(value)
      ? `${value}T00:00:00.000Z`
      : value;
  }

  private isValidDueDate(value: string): boolean {
    return !value || !Number.isNaN(Date.parse(value));
  }

  private isValidTaskForm(): boolean {

    return true;
  }

  private buildTaskPayload() {
    const payload: Record<string, string> = {
      id: this.taskForm.id,
      title: this.taskForm.title,
      description: this.taskForm.description,
      assignee: this.taskForm.assignee,
      status: this.taskForm.status,
      dueDate: this.toApiDate(this.taskForm.dueDate),
      sprint: this.taskForm.sprint
    };

    return Object.fromEntries(
      Object.entries(payload).filter(([, value]) => value !== '')
    );
  }

  // Create new task
  saveTask(): void {
    if (!this.isValidTaskForm()) {
      return;
    }
    if (!this.isValidDueDate(this.taskForm.dueDate)) {
      this.errorMessage = 'Please enter a valid due date.';
      return;
    }

    this.taskservice.create(this.buildTaskPayload()).subscribe({
      next: () => {
        this.loadtask();  // reload list
        this.resetForm();   // reset form after save
        void Swal.fire({
          icon: 'success',
          title: 'Task saved',
          text: 'The task was saved successfully.',
          confirmButtonText: 'OK'
        });
      },
      error: err => {
        this.errorMessage = err?.error?.title ?? err?.error?.message ?? 'Failed to create task';
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
    if (!this.isValidTaskForm()) {
      return;
    }
    if (!this.isValidDueDate(this.taskForm.dueDate)) {
      this.errorMessage = 'Please enter a valid due date.';
      return;
    }
    this.taskservice.update(this.editingId, this.buildTaskPayload()).subscribe({
      next: () => {
        this.loadtask();  // reload list
        this.resetForm();   // reset form after update
        void Swal.fire({
          icon: 'success',
          title: 'Task updated',
          text: 'The task was updated successfully.',
          confirmButtonText: 'OK'
        });
      },
      error: err => {
        this.errorMessage = err?.error?.title ?? err?.error?.message ?? `Failed to update task with id ${this.editingId}`;
        console.error(err);
      }
    });
  }
  // Delete task by ID
  deleteTask(id: number): void {
    this.taskservice.delete(id).subscribe({
      next: () => {
        this.loadtask(); // reload list after delete
        void Swal.fire({
          icon: 'success',
          title: 'Task deleted',
          text: 'The task was deleted successfully.',
          confirmButtonText: 'OK'
        });
      },
      error: err => {
        this.errorMessage = `Failed to delete task with id ${id}`;
        console.error(err);
      }
    });
  }
}