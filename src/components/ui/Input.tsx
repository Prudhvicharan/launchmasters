import { type InputHTMLAttributes, type ReactNode } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
}

export function Input({
  label,
  error,
  icon,
  className = "",
  ...props
}: InputProps) {
  const baseStyles =
    "w-full px-3 py-2 border rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 dark:bg-secondary-800 dark:text-secondary-100 dark:placeholder-secondary-400";
  const errorStyles = error
    ? "border-red-300 focus:border-red-500 focus:ring-red-500 dark:border-red-600 dark:focus:border-red-500"
    : "border-secondary-300 focus:border-primary-500 focus:ring-primary-500/50 dark:border-secondary-600 dark:focus:border-primary-400 dark:focus:ring-primary-400/50";
  const iconPadding = icon ? "pl-10" : "";

  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-200">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-secondary-400 dark:text-secondary-500">
            {icon}
          </div>
        )}
        <input
          className={`${baseStyles} ${errorStyles} ${iconPadding} ${className}`}
          {...props}
        />
      </div>
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}
