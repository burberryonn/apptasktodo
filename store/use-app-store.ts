"use client";

import { create } from "zustand";
import { format } from "date-fns";
import { getData, saveData } from "@/lib/storage";
import { AppData, Habit, Settings, Task } from "@/lib/types";
import { seedData } from "@/lib/seed-data";

interface UIState {
  activeDate: string;
  selectedHabitId?: string;
}

interface AppState {
  data: AppData;
  ui: UIState;
  hydrated: boolean;
  load: () => Promise<void>;
  addTask: (title: string, dueDate?: string | null) => void;
  toggleTask: (taskId: string) => void;
  updateTask: (taskId: string, patch: Partial<Task>) => void;
  moveTaskToDate: (taskId: string, dueDate: string | null) => void;
  addSubtask: (taskId: string, title: string) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  addHabit: (title: string, target: number, type?: Habit["type"]) => void;
  incrementHabit: (habitId: string) => void;
  decrementHabit: (habitId: string) => void;
  updateHabitTarget: (habitId: string, target: number) => void;
  setSettings: (settings: Partial<Settings>) => void;
  setActiveDate: (date: string) => void;
}

const persist = async (data: AppData) => {
  await saveData(data);
};

const habitColors = ["#7C93FF", "#4FB7A8", "#F59E0B", "#F472B6", "#A78BFA"];

export const useAppStore = create<AppState>((set, get) => ({
  data: seedData,
  ui: { activeDate: format(new Date(), "yyyy-MM-dd") },
  hydrated: false,

  load: async () => {
    const data = await getData();
    set({ data, hydrated: true });
  },

  addTask: (title, dueDate = null) => {
    const task: Task = {
      id: crypto.randomUUID(),
      title,
      completed: false,
      dueDate,
      priority: "medium",
      category: "Личное",
      recurrence: "none",
      subtasks: [],
      createdAt: new Date().toISOString(),
    };

    const data = {
      ...get().data,
      tasks: [task, ...get().data.tasks],
      history: [
        {
          id: crypto.randomUUID(),
          type: "task_created" as const,
          message: `Добавлена задача: ${title}`,
          createdAt: new Date().toISOString(),
        },
        ...get().data.history,
      ],
    };
    set({ data });
    void persist(data);
  },

  toggleTask: (taskId) => {
    const data = {
      ...get().data,
      tasks: get().data.tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task,
      ),
    };
    set({ data });
    void persist(data);
  },

  updateTask: (taskId, patch) => {
    const data = {
      ...get().data,
      tasks: get().data.tasks.map((task) => (task.id === taskId ? { ...task, ...patch } : task)),
    };
    set({ data });
    void persist(data);
  },

  moveTaskToDate: (taskId, dueDate) => {
    get().updateTask(taskId, { dueDate });
  },

  addSubtask: (taskId, title) => {
    const data = {
      ...get().data,
      tasks: get().data.tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              subtasks: [
                ...task.subtasks,
                { id: crypto.randomUUID(), title, completed: false },
              ],
            }
          : task,
      ),
    };
    set({ data });
    void persist(data);
  },

  toggleSubtask: (taskId, subtaskId) => {
    const data = {
      ...get().data,
      tasks: get().data.tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              subtasks: task.subtasks.map((s) =>
                s.id === subtaskId ? { ...s, completed: !s.completed } : s,
              ),
            }
          : task,
      ),
    };
    set({ data });
    void persist(data);
  },

  addHabit: (title, target, type = "count") => {
    const data = {
      ...get().data,
      habits: [
        {
          id: crypto.randomUUID(),
          title,
          type,
          target: Math.max(1, target),
          color: habitColors[get().data.habits.length % habitColors.length],
          logs: [],
          createdAt: new Date().toISOString(),
        },
        ...get().data.habits,
      ],
    };
    set({ data });
    void persist(data);
  },

  incrementHabit: (habitId) => {
    const activeDate = get().ui.activeDate;

    const habits = get().data.habits.map((habit): Habit => {
      if (habit.id !== habitId) return habit;

      const existing = habit.logs.find((log) => log.date === activeDate);
      if (!existing) {
        return {
          ...habit,
          logs: [...habit.logs, { date: activeDate, value: 1 }],
        };
      }

      return {
        ...habit,
        logs: habit.logs.map((log) =>
          log.date === activeDate
            ? {
                ...log,
                value:
                  habit.type === "boolean"
                    ? Math.min(1, log.value + 1)
                    : Math.min(habit.target, log.value + 1),
              }
            : log,
        ),
      };
    });

    const data = { ...get().data, habits };
    set({ data });
    void persist(data);
  },

  decrementHabit: (habitId) => {
    const activeDate = get().ui.activeDate;
    const habits = get().data.habits.map((habit): Habit => {
      if (habit.id !== habitId) return habit;

      const existing = habit.logs.find((log) => log.date === activeDate);
      if (!existing) return habit;

      return {
        ...habit,
        logs: habit.logs
          .map((log) =>
            log.date === activeDate ? { ...log, value: Math.max(0, log.value - 1) } : log,
          )
          .filter((log) => !(log.date === activeDate && log.value === 0)),
      };
    });

    const data = { ...get().data, habits };
    set({ data });
    void persist(data);
  },

  updateHabitTarget: (habitId, target) => {
    const habits = get().data.habits.map((habit) =>
      habit.id === habitId ? { ...habit, target: Math.max(1, target) } : habit,
    );

    const data = { ...get().data, habits };
    set({ data });
    void persist(data);
  },

  setSettings: (settings) => {
    const data = {
      ...get().data,
      settings: { ...get().data.settings, ...settings },
    };
    set({ data });
    void persist(data);
  },

  setActiveDate: (date) => set((state) => ({ ui: { ...state.ui, activeDate: date } })),
}));
