// src/components/lists/MyListsPage.tsx
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../hooks/useAuth";
import { getUserCollegeList } from "../../services/colleges";
import { CollegeCard } from "../colleges/CollegeCard";
import type { UserCollege } from "../../types";
import { useState } from "react";
import {
  AcademicCapIcon,
  PlusIcon,
  Squares2X2Icon,
  ListBulletIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { Button } from "../ui/Button";

export function MyListsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<
    "all" | "reach" | "target" | "safety"
  >("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const {
    data: list,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["userCollegeList", user?.id],
    queryFn: () => {
      if (!user) return [];
      return getUserCollegeList(user.id);
    },
    enabled: !!user,
  });

  const filteredList =
    list?.filter(
      (item) => activeTab === "all" || item.category === activeTab
    ) || [];

  const getCategoryStats = () => {
    if (!list) return { all: 0, reach: 0, target: 0, safety: 0 };
    return {
      all: list.length,
      reach: list.filter((item) => item.category === "reach").length,
      target: list.filter((item) => item.category === "target").length,
      safety: list.filter((item) => item.category === "safety").length,
    };
  };

  const stats = getCategoryStats();

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-secondary-200 dark:bg-secondary-800 rounded-lg h-64"></div>
            </div>
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-8 sm:py-12">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md mx-auto">
            <p className="text-red-700 dark:text-red-300">
              Error: {error.message}
            </p>
          </div>
        </div>
      );
    }

    if (!list || list.length === 0) {
      return (
        <div className="text-center py-16">
          <AcademicCapIcon className="h-16 w-16 text-secondary-300 dark:text-secondary-700 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-secondary-800 dark:text-white mb-2">
            Your College List is Empty
          </h3>
          <p className="text-secondary-600 dark:text-secondary-400 mb-6">
            Start by searching for colleges and adding them to your list.
          </p>
          <Button
            variant="primary"
            onClick={() => (window.location.href = "/colleges")}
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Search for Colleges
          </Button>
        </div>
      );
    }

    if (filteredList.length === 0 && activeTab !== "all") {
      return (
        <div className="text-center py-16">
          <AcademicCapIcon className="h-16 w-16 text-secondary-300 dark:text-secondary-700 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-secondary-800 dark:text-white mb-2">
            No Colleges in This Category
          </h3>
          <p className="text-secondary-600 dark:text-secondary-400">
            You haven't added any colleges to your '{activeTab}' list yet.
          </p>
        </div>
      );
    }

    // Grid View - This is now the default for all sizes, responsive classes handle layout.
    return (
      <div
        className={`grid gap-4 sm:gap-6 ${
          viewMode === "grid"
            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            : "grid-cols-1"
        }`}
      >
        {filteredList.map((userCollege) =>
          userCollege.college ? (
            viewMode === "grid" ? (
              <CollegeCard
                key={userCollege.id}
                college={userCollege.college}
                isAdded={true}
                linkState={{ from: "my-lists" }}
              />
            ) : (
              <CollegeListItem key={userCollege.id} userCollege={userCollege} />
            )
          ) : null
        )}
      </div>
    );
  };

  const tabs = [
    { id: "all", label: "All", count: stats.all },
    { id: "reach", label: "Reach", count: stats.reach },
    { id: "target", label: "Target", count: stats.target },
    { id: "safety", label: "Safety", count: stats.safety },
  ] as const;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">
              My College Lists
            </h1>
            <p className="mt-2 text-text-secondary text-sm sm:text-base">
              Here are the colleges you've saved, organized by category.
            </p>
          </div>

          {/* View Mode Toggle - Hidden on mobile */}
          {list && list.length > 0 && (
            <div className="hidden sm:flex items-center bg-muted rounded-lg p-1 border border-border">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === "grid"
                    ? "bg-background text-primary shadow-sm"
                    : "text-text-secondary hover:text-text-primary"
                }`}
                title="Grid view"
              >
                <Squares2X2Icon className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === "list"
                    ? "bg-background text-primary shadow-sm"
                    : "text-text-secondary hover:text-text-primary"
                }`}
                title="List view"
              >
                <ListBulletIcon className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 sm:mb-8">
        <div className="border-b border-border">
          <nav
            className="-mb-px flex space-x-4 sm:space-x-8 overflow-x-auto"
            aria-label="Tabs"
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
<<<<<<< HEAD
                onClick={() => setActiveTab(tab.id as any)}
=======
                onClick={() => setActiveTab(tab.id)}
>>>>>>> main
                className={`${
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-text-secondary hover:text-text-primary hover:border-border"
                } whitespace-nowrap py-3 px-1 border-b-2 font-semibold text-sm flex items-center gap-2 transition-colors`}
              >
                <span className="capitalize">{tab.label}</span>
                <span
                  className={`inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold rounded-full min-w-[1.5rem] ${
                    activeTab === tab.id
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-text-secondary"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-8">{renderContent()}</div>
    </div>
  );
}

// A new, more compact list view item component
function CollegeListItem({ userCollege }: { userCollege: UserCollege }) {
  if (!userCollege.college) return null;

  const { college, category } = userCollege;

  const categoryStyles: Record<string, string> = {
    reach: "bg-destructive/10 text-destructive-foreground",
    target: "bg-warning/10 text-warning-foreground",
    safety: "bg-success/10 text-success-foreground",
  };

  const formatValue = (
    value: number | null | undefined,
    prefix = "",
    suffix = ""
  ) => {
    if (value === null || typeof value === "undefined") return "N/A";
    return `${prefix}${value.toLocaleString()}${suffix}`;
  };

  return (
    <div className="bg-card text-card-foreground rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 border border-border overflow-hidden">
      <div className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Main Info */}
        <div className="flex-grow min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-bold text-text-primary truncate">
              {college.name}
            </h3>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                categoryStyles[category] || "bg-muted text-muted-foreground"
              }`}
            >
              {category}
            </span>
          </div>
          <p className="text-sm text-text-secondary">
            {college.city}, {college.state}
          </p>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-2 text-sm w-full sm:w-auto sm:flex-shrink-0 sm:justify-end">
          <div className="text-left sm:text-right">
            <p className="text-xs text-text-secondary">Adm. Rate</p>
            <p className="font-semibold text-text-primary">
              {formatValue(college.admission_rate, "", "%")}
            </p>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-xs text-text-secondary">Tuition</p>
            <p className="font-semibold text-text-primary">
              {formatValue(college.tuition_in_state, "$")}
            </p>
          </div>
          <div className="text-left sm:text-right col-span-2 sm:col-span-1">
            <p className="text-xs text-text-secondary">Enrollment</p>
            <p className="font-semibold text-text-primary">
              {formatValue(college.enrollment)}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="w-full sm:w-auto flex justify-end">
          <Link to={`/colleges/${college.id}`} state={{ from: "my-lists" }}>
            <Button variant="outline" size="sm">
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
