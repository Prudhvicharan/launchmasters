import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  MagnifyingGlassIcon,
  BookmarkIcon,
  CalendarIcon,
  PlusIcon,
  AcademicCapIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";
import { getUserCollegeList } from "../../services/colleges";
import { useAuth } from "../../hooks/useAuth";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { Avatar } from "../ui/Avatar";
import { Skeleton } from "../ui/LoadingSpinner";
import type { UserCollege, College } from "../../types";

type UserCollegeWithCollege = UserCollege & {
  college: College;
};

export function DashboardPage() {
  const { user } = useAuth();

  const { data: collegeList, isLoading } = useQuery({
    queryKey: ["userCollegeList", user?.id],
    queryFn: () => getUserCollegeList(user?.id ?? ""),
    enabled: !!user?.id,
  }) as { data: UserCollegeWithCollege[] | undefined; isLoading: boolean };

  // Calculate stats
  const stats = {
    reach: collegeList?.filter((c) => c.category === "reach").length || 0,
    target: collegeList?.filter((c) => c.category === "target").length || 0,
    safety: collegeList?.filter((c) => c.category === "safety").length || 0,
    total: collegeList?.length || 0,
  };

  const quickActions = [
    {
      name: "Search Colleges",
      description: "Discover new colleges to add to your list",
      href: "/colleges",
      icon: MagnifyingGlassIcon,
    },
    {
      name: "View My Lists",
      description: "Manage your college categories",
      href: "/lists",
      icon: BookmarkIcon,
    },
    {
      name: "Add Deadline",
      description: "Track application deadlines",
      href: "/deadlines",
      icon: CalendarIcon,
    },
  ];

  const recentColleges = collegeList?.slice(0, 3) || [];

  if (isLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-8 w-1/3" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <Skeleton lines={3} />
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <Skeleton lines={4} />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary-800 dark:text-white flex items-center">
            <span className="mr-3 text-2xl">👋</span>
            Welcome back, {user?.full_name || "Student"}!
          </h1>
          <p className="mt-2 text-secondary-600 dark:text-secondary-300">
            Here's a snapshot of your college application journey.
          </p>
        </div>
        <Avatar
          src={user?.avatar_url || ""}
          name={user?.full_name || user?.email || "User"}
          size="lg"
        />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <Card hover>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600 dark:text-secondary-400">
                Total Colleges
              </p>
              <p className="text-3xl font-bold text-secondary-800 dark:text-white">
                {stats.total}
              </p>
            </div>
            <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
              <AcademicCapIcon className="h-8 w-8 text-primary-600 dark:text-primary-400" />
            </div>
          </div>
        </Card>

        <Card hover>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600 dark:text-secondary-400">
                Reach Schools
              </p>
              <p className="text-3xl font-bold text-secondary-800 dark:text-white">
                {stats.reach}
              </p>
            </div>
            <div className="p-3 bg-error-100 dark:bg-error-900/30 rounded-lg">
              <AcademicCapIcon className="h-8 w-8 text-error-600 dark:text-error-400" />
            </div>
          </div>
        </Card>

        <Card hover>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600 dark:text-secondary-400">
                Target Schools
              </p>
              <p className="text-3xl font-bold text-secondary-800 dark:text-white">
                {stats.target}
              </p>
            </div>
            <div className="p-3 bg-warning-100 dark:bg-warning-900/30 rounded-lg">
              <AcademicCapIcon className="h-8 w-8 text-warning-600 dark:text-warning-400" />
            </div>
          </div>
        </Card>

        <Card hover>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600 dark:text-secondary-400">
                Safety Schools
              </p>
              <p className="text-3xl font-bold text-secondary-800 dark:text-white">
                {stats.safety}
              </p>
            </div>
            <div className="p-3 bg-success-100 dark:bg-success-900/30 rounded-lg">
              <AcademicCapIcon className="h-8 w-8 text-success-600 dark:text-success-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions & Recent Colleges */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <Card padding="lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-secondary-800 dark:text-white">
              Quick Actions
            </h2>
            <Badge variant="info" size="sm">
              Get started
            </Badge>
          </div>
          <div className="space-y-4">
            {quickActions.map((action) => (
              <Link
                key={action.name}
                to={action.href}
                className="group p-4 rounded-lg border border-secondary-200 dark:border-secondary-700 hover:border-primary-400 dark:hover:border-primary-500 hover:bg-secondary-50 dark:hover:bg-secondary-800 transition-all flex items-center"
              >
                <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                  <action.icon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="font-semibold text-secondary-800 dark:text-white">
                    {action.name}
                  </h3>
                  <p className="text-sm text-secondary-600 dark:text-secondary-400">
                    {action.description}
                  </p>
                </div>
                <ArrowRightIcon className="h-5 w-5 text-secondary-400 dark:text-secondary-500 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-transform group-hover:translate-x-1" />
              </Link>
            ))}
          </div>
        </Card>

        {/* Recent Activity */}
        <Card padding="lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-secondary-800 dark:text-white">
              Recently Added Colleges
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => (window.location.href = "/lists")}
            >
              View All
            </Button>
          </div>
          {recentColleges.length > 0 ? (
            <div className="space-y-4">
              {recentColleges.map((userCollege) => (
                <div
                  key={userCollege.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-secondary-50 dark:bg-secondary-800"
                >
                  <div className="flex items-center">
                    <Avatar name={userCollege.college.name} size="md" />
                    <div className="ml-4">
                      <p className="font-semibold text-secondary-800 dark:text-white">
                        {userCollege.college.name}
                      </p>
                      <p className="text-sm text-secondary-600 dark:text-secondary-400">
                        {userCollege.college.city}, {userCollege.college.state}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={
                      userCollege.category === "reach"
                        ? "error"
                        : userCollege.category === "target"
                        ? "warning"
                        : "success"
                    }
                    size="sm"
                  >
                    {userCollege.category}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <AcademicCapIcon className="h-12 w-12 text-secondary-300 dark:text-secondary-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-secondary-700 dark:text-secondary-200">
                No colleges added yet
              </h3>
              <p className="text-secondary-500 dark:text-secondary-400 mt-1">
                Start by searching for colleges.
              </p>
              <Button
                variant="primary"
                size="sm"
                className="mt-4"
                onClick={() => (window.location.href = "/colleges")}
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Search Colleges
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
