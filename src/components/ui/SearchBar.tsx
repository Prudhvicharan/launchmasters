import { useState, useEffect } from "react";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Button } from "./Button";

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  onClear?: () => void;
  className?: string;
  autoFocus?: boolean;
  showSearchButton?: boolean;
  initialValue?: string;
}

export function SearchBar({
  placeholder = "Search...",
  onSearch,
  onClear,
  className = "",
  autoFocus = false,
  showSearchButton = false,
  initialValue = "",
}: SearchBarProps) {
  const [query, setQuery] = useState(initialValue);

  useEffect(() => {
    setQuery(initialValue);
  }, [initialValue]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleClear = () => {
    setQuery("");
    onClear?.();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`relative flex items-center gap-2 ${className}`}
    >
      <div className="relative flex-grow">
        <MagnifyingGlassIcon className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-tertiary" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="w-full rounded-full border-border bg-card py-3 pl-11 pr-10 text-text-primary shadow-sm transition-colors
                     focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1 text-text-tertiary hover:text-text-primary
                       focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Clear search"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        )}
      </div>
      {showSearchButton && (
        <Button
          type="submit"
          variant="primary"
          className="flex-shrink-0 !rounded-full"
          size="lg"
          aria-label="Search"
        >
          <MagnifyingGlassIcon className="h-5 w-5 sm:mr-2" />
          <span className="hidden sm:inline">Search</span>
        </Button>
      )}
    </form>
  );
}
