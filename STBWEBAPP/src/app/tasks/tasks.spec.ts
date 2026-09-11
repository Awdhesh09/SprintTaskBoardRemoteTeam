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
      getAll: vi.fn(() => of([])),
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
    taskServiceSpy.getAll.mockReturnValue(of(tasks));

    component.loadtask();

    expect(taskServiceSpy.getAll).toHaveBeenCalled();
    expect(component.tasksData).toEqual(tasks);
  });

  it('should send the update form payload without a duplicated id field', () => {
    component.editingId = 12;
    component.taskForm = {
      title: 'Fixed title',
      description: 'Task body',
      assignee: 'Aster',
      status: 'Open',
      dueDate: '2026-09-10',
      sprint: 'Sprint 1',
      createdAt: '2026-09-01',
      completedAt: ''
    } as any;

    component.updateTask();

    expect(taskServiceSpy.update).toHaveBeenCalledWith(12, expect.objectContaining({
      title: 'Fixed title',
      description: 'Task body',
      assignee: 'Aster',
      status: 'Open',
      dueDate: '2026-09-10',
      sprint: 'Sprint 1',
      createdAt: '2026-09-01',
      completedAt: ''
    }));

    const payload = taskServiceSpy.update.mock.calls[0][1];
    expect(payload).not.toHaveProperty('id');
  });
});
