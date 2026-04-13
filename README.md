# Поток Дня

Локальное single-user веб-приложение для задач, привычек, напоминаний и календаря на одном экране.

## Стек

- Next.js (App Router) + TypeScript
- Tailwind CSS
- Zustand
- date-fns
- Framer Motion
- shadcn/ui-стиль компонентов (локально реализованные UI-компоненты)
- IndexedDB (с fallback на localStorage)

## Возможности

- Единый дашборд: **Сегодня / Завтра / На этой неделе / Позже**
- Быстрое добавление задачи, inline-редактирование, подзадачи
- Полоса привычек с круговым прогрессом, серией и процентом успеха
- Лёгкий календарь месяца с индикаторами активности
- Локальные напоминания в браузере (если разрешены)
- Голосовой ввод задачи через Web Speech API (если доступен)
- Seed-данные для моментального старта

## Запуск

```bash
npm install
npm run dev
```

Откройте http://localhost:3000

## Продакшен сборка

```bash
npm run build
npm run start
```

## Архитектура

- `app/page.tsx` — главный экран (весь UX на одной странице)
- `store/use-app-store.ts` — Zustand store + бизнес-логика
- `lib/storage.ts` — local-first слой хранения:
  - `getData()`
  - `saveData()`
  - `migrateData()`
- `lib/utils.ts` — `groupTasks()`, `calculateStreak()`, `calculateSuccessRate()`
- `components/dashboard/*` — переиспользуемые блоки UI
- `lib/seed-data.ts` — демо-данные

## Заметки

- Без backend, без БД, без auth
- Полностью single-user
- Язык интерфейса: русский
