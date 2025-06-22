import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";
import { useTheme } from "../../contexts/ThemeContext";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className = "" }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`
        relative p-3 rounded-xl transition-all duration-300 group overflow-hidden
        bg-gray-100 hover:bg-gray-200 
        dark:bg-secondary-800 dark:hover:bg-secondary-700
        hover:scale-110 active:scale-95
        shadow-sm hover:shadow-md dark:shadow-lg dark:hover:shadow-primary-500/25
        ${className}
      `}
      aria-label="Toggle theme"
      title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      {/* Background glow effect */}
      <div
        className={`
        absolute inset-0 rounded-xl transition-all duration-500 opacity-0 group-hover:opacity-100
        ${
          theme === "dark"
            ? "bg-gradient-to-br from-blue-500/20 to-purple-500/20"
            : "bg-gradient-to-br from-yellow-400/20 to-orange-400/20"
        }
      `}
      />

      <div className="relative w-5 h-5 flex items-center justify-center">
        {/* Sun Icon */}
        <SunIcon
          className={`
            absolute w-5 h-5 text-yellow-500 transition-all duration-500 transform
            ${
              theme === "light"
                ? "rotate-0 scale-100 opacity-100"
                : "rotate-180 scale-50 opacity-0"
            }
            group-hover:drop-shadow-lg
          `}
        />

        {/* Moon Icon */}
        <MoonIcon
          className={`
            absolute w-5 h-5 text-blue-400 transition-all duration-500 transform
            ${
              theme === "dark"
                ? "rotate-0 scale-100 opacity-100"
                : "-rotate-180 scale-50 opacity-0"
            }
            group-hover:drop-shadow-lg
          `}
        />
      </div>

      {/* Sparkle effect on hover */}
      <div
        className={`
        absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300
        ${
          theme === "dark"
            ? "bg-gradient-to-br from-transparent via-blue-400/10 to-transparent"
            : "bg-gradient-to-br from-transparent via-yellow-400/10 to-transparent"
        }
      `}
      />
    </button>
  );
}
