"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Task } from "@/lib/types";
import { TaskItem } from "@/components/dashboard/task-item";
import { Button } from "@/components/ui/button";

interface TaskSectionProps {
  title: string;
  tasks: Task[];
  onToggleTask: (taskId: string) => void;
  onUpdateTask: (taskId: string, patch: Partial<Task>) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
}

export function TaskSection({ title, tasks, onToggleTask, onUpdateTask, onToggleSubtask }: TaskSectionProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <section className="space-y-3">
      <Button variant="ghost" className="w-full justify-between" onClick={() => setCollapsed((v) => !v)}>
        <span className="text-base font-semibold text-zinc-800">{title}</span>
        <span className="flex items-center gap-2 text-sm text-zinc-500">
          {tasks.length}
          <ChevronDown className={`h-4 w-4 transition ${collapsed ? "-rotate-90" : ""}`} />
        </span>
      </Button>

      {!collapsed && (
        <div className="space-y-3">
          {tasks.length ? (
            tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={() => onToggleTask(task.id)}
                onUpdate={(patch) => onUpdateTask(task.id, patch)}
                onToggleSubtask={(subtaskId) => onToggleSubtask(task.id, subtaskId)}
              />
            ))
          ) : (
            <p className="px-2 text-sm text-zinc-400">Пока пусто — добавьте одну задачу.</p>
          )}
        </div>
      )}
    </section>
  );
}
