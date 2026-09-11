import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { Taskservice } from '../services/taskservice';
import { Tasks } from './tasks';

describe('Tasks', () => {
  let component: Tasks;
  let fixture: ComponentFixture<Tasks>;
  let taskServiceSpy: any;

  beforeEach(async () => {
    taskServiceSpy = {
      getAll: vi.fn(() => of({ items: [], totalPages: 0 })),
      create: vi.fn(() => of({})),
      update: vi.fn(() => of({})),
      delete: vi.fn(() => of({}))
    };

    await TestBed.configureTestingModule({
      imports: [Tasks],
      providers: [{ provide: Taskservice, useValue: taskServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(Tasks);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load tasks when the component initializes', () => {
    const tasks = [{ id: 1, title: 'Initial task' }];
    taskServiceSpy.getAll.mockReturnValue(of({ items: tasks, totalPages: 1 }));

    component.loadtask();

    expect(taskServiceSpy.getAll).toHaveBeenCalledWith(1, 4);
    expect(component.tasksData).toEqual(tasks);
  });

  it('should load the requested page', () => {
    component.totalPages = 3;
    component.goToPage(2);

    expect(taskServiceSpy.getAll).toHaveBeenLastCalledWith(2, 4);
  });

  it('should send only API task fields when creating a task', () => {
    component.taskForm = {
      id: '',
      title: 'Setup Docker containers',
      description: 'Dockerize backend and frontend',
      assignee: 'Kiran',
      status: 'In Progress',
      dueDate: '2026-09-27',
      sprint: 'Sprint 25',
      createdAt: '',
      completedAt: ''
    };

    component.saveTask();

    expect(taskServiceSpy.create).toHaveBeenCalledWith({
      title: 'Setup Docker containers',
      description: 'Dockerize backend and frontend',
      assignee: 'Kiran',
      status: 'In Progress',
      dueDate: '2026-09-27T00:00:00.000Z',
      sprint: 'Sprint 25'
    });
  });

  it('should send the update form payload without a duplicated id field', () => {
    component.editingId = 12;
    component.taskForm = {
      title: 'Fixed title',
      description: 'Task body',
      assignee: 'Aster',
      status: 'Open',
      dueDate: '2026-09-10T00:00:00.000Z',
      sprint: 'Sprint 1',
      createdAt: '',
      completedAt: ''
    } as any;

    component.updateTask();

    expect(taskServiceSpy.update).toHaveBeenCalledWith(12, expect.objectContaining({
      title: 'Fixed title',
      description: 'Task body',
      assignee: 'Aster',
      status: 'Open',
      dueDate: '2026-09-10T00:00:00.000Z',
      sprint: 'Sprint 1'
    }));

    const payload = taskServiceSpy.update.mock.calls[0][1];
    expect(payload).not.toHaveProperty('id');
  });

  it('should preserve an ISO due date when creating a task', () => {
    component.taskForm = {
      id: '',
      title: 'Implement login page',
      description: 'UI + API integration',
      assignee: 'Awdhesh',
      status: 'Not Started',
      dueDate: '2026-09-11T06:38:57.795Z',
      sprint: 'Sprint 24',
      createdAt: '',
      completedAt: ''
    };

    component.saveTask();

    expect(taskServiceSpy.create).toHaveBeenCalledWith({
      title: 'Implement login page',
      description: 'UI + API integration',
      assignee: 'Awdhesh',
      status: 'Not Started',
      dueDate: '2026-09-11T06:38:57.795Z',
      sprint: 'Sprint 24'
    });
  });

  it('should reject an invalid due date before creating a task', () => {
    component.taskForm = {
      id: '',
      title: 'Implement login page',
      description: 'UI + API integration',
      assignee: 'Awdhesh',
      status: 'Not Started',
      dueDate: 'not-a-date',
      sprint: 'Sprint 24',
      createdAt: '',
      completedAt: ''
    };

    component.saveTask();

    expect(taskServiceSpy.create).not.toHaveBeenCalled();
    expect(component.errorMessage).toBe('Please enter a valid due date.');
  });

  it('should report the missing status instead of blaming a valid title', () => {
    component.taskForm.title = 'Implement login page';
    component.taskForm.status = ' ';

    component.saveTask();

    expect(taskServiceSpy.create).not.toHaveBeenCalled();
    expect(component.errorMessage).toBe('Status is required.');
  });
});
