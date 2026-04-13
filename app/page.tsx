"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { Bell, Settings } from "lucide-react";
import { endOfMonth, format, parseISO } from "date-fns";
import { ru } from "date-fns/locale";
import { AddTaskInput } from "@/components/dashboard/add-task-input";
import { CalendarView } from "@/components/dashboard/calendar-view";
import { FloatingButton } from "@/components/dashboard/floating-button";
import { HabitCard } from "@/components/dashboard/habit-card";
import { TaskSection } from "@/components/dashboard/task-section";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { calculateHabitMonthPlan, findHabitValueByDate, groupTasks, toDateKey } from "@/lib/utils";
import { useAppStore } from "@/store/use-app-store";

const greeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Доброе утро";
  if (hour < 18) return "Добрый день";
  return "Добрый вечер";
};

export default function HomePage() {
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [habitTitle, setHabitTitle] = useState("");
  const [habitTarget, setHabitTarget] = useState(1);
  const {
    data,
    ui,
    hydrated,
    load,
    addTask,
    addHabit,
    incrementHabit,
    decrementHabit,
    updateHabitTarget,
    toggleTask,
    updateTask,
    setActiveDate,
    toggleSubtask,
  } = useAppStore();

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (!data.settings.notificationsEnabled || !("Notification" in window)) return;
    if (Notification.permission === "default") {
      void Notification.requestPermission();
    }

    const dueSoon = data.tasks.find((task) => {
      if (!task.reminderAt || task.completed) return false;
      const diff = parseISO(task.reminderAt).getTime() - Date.now();
      return diff < 60_000 && diff > 0;
    });

    if (dueSoon && Notification.permission === "granted") {
      new Notification("Напоминание", { body: dueSoon.title });
    }
  }, [data.settings.notificationsEnabled, data.tasks]);

  const grouped = useMemo(() => groupTasks(data.tasks.filter((task) => !task.completed)), [data.tasks]);

  const tasksForActiveDate = data.tasks.filter((task) => (task.dueDate ? toDateKey(task.dueDate) === ui.activeDate : false));

  const monthPlan = data.habits.map((habit) => ({
    habit,
    plan: calculateHabitMonthPlan(habit, new Date(ui.activeDate)),
  }));

  const monthTitle = format(new Date(ui.activeDate), "LLLL yyyy", { locale: ru });
  const daysInSelectedMonth = Number(format(endOfMonth(new Date(ui.activeDate)), "d"));

  const handleAddHabit = (event: FormEvent) => {
    event.preventDefault();
    const title = habitTitle.trim();
    if (!title) return;

    addHabit(title, habitTarget, habitTarget > 1 ? "count" : "boolean");
    setHabitTitle("");
    setHabitTarget(1);
  };

  if (!hydrated) {
    return <main className="p-6 text-zinc-500">Загрузка...</main>;
  }

  return (
    <main className="min-h-screen bg-[#F7F8FC] pb-24 text-zinc-800">
      <div className="mx-auto max-w-5xl space-y-6 p-4 md:p-8">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-sm text-zinc-500">{format(new Date(), "d MMMM, EEEE", { locale: ru })}</p>
            <h1 className="text-2xl font-semibold">{greeting()}</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="soft" size="icon" aria-label="Напоминания">
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="soft" size="icon" aria-label="Настройки">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </header>

        <section className="space-y-3">
          <h2 className="text-sm font-medium text-zinc-500">Привычки ({ui.activeDate})</h2>
          <form onSubmit={handleAddHabit} className="flex flex-wrap gap-2">
            <Input
              value={habitTitle}
              onChange={(event) => setHabitTitle(event.target.value)}
              placeholder="Новая привычка"
              className="h-10 max-w-xs"
            />
            <Input
              value={habitTarget}
              onChange={(event) => setHabitTarget(Number(event.target.value) || 1)}
              type="number"
              min={1}
              className="h-10 w-24"
            />
            <Button type="submit" size="sm">
              Добавить привычку
            </Button>
          </form>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {data.habits.map((habit) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                value={findHabitValueByDate(habit, ui.activeDate)}
                onIncrement={() => incrementHabit(habit.id)}
                onDecrement={() => decrementHabit(habit.id)}
                onTargetChange={(target) => updateHabitTarget(habit.id, target)}
              />
            ))}
          </div>
        </section>

        <Card className="p-4">
          <h3 className="mb-1 text-sm font-semibold">План привычек на {monthTitle}</h3>
          <p className="mb-3 text-xs text-zinc-500">Расчет: цель в день × {daysInSelectedMonth} дней.</p>
          <div className="space-y-2">
            {monthPlan.map(({ habit, plan }) => (
              <div key={habit.id} className="rounded-xl bg-zinc-50 p-2 text-sm">
                <div className="flex items-center justify-between">
                  <span>{habit.title}</span>
                  <span className="text-zinc-500">{plan.percent}%</span>
                </div>
                <p className="text-xs text-zinc-500">
                  Выполнено {plan.completed} из {plan.planned} повторов
                </p>
              </div>
            ))}
          </div>
        </Card>

        {showQuickAdd && (
          <Card className="p-4">
            <AddTaskInput
              onAdd={(title) => {
                addTask(title, new Date().toISOString());
                setShowQuickAdd(false);
              }}
            />
          </Card>
        )}

        <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
          <div className="space-y-4">
            <TaskSection
              title="Сегодня"
              tasks={grouped.today}
              onToggleTask={toggleTask}
              onUpdateTask={updateTask}
              onToggleSubtask={toggleSubtask}
            />
            <TaskSection
              title="Завтра"
              tasks={grouped.tomorrow}
              onToggleTask={toggleTask}
              onUpdateTask={updateTask}
              onToggleSubtask={toggleSubtask}
            />
            <TaskSection
              title="На этой неделе"
              tasks={grouped.thisWeek}
              onToggleTask={toggleTask}
              onUpdateTask={updateTask}
              onToggleSubtask={toggleSubtask}
            />
            <TaskSection
              title="Позже"
              tasks={grouped.later}
              onToggleTask={toggleTask}
              onUpdateTask={updateTask}
              onToggleSubtask={toggleSubtask}
            />
          </div>

          <div className="space-y-4">
            <CalendarView month={new Date()} activeDate={ui.activeDate} tasks={data.tasks} onSelectDate={setActiveDate} />
            <Card className="p-4">
              <h3 className="mb-2 text-sm font-semibold">Выбранный день</h3>
              <div className="space-y-2">
                {tasksForActiveDate.length ? (
                  tasksForActiveDate.map((task) => (
                    <p key={task.id} className="rounded-xl bg-zinc-50 p-2 text-sm">
                      {task.title}
                    </p>
                  ))
                ) : (
                  <p className="text-sm text-zinc-400">Нет задач на выбранную дату.</p>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>

      <FloatingButton onTap={() => setShowQuickAdd((v) => !v)} onLongPress={() => setShowQuickAdd(true)} />
    </main>
  );
}
