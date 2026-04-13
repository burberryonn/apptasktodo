export type TaskPriority = "low" | "medium" | "high";

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  dueDate: string | null;
  priority: TaskPriority;
  category: string;
  notes?: string;
  recurrence?: "none" | "daily" | "weekly";
  subtasks: Subtask[];
  createdAt: string;
  reminderAt?: string | null;
}

export interface HabitLog {
  date: string;
  value: number;
}

export interface Habit {
  id: string;
  title: string;
  type: "boolean" | "count";
  target: number;
  color: string;
  logs: HabitLog[];
  createdAt: string;
}

export interface Settings {
  notificationsEnabled: boolean;
  calmMode: boolean;
}

export interface HistoryLog {
  id: string;
  type: "task_completed" | "habit_updated" | "task_created";
  message: string;
  createdAt: string;
}

export interface AppData {
  tasks: Task[];
  habits: Habit[];
  settings: Settings;
  history: HistoryLog[];
  version: number;
}
