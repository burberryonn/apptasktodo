import { addDays } from "date-fns";
import { AppData } from "@/lib/types";

const now = new Date();

export const seedData: AppData = {
  version: 1,
  settings: {
    notificationsEnabled: false,
    calmMode: true,
  },
  tasks: [
    {
      id: "t1",
      title: "Подготовить презентацию",
      completed: false,
      dueDate: now.toISOString(),
      priority: "high",
      category: "Работа",
      notes: "5 слайдов, акцент на результат",
      recurrence: "none",
      subtasks: [
        { id: "st1", title: "Собрать данные", completed: true },
        { id: "st2", title: "Сделать структуру", completed: false },
      ],
      createdAt: now.toISOString(),
      reminderAt: new Date(now.getTime() + 60 * 60 * 1000).toISOString(),
    },
    {
      id: "t2",
      title: "Купить продукты",
      completed: false,
      dueDate: addDays(now, 1).toISOString(),
      priority: "medium",
      category: "Дом",
      recurrence: "none",
      notes: "Молоко, овощи, рис",
      subtasks: [],
      createdAt: now.toISOString(),
    },
    {
      id: "t3",
      title: "План тренировки",
      completed: false,
      dueDate: addDays(now, 3).toISOString(),
      priority: "low",
      category: "Здоровье",
      recurrence: "weekly",
      subtasks: [],
      createdAt: now.toISOString(),
    },
  ],
  habits: [
    {
      id: "h1",
      title: "Вода",
      type: "count",
      target: 8,
      color: "#7C93FF",
      logs: [
        { date: now.toISOString().slice(0, 10), value: 4 },
        { date: addDays(now, -1).toISOString().slice(0, 10), value: 8 },
      ],
      createdAt: now.toISOString(),
    },
    {
      id: "h2",
      title: "Чтение",
      type: "boolean",
      target: 1,
      color: "#4FB7A8",
      logs: [
        { date: addDays(now, -1).toISOString().slice(0, 10), value: 1 },
      ],
      createdAt: now.toISOString(),
    },
  ],
  history: [],
};
