import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CheckboxProps {
  checked: boolean;
  onChange: () => void;
}

export function Checkbox({ checked, onChange }: CheckboxProps) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={cn(
        "h-6 w-6 rounded-full border-2 transition",
        checked ? "border-emerald-500 bg-emerald-500 text-white" : "border-zinc-300 bg-white",
      )}
      aria-label="Переключить"
    >
      {checked ? <Check className="mx-auto h-4 w-4" /> : null}
    </button>
  );
}
