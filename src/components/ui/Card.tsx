import { type ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  padding?: "sm" | "md" | "lg";
}

export function Card({
  children,
  className = "",
  hover = false,
  padding = "md",
}: CardProps) {
  const baseStyles =
    "bg-white dark:bg-secondary-800 rounded-xl border border-secondary-200 dark:border-secondary-700 shadow-sm transition-all duration-300";
  const hoverStyles = hover
    ? "hover:shadow-lg hover:border-secondary-300 dark:hover:border-secondary-600 transform hover:-translate-y-1"
    : "";

  const paddings = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  return (
    <div
      className={`${baseStyles} ${hoverStyles} ${paddings[padding]} ${className}`}
    >
      {children}
    </div>
  );
}
