"use client";

import {
  eachDayOfInterval,
  endOfMonth,
  format,
  isSameMonth,
  startOfMonth,
} from "date-fns";
import { ru } from "date-fns/locale";
import { Task } from "@/lib/types";
import { cn, toDateKey } from "@/lib/utils";

interface CalendarViewProps {
  month: Date;
  activeDate: string;
  tasks: Task[];
  onSelectDate: (date: string) => void;
}

export function CalendarView({ month, activeDate, tasks, onSelectDate }: CalendarViewProps) {
  const start = startOfMonth(month);
  const end = endOfMonth(month);
  const days = eachDayOfInterval({ start, end });

  return (
    <div className="rounded-2xl border border-zinc-100 bg-white p-4">
      <h3 className="mb-3 text-sm font-semibold text-zinc-700">{format(month, "LLLL yyyy", { locale: ru })}</h3>
      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const key = format(day, "yyyy-MM-dd");
          const hasTasks = tasks.some((task) => task.dueDate && toDateKey(task.dueDate) === key);
          const active = key === activeDate;

          return (
            <button
              type="button"
              key={key}
              onClick={() => onSelectDate(key)}
              className={cn(
                "rounded-xl p-2 text-center text-xs",
                isSameMonth(day, month) ? "text-zinc-700" : "text-zinc-300",
                active && "bg-indigo-500 text-white",
              )}
            >
              {format(day, "d")}
              <span className={cn("mx-auto mt-1 block h-1.5 w-1.5 rounded-full", hasTasks ? "bg-emerald-400" : "bg-transparent")} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
