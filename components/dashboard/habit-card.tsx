"use client";

import { Minus, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Habit } from "@/lib/types";
import { calculateStreak, calculateSuccessRate } from "@/lib/utils";
import { HabitProgressCircle } from "@/components/dashboard/habit-progress-circle";

interface HabitCardProps {
  habit: Habit;
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
  onTargetChange: (target: number) => void;
}

export function HabitCard({ habit, value, onIncrement, onDecrement, onTargetChange }: HabitCardProps) {
  return (
    <motion.div whileTap={{ scale: 0.97 }} className="min-w-56">
      <Card className="p-3">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-semibold text-zinc-800">{habit.title}</span>
          <span className="text-xs text-zinc-500">{calculateSuccessRate(habit)}%</span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <HabitProgressCircle value={value} target={habit.target} color={habit.color} />
          <div className="text-xs text-zinc-500">
            <div>Серия: {calculateStreak(habit)} д.</div>
            <div>
              Повторы: {value}/{habit.target}
            </div>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={onDecrement}
              className="rounded-lg border border-zinc-200 p-1.5 text-zinc-600 hover:bg-zinc-50"
              aria-label="Уменьшить повтор"
            >
              <Minus className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={onIncrement}
              className="rounded-lg border border-zinc-200 p-1.5 text-zinc-600 hover:bg-zinc-50"
              aria-label="Увеличить повтор"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          <label className="flex items-center gap-1 text-xs text-zinc-500">
            Цель
            <input
              type="number"
              min={1}
              value={habit.target}
              onChange={(e) => onTargetChange(Number(e.target.value) || 1)}
              className="w-14 rounded-lg border border-zinc-200 px-2 py-1 text-zinc-700"
            />
          </label>
        </div>
      </Card>
    </motion.div>
  );
}
