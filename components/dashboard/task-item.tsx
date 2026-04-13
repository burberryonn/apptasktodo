"use client";

import { useState } from "react";
import { format, parseISO } from "date-fns";
import { ru } from "date-fns/locale";
import { motion } from "framer-motion";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Task } from "@/lib/types";
import { SubtaskList } from "@/components/dashboard/subtask-list";

interface TaskItemProps {
  task: Task;
  onToggle: () => void;
  onUpdate: (patch: Partial<Task>) => void;
  onToggleSubtask: (subtaskId: string) => void;
}

export function TaskItem({ task, onToggle, onUpdate, onToggleSubtask }: TaskItemProps) {
  const [editing, setEditing] = useState(false);

  return (
    <motion.div
      layout
      className="rounded-2xl border border-zinc-100 bg-white p-4 shadow-[0_12px_30px_-24px_rgba(15,23,42,0.45)]"
    >
      <div className="flex items-start gap-3">
        <Checkbox checked={task.completed} onChange={onToggle} />
        <div className="w-full">
          {editing ? (
            <Input
              autoFocus
              defaultValue={task.title}
              onBlur={(e) => {
                onUpdate({ title: e.target.value || task.title });
                setEditing(false);
              }}
            />
          ) : (
            <button type="button" onClick={() => setEditing(true)} className="text-left">
              <p className="text-base font-medium text-zinc-800">{task.title}</p>
            </button>
          )}

          <p className="mt-1 text-xs text-zinc-500">
            {task.dueDate ? format(parseISO(task.dueDate), "d MMM, EEE", { locale: ru }) : "Без даты"} · {task.category}
          </p>

          <SubtaskList subtasks={task.subtasks} onToggle={onToggleSubtask} />
        </div>
      </div>
    </motion.div>
  );
}
