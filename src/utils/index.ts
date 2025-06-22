import { clsx, type ClassValue } from "clsx";

/**
 * Utility function to combine class names with clsx
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/**
 * Format currency values
 */
export function formatCurrency(amount: number | null | undefined): string {
  if (amount == null) return "N/A";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format percentage values
 */
export function formatPercentage(value: number | null | undefined): string {
  if (value == null) return "N/A";
  return `${(value * 100).toFixed(1)}%`;
}

/**
 * Format large numbers with K/M suffixes
 */
export function formatNumber(value: number | null | undefined): string {
  if (value == null) return "N/A";
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toString();
}

/**
 * Get category color for college categories
 */
export function getCategoryColor(
  category: "reach" | "target" | "safety"
): string {
  switch (category) {
    case "reach":
      return "text-red-600 bg-red-50 border-red-200";
    case "target":
      return "text-yellow-600 bg-yellow-50 border-yellow-200";
    case "safety":
      return "text-green-600 bg-green-50 border-green-200";
    default:
      return "text-gray-600 bg-gray-50 border-gray-200";
  }
}

/**
 * Get status color for application statuses
 */
export function getStatusColor(
  status:
    | "not_started"
    | "in_progress"
    | "submitted"
    | "accepted"
    | "rejected"
    | "waitlisted"
): string {
  switch (status) {
    case "not_started":
      return "text-gray-600 bg-gray-50 border-gray-200";
    case "in_progress":
      return "text-blue-600 bg-blue-50 border-blue-200";
    case "submitted":
      return "text-purple-600 bg-purple-50 border-purple-200";
    case "accepted":
      return "text-green-600 bg-green-50 border-green-200";
    case "rejected":
      return "text-red-600 bg-red-50 border-red-200";
    case "waitlisted":
      return "text-orange-600 bg-orange-50 border-orange-200";
    default:
      return "text-gray-600 bg-gray-50 border-gray-200";
  }
}

/**
 * Get deadline type color
 */
export function getDeadlineTypeColor(
  type: "early_decision" | "early_action" | "regular_decision" | "rolling"
): string {
  switch (type) {
    case "early_decision":
      return "text-red-600 bg-red-50 border-red-200";
    case "early_action":
      return "text-blue-600 bg-blue-50 border-blue-200";
    case "regular_decision":
      return "text-green-600 bg-green-50 border-green-200";
    case "rolling":
      return "text-purple-600 bg-purple-50 border-purple-200";
    default:
      return "text-gray-600 bg-gray-50 border-gray-200";
  }
}

/**
 * Calculate days until deadline
 */
export function daysUntilDeadline(deadlineDate: string): number {
  const deadline = new Date(deadlineDate);
  const today = new Date();
  const diffTime = deadline.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

/**
 * Get deadline urgency level
 */
export function getDeadlineUrgency(
  daysUntil: number
): "urgent" | "warning" | "normal" {
  if (daysUntil <= 7) return "urgent";
  if (daysUntil <= 30) return "warning";
  return "normal";
}

/**
 * Debounce function for search inputs
 */
<<<<<<< HEAD
export function debounce<T extends (...args: any[]) => any>(
=======
export function debounce<T extends (...args: unknown[]) => unknown>(
>>>>>>> main
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Generate initials from name
 */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

/**
 * Format date for display
 */
export function formatDate(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Format date and time for display
 */
export function formatDateTime(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
