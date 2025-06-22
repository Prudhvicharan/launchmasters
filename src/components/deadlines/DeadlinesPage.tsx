import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  CalendarIcon,
  PlusIcon,
  ClockIcon,
<<<<<<< HEAD
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
=======
  CheckCircleIcon,
>>>>>>> main
  ListBulletIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../../hooks/useAuth";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
<<<<<<< HEAD
import { Skeleton } from "../ui/LoadingSpinner";
import { Tabs } from "../ui/Tabs";
import type { DeadlineType, UserCollege } from "../../types";
=======
import type { DeadlineType } from "../../types";
>>>>>>> main
import { AddDeadlineModal } from "./AddDeadlineModal";
import { getUserCollegeList } from "../../services/colleges";

// Mock Data until backend is ready
const mockDeadlines = [
  {
    id: "1",
    college_id: "1",
    college_name: "Harvard University",
    deadline_type: "early_decision" as DeadlineType,
    deadline_date: "2024-11-01",
    is_completed: false,
    notes: "Binding early application",
  },
  {
    id: "2",
    college_id: "2",
    college_name: "Stanford University",
    deadline_type: "early_action" as DeadlineType,
    deadline_date: "2024-11-15",
    is_completed: false,
    notes: "Non-binding early application",
  },
  {
    id: "3",
    college_id: "3",
    college_name: "MIT",
    deadline_type: "regular_decision" as DeadlineType,
    deadline_date: "2025-01-15",
    is_completed: true,
    notes: "Standard application deadline",
  },
  {
    id: "4",
    college_id: "4",
    college_name: "UCLA",
    deadline_type: "regular_decision" as DeadlineType,
    deadline_date: "2024-11-30",
    is_completed: false,
    notes: "UC Application deadline",
  },
];

export function DeadlinesPage() {
  const { user } = useAuth();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [view, setView] = useState<"list" | "calendar">("list");

  // This is for the AddDeadlineModal, real deadline fetching will be implemented later
<<<<<<< HEAD
  const { data: collegeList, isLoading: isLoadingColleges } = useQuery({
    queryKey: ["userCollegeList", user?.id],
    queryFn: () => getUserCollegeList(user?.id!),
=======
  const { data: collegeList } = useQuery({
    queryKey: ["userCollegeList", user?.id],
    queryFn: () => getUserCollegeList(user?.id ?? ""),
>>>>>>> main
    enabled: !!user?.id,
  });

  const renderListView = () => {
    // In a real app, this would be a separate component with its own filtering logic
    const deadlines = mockDeadlines; // Using mock data for now

    if (deadlines.length === 0) {
      return (
        <Card className="text-center py-16">
          <CalendarIcon className="h-12 w-12 text-text-tertiary mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-text-primary">
            No Deadlines Yet
          </h3>
          <p className="text-text-secondary mt-2 mb-6">
            Click "Add Deadline" to get started.
          </p>
        </Card>
      );
    }

    return (
      <div className="space-y-4">
        {deadlines.map((deadline) => (
          <Card
            key={deadline.id}
            className="p-4 flex items-center justify-between hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div
                className={`p-3 rounded-full ${
                  deadline.is_completed ? "bg-success/10" : "bg-muted"
                }`}
              >
                {deadline.is_completed ? (
                  <CheckCircleIcon className="h-6 w-6 text-success" />
                ) : (
                  <ClockIcon className="h-6 w-6 text-text-secondary" />
                )}
              </div>
              <div>
                <h3 className="font-semibold text-text-primary">
                  {deadline.college_name}
                </h3>
                <p className="text-sm text-text-secondary">{deadline.notes}</p>
                <p className="text-xs text-text-tertiary mt-1">
                  Due: {new Date(deadline.deadline_date).toLocaleDateString()}
                </p>
              </div>
            </div>
            <Badge variant={deadline.is_completed ? "success" : "info"}>
              {deadline.deadline_type.replace("_", " ")}
            </Badge>
          </Card>
        ))}
      </div>
    );
  };

  const renderCalendarView = () => (
    <Card className="text-center py-16">
      <Squares2X2Icon className="h-12 w-12 text-text-tertiary mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-text-primary">
        Calendar View Coming Soon
      </h3>
      <p className="text-text-secondary mt-2">
        This feature is under construction.
      </p>
    </Card>
  );

  return (
    <>
      <div className="space-y-6">
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-text-primary">
              Application Deadlines
            </h1>
            <p className="mt-1 text-text-secondary">
              Track your college application deadlines and stay organized.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center bg-muted rounded-lg p-1 border border-border">
              <button
                onClick={() => setView("list")}
                className={`p-2 rounded-md transition-colors ${
                  view === "list"
                    ? "bg-background text-primary shadow-sm"
                    : "text-text-secondary hover:text-text-primary"
                }`}
                title="List view"
              >
                <ListBulletIcon className="h-5 w-5" />
              </button>
              <button
                onClick={() => setView("calendar")}
                className={`p-2 rounded-md transition-colors ${
                  view === "calendar"
                    ? "bg-background text-primary shadow-sm"
                    : "text-text-secondary hover:text-text-primary"
                }`}
                title="Calendar view"
              >
                <Squares2X2Icon className="h-5 w-5" />
              </button>
            </div>
            <Button onClick={() => setIsAddModalOpen(true)}>
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Deadline
            </Button>
          </div>
        </header>

        {view === "list" ? renderListView() : renderCalendarView()}
      </div>

      <AddDeadlineModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        collegeList={collegeList || []}
      />
    </>
  );
}
