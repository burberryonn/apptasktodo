"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Habit } from "@/lib/types";
import { calculateStreak, calculateSuccessRate, findHabitValueToday } from "@/lib/utils";
import { HabitProgressCircle } from "@/components/dashboard/habit-progress-circle";

interface HabitCardProps {
  habit: Habit;
  onTap: () => void;
  onOpen: () => void;
}

export function HabitCard({ habit, onTap, onOpen }: HabitCardProps) {
  const value = findHabitValueToday(habit);

  return (
    <motion.div whileTap={{ scale: 0.97 }} className="min-w-44">
      <Card className="p-3" onClick={onOpen}>
        <button type="button" onClick={onTap} className="w-full text-left">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-semibold text-zinc-800">{habit.title}</span>
            <span className="text-xs text-zinc-500">{calculateSuccessRate(habit)}%</span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <HabitProgressCircle value={value} target={habit.target} color={habit.color} />
            <div className="text-xs text-zinc-500">
              <div>Серия: {calculateStreak(habit)} д.</div>
              <div>Нажмите для +1</div>
            </div>
          </div>
        </button>
      </Card>
    </motion.div>
  );
}
