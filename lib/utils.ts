import { clsx, type ClassValue } from "clsx";
import {
  endOfMonth,
  endOfWeek,
  format,
  isToday,
  isTomorrow,
  parseISO,
  startOfMonth,
  startOfWeek,
  subDays,
} from "date-fns";
import { ru } from "date-fns/locale";
import { twMerge } from "tailwind-merge";
import { Habit, Task } from "@/lib/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateRu(date: Date, token = "d MMMM, EEEE") {
  return format(date, token, { locale: ru });
}

export function toDateKey(dateLike: string) {
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateLike)) {
    return dateLike;
  }

  const parsed = parseISO(dateLike);
  if (!Number.isNaN(parsed.getTime())) {
    return format(parsed, "yyyy-MM-dd");
  }

  return dateLike.slice(0, 10);
}

export function groupTasks(tasks: Task[]) {
  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 });

  return tasks.reduce(
    (acc, task) => {
      const due = task.dueDate ? parseISO(task.dueDate) : null;
      if (!due) {
        acc.later.push(task);
      } else if (isToday(due)) {
        acc.today.push(task);
      } else if (isTomorrow(due)) {
        acc.tomorrow.push(task);
      } else if (due >= weekStart && due <= weekEnd) {
        acc.thisWeek.push(task);
      } else {
        acc.later.push(task);
      }
      return acc;
    },
    {
      today: [] as Task[],
      tomorrow: [] as Task[],
      thisWeek: [] as Task[],
      later: [] as Task[],
    },
  );
}

export function calculateStreak(habit: Habit): number {
  const byDate = new Map(habit.logs.map((log) => [toDateKey(log.date), log.value]));
  let streak = 0;

  for (let i = 0; i < 365; i += 1) {
    const day = subDays(new Date(), i);
    const key = format(day, "yyyy-MM-dd");
    const value = byDate.get(key) ?? 0;
    if (value >= habit.target) {
      streak += 1;
    } else {
      break;
    }
  }

  return streak;
}

export function calculateSuccessRate(habit: Habit): number {
  if (!habit.logs.length) return 0;
  const completed = habit.logs.filter((log) => log.value >= habit.target).length;
  return Math.round((completed / habit.logs.length) * 100);
}

export const findHabitValueByDate = (habit: Habit, dateKey: string) => {
  return habit.logs.find((log) => toDateKey(log.date) === dateKey)?.value ?? 0;
};

export const calculateHabitMonthPlan = (habit: Habit, month: Date) => {
  const monthStart = startOfMonth(month);
  const monthEnd = endOfMonth(month);
  const monthLabel = format(month, "yyyy-MM");

  const daysInMonth = Number(format(monthEnd, "d"));
  const planned = daysInMonth * habit.target;

  const completed = habit.logs.reduce((sum, log) => {
    if (!toDateKey(log.date).startsWith(monthLabel)) return sum;
    const value = habit.type === "boolean" ? Math.min(1, log.value) : log.value;
    return sum + Math.min(value, habit.target);
  }, 0);

  return {
    planned,
    completed,
    percent: planned === 0 ? 0 : Math.round((completed / planned) * 100),
    monthStart,
  };
};
