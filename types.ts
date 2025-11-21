export enum TaskStatus {
  TODO = 'Todo',
  IN_PROGRESS = 'In Progress',
  REVIEW = 'Review',
  DONE = 'Done'
}

export enum Priority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  CRITICAL = 'Critical'
}

export interface User {
  id: string;
  full_name: string;
  role: string;
  avatar_url: string;
  daily_capacity_hours: number;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  assignee_id: string;
  start_date: string; // ISO Date
  due_date: string;   // ISO Date
  estimated_time: number; // Hours
  tags: string[];
  dependencies?: string[]; // IDs of tasks this task depends on
  project_id?: string;
}

export interface TimeEntry {
  id: string;
  task_id: string;
  user_id: string;
  hours: number;
  date: string; // ISO Date
  description?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'Active' | 'On Hold' | 'Completed';
  progress: number; // 0-100
  color?: string;
  order?: number;
}