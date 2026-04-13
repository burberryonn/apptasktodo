import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "ghost" | "soft";
  size?: "sm" | "md" | "icon";
};

export function Button({ className, variant = "default", size = "md", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-2xl font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 disabled:pointer-events-none disabled:opacity-50",
        variant === "default" && "bg-indigo-500 text-white hover:bg-indigo-600",
        variant === "soft" && "bg-indigo-50 text-indigo-700 hover:bg-indigo-100",
        variant === "ghost" && "bg-transparent hover:bg-zinc-100 text-zinc-700",
        size === "md" && "h-11 px-4",
        size === "sm" && "h-9 px-3 text-sm",
        size === "icon" && "h-11 w-11",
        className,
      )}
      {...props}
    />
  );
}
