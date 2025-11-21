import { Task, User, TaskStatus, Priority, Project, TimeEntry } from './types';

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Alex Chen', role: 'Product Manager', avatar: 'https://picsum.photos/id/1005/40/40', dailyCapacityHours: 8 },
  { id: 'u2', name: 'Sam Taylor', role: 'Frontend Dev', avatar: 'https://picsum.photos/id/1012/40/40', dailyCapacityHours: 8 },
  { id: 'u3', name: 'Morgan Kim', role: 'Backend Dev', avatar: 'https://picsum.photos/id/1025/40/40', dailyCapacityHours: 8 },
  { id: 'u4', name: 'Jordan Lee', role: 'Designer', avatar: 'https://picsum.photos/id/1027/40/40', dailyCapacityHours: 6 },
];

export const MOCK_TASKS: Task[] = [
  {
    id: 't1',
    title: 'Design System Architecture Review',
    status: TaskStatus.TODO,
    priority: Priority.HIGH,
    assignee_id: 'u4',
    start_date: '2023-11-20',
    due_date: '2023-11-22',
    estimated_time: 8,
    tags: ['design', 'architecture'],
    project_id: 'p1'
  },
  {
    id: 't2',
    title: 'Implement User Auth Flow',
    status: TaskStatus.IN_PROGRESS,
    priority: Priority.HIGH,
    assignee_id: 'u3',
    start_date: '2023-11-21',
    due_date: '2023-11-24',
    estimated_time: 16,
    tags: ['backend', 'security'],
    dependencies: ['t1'],
    project_id: 'p1'
  },
  {
    id: 't3',
    title: 'Dashboard UI Components',
    status: TaskStatus.IN_PROGRESS,
    priority: Priority.MEDIUM,
    assignee_id: 'u2',
    start_date: '2023-11-22',
    due_date: '2023-11-25',
    estimated_time: 12,
    tags: ['frontend', 'ui'],
    project_id: 'p1'
  },
  {
    id: 't4',
    title: 'Setup CI/CD Pipeline',
    status: TaskStatus.DONE,
    priority: Priority.MEDIUM,
    assignee_id: 'u3',
    start_date: '2023-11-15',
    due_date: '2023-11-18',
    estimated_time: 6,
    tags: ['devops'],
    project_id: 'p1'
  },
  {
    id: 't5',
    title: 'User Research Interviews',
    status: TaskStatus.TODO,
    priority: Priority.LOW,
    assignee_id: 'u1',
    start_date: '2023-11-25',
    due_date: '2023-11-28',
    estimated_time: 10,
    tags: ['product'],
    project_id: 'p1'
  },
  {
    id: 't6',
    title: 'API Documentation',
    status: TaskStatus.REVIEW,
    priority: Priority.MEDIUM,
    assignee_id: 'u3',
    start_date: '2023-11-23',
    due_date: '2023-11-24',
    estimated_time: 4,
    tags: ['docs'],
    project_id: 'p1'
  }
];

export const MOCK_PROJECTS: Project[] = [
  { id: 'p1', name: 'InsightPM Platform', description: 'Core project management platform', status: 'Active', progress: 68, color: '#3B82F6', order: 1 },
  { id: 'p2', name: 'Mobile App Dev', description: 'iOS and Android native apps', status: 'Active', progress: 34, color: '#10B981', order: 2 },
];

export const MOCK_TIME_ENTRIES: TimeEntry[] = [
  { id: 'te1', task_id: 't4', user_id: 'u3', hours: 7, date: '2023-11-16' }, // Over estimate
  { id: 'te2', task_id: 't2', user_id: 'u3', hours: 5, date: '2023-11-21' },
  { id: 'te3', task_id: 't3', user_id: 'u2', hours: 4, date: '2023-11-22' },
];
