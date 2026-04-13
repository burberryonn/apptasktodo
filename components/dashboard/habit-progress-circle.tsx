"use client";

interface HabitProgressCircleProps {
  value: number;
  target: number;
  color: string;
}

export function HabitProgressCircle({ value, target, color }: HabitProgressCircleProps) {
  const safeTarget = target || 1;
  const progress = Math.min(100, Math.round((value / safeTarget) * 100));

  return (
    <div
      className="grid h-16 w-16 place-content-center rounded-full"
      style={{
        background: `conic-gradient(${color} ${progress}%, #E6E8F0 ${progress}% 100%)`,
      }}
    >
      <div className="grid h-12 w-12 place-content-center rounded-full bg-white text-xs font-semibold text-zinc-700">
        {value}/{target}
      </div>
    </div>
  );
}
