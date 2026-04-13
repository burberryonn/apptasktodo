"use client";

import { useRef } from "react";
import { Plus, Mic } from "lucide-react";

interface FloatingButtonProps {
  onTap: () => void;
  onLongPress: () => void;
}

export function FloatingButton({ onTap, onLongPress }: FloatingButtonProps) {
  const timer = useRef<NodeJS.Timeout | null>(null);

  return (
    <button
      type="button"
      className="fixed bottom-6 right-6 z-20 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-500 text-white shadow-xl"
      onMouseDown={() => {
        timer.current = setTimeout(onLongPress, 500);
      }}
      onMouseUp={() => {
        if (timer.current) {
          clearTimeout(timer.current);
          onTap();
        }
      }}
      aria-label="Добавить задачу"
    >
      <Plus className="h-6 w-6" />
      <Mic className="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-white text-indigo-500" />
    </button>
  );
}
