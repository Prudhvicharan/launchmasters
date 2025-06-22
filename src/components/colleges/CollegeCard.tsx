// src/components/colleges/CollegeCard.tsx
import type { College, CollegeCategory } from "../../types";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  AcademicCapIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  ArrowRightIcon,
  PlusIcon,
  CheckIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { upsertCollege, addCollegeToList } from "../../services/colleges";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "../ui/Button";

interface CollegeCardProps {
  college: Partial<College>;
  isAdded?: boolean;
  linkState?: Record<string, unknown>;
}

const formatValue = (
  value: number | undefined | null,
  prefix = "",
  suffix = ""
) => {
  if (value === null || typeof value === "undefined")
    return <span className="text-gray-500 dark:text-gray-400">N/A</span>;
  if (prefix === "$") {
    return `${prefix}${value.toLocaleString()}${suffix}`;
  }
  if (suffix === "%") {
    return `${(value * 100).toFixed(1)}${suffix}`;
  }
  return `${prefix}${value.toLocaleString()}${suffix}`;
};

export function CollegeCard({ college, isAdded, linkState }: CollegeCardProps) {
  const { user } = useAuth();
  const [showCategorySelect, setShowCategorySelect] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const addToListMutation = useMutation({
    mutationFn: async (category: CollegeCategory) => {
      if (!user) throw new Error("You must be logged in to add a college.");
      if (!college.id) throw new Error("College ID is missing.");

      // First, ensure the college is in our public 'colleges' table.
      const dbCollege = await upsertCollege(college);
      // Then, add it to the user's private list.
      await addCollegeToList(user.id, dbCollege.id, category);
    },
    onSuccess: () => {
      setNotification({
        type: "success",
        message: `${college.name} added to your list!`,
      });
      setShowCategorySelect(false);
      setTimeout(() => setNotification(null), 3000);
    },
    onError: (error: Error) => {
      setNotification({ type: "error", message: error.message });
      setTimeout(() => setNotification(null), 3000);
    },
  });

  const handleAddClick = (category: CollegeCategory) => {
    addToListMutation.mutate(category);
  };

  return (
    <div className="bg-card text-card-foreground rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 relative border border-border">
      {notification && (
        <div
          className={`absolute top-0 left-0 right-0 p-2 text-white text-xs sm:text-sm text-center z-10 ${
            notification.type === "success" ? "bg-success" : "bg-destructive"
          }`}
        >
          {notification.message}
        </div>
      )}

      <div className="p-4 sm:p-6">
        {/* College Name */}
        <h3 className="text-lg sm:text-xl font-bold text-text-primary mb-2 line-clamp-2">
          {college.name || "Unknown College"}
        </h3>

        {/* Location */}
        <div className="flex items-center text-text-secondary mb-4">
          <MapPinIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-text-tertiary flex-shrink-0" />
          <span className="text-sm sm:text-base truncate">
            {college.city || "Unknown City"}, {college.state || "Unknown State"}
          </span>
        </div>

        {/* Stats Grid - Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm mb-4 sm:mb-6">
          <div className="flex items-start space-x-2">
            <AcademicCapIcon className="h-4 w-4 sm:h-5 sm:w-5 mt-0.5 text-primary flex-shrink-0" />
            <div className="min-w-0">
              <p className="font-semibold text-text-primary">Admission</p>
              <p className="text-text-secondary truncate">
                {formatValue(college.admission_rate, "", "%")}
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-2">
            <CurrencyDollarIcon className="h-4 w-4 sm:h-5 sm:w-5 mt-0.5 text-success flex-shrink-0" />
            <div className="min-w-0">
              <p className="font-semibold text-text-primary">
                In-State Tuition
              </p>
              <p className="text-text-secondary truncate">
                {formatValue(college.tuition_in_state, "$")}
              </p>
            </div>
          </div>

          {/* Additional stats for larger screens */}
          <div className="flex items-start space-x-2 col-span-1 sm:col-span-2">
            <UsersIcon className="h-4 w-4 sm:h-5 sm:w-5 mt-0.5 text-info flex-shrink-0" />
            <div className="min-w-0">
              <p className="font-semibold text-text-primary">Enrollment</p>
              <p className="text-text-secondary truncate">
                {formatValue(college.enrollment)}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons - Responsive */}
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
          <div className="relative order-2 sm:order-1 z-10">
            {isAdded ? (
              <Button
                variant="outline"
                size="sm"
                className="w-full sm:w-auto"
                disabled
              >
                <CheckIcon className="h-4 w-4 mr-2" />
                In Your List
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full sm:w-auto"
                  onClick={() => setShowCategorySelect(!showCategorySelect)}
                  disabled={addToListMutation.isPending}
                >
                  {addToListMutation.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-border mr-2"></div>
                      Adding...
                    </>
                  ) : (
                    <>
                      <PlusIcon className="h-4 w-4 mr-2" />
                      Add to List
                    </>
                  )}
                </Button>

                {showCategorySelect && (
                  <div className="absolute bottom-full mb-2 w-full sm:w-48 bg-card rounded-md shadow-lg border border-border z-20">
                    {(["reach", "target", "safety"] as CollegeCategory[]).map(
                      (cat) => (
                        <button
                          key={cat}
                          onClick={() => handleAddClick(cat)}
                          className="w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-muted capitalize first:rounded-t-md last:rounded-b-md transition-colors"
                          disabled={addToListMutation.isPending}
                        >
                          {addToListMutation.isPending
                            ? "Adding..."
                            : `Add as ${cat}`}
                        </button>
                      )
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          <Link
            to={`/colleges/${college.id}`}
            state={linkState}
            className="order-1 sm:order-2 inline-flex items-center justify-center sm:justify-start font-medium text-primary hover:text-primary/80 text-sm transition-colors"
          >
            <span>View Details</span>
            <ArrowRightIcon className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
