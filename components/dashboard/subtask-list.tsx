import { Checkbox } from "@/components/ui/checkbox";
import { Subtask } from "@/lib/types";

interface SubtaskListProps {
  subtasks: Subtask[];
  onToggle: (subtaskId: string) => void;
}

export function SubtaskList({ subtasks, onToggle }: SubtaskListProps) {
  if (!subtasks.length) return null;

  return (
    <div className="mt-3 space-y-2 border-l border-zinc-200 pl-3">
      {subtasks.map((subtask) => (
        <div key={subtask.id} className="flex items-center gap-2">
          <Checkbox checked={subtask.completed} onChange={() => onToggle(subtask.id)} />
          <p className="text-sm text-zinc-600">{subtask.title}</p>
        </div>
      ))}
    </div>
  );
}
