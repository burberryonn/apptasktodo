import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Поток Дня",
  description: "Локальный менеджер задач и привычек без лишних действий",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
