import { type ButtonHTMLAttributes, type ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  children,
  className = "",
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-px active:translate-y-0";

  const variants = {
    primary:
      "bg-primary-600 hover:bg-primary-700 text-white focus:ring-primary-500 shadow-sm hover:shadow-lg hover:shadow-primary-600/20 dark:focus:ring-offset-secondary-950",
    secondary:
      "bg-secondary-200 hover:bg-secondary-300 text-secondary-800 focus:ring-primary-500 dark:bg-secondary-700 dark:hover:bg-secondary-600 dark:text-secondary-100 dark:border-secondary-600 dark:focus:ring-offset-secondary-950",
    outline:
      "border border-primary-500 text-primary-600 hover:bg-primary-50 dark:border-primary-500 dark:text-primary-400 dark:hover:bg-primary-900/20 dark:focus:ring-offset-secondary-950",
    ghost:
      "text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100 focus:ring-primary-500 dark:text-secondary-400 dark:hover:text-white dark:hover:bg-secondary-700 dark:focus:ring-offset-secondary-950",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
