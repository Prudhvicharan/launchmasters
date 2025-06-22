import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  ArrowLeftIcon,
  AcademicCapIcon,
  MapPinIcon,
  GlobeAltIcon,
  CurrencyDollarIcon,
  PlusIcon,
  CheckIcon,
  CalendarIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import { getCollegeById as getCollegeFromAPI } from "../../services/collegeScorecard";
import {
  getCollegeById as getCollegeFromDB,
  addCollegeToList,
  upsertCollege,
  getUserCollegeList,
} from "../../services/colleges";
import { useAuth } from "../../hooks/useAuth";
import type { CollegeCategory } from "../../types";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Skeleton } from "../ui/LoadingSpinner";

export function CollegeDetailsPage() {
  const { collegeId } = useParams<{ collegeId: string }>();
  const navigate = useNavigate();
  const { state } = useLocation();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] =
    useState<CollegeCategory>("target");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  const fromMyLists = state?.from === "my-lists";

  // Fetch college details - try database first, then API
  const { data: college, isLoading } = useQuery({
    queryKey: ["collegeDetails", collegeId],
    queryFn: async () => {
      if (!collegeId) return null;

      // Try to get from database first
      try {
        const dbCollege = await getCollegeFromDB(collegeId);
        if (dbCollege) return dbCollege;
      } catch {
        console.log("College not found in database, trying API...");
      }

      // If not in database, try API
      try {
        const apiCollege = await getCollegeFromAPI(collegeId);
        if (apiCollege) {
          // Cache it in database for future use
          await upsertCollege(apiCollege);
          return apiCollege;
        }
      } catch {
        console.error("Error fetching from API");
      }

      return null;
    },
    enabled: !!collegeId,
  });

  // Check if this college is already in the user's list
  const { data: userCollegeList } = useQuery({
    queryKey: ["userCollegeList", user?.id],
    queryFn: () => getUserCollegeList(user?.id ?? ""),
    enabled: !!user,
  });

  const isAdded = userCollegeList?.some((c) => c.college_id === college?.id);

  // Add to list mutation
  const addToListMutation = useMutation({
    mutationFn: async () => {
      if (!college || !user?.id || !college.id) return;

      // First, cache the college data
      await upsertCollege(college);

      // Then add to user's list
      return addCollegeToList(user.id, college.id, selectedCategory);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userCollegeList"] });
      queryClient.invalidateQueries({
        queryKey: ["collegeDetails", collegeId],
      });
      setShowCategoryDropdown(false);
    },
  });

  // Mock data for departments and courses (in a real app, this would come from an API)
  const departments = [
    "Computer Science",
    "Engineering",
    "Business Administration",
    "Psychology",
    "Biology",
    "Mathematics",
    "English Literature",
    "History",
    "Economics",
    "Physics",
  ];

  // Mock application deadlines (in a real app, this would come from the college's website or database)
  const applicationDeadlines = [
    {
      type: "Early Decision",
      date: "November 1",
      description: "Binding early application",
    },
    {
      type: "Early Action",
      date: "November 15",
      description: "Non-binding early application",
    },
    {
      type: "Regular Decision",
      date: "January 15",
      description: "Standard application deadline",
    },
    {
      type: "Transfer",
      date: "March 1",
      description: "Transfer student deadline",
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-1/4 mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-48" />
            <Skeleton className="h-32" />
            <Skeleton className="h-64" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-64" />
            <Skeleton className="h-32" />
          </div>
        </div>
      </div>
    );
  }

  if (!college) {
    return (
      <Card className="text-center py-12">
        <AcademicCapIcon className="h-12 w-12 text-text-tertiary mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-text-primary mb-2">
          College not found
        </h2>
        <p className="text-text-secondary mb-4">
          The college you're looking for could not be found.
        </p>
        <Button onClick={() => navigate(-1)}>
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Go Back
        </Button>
      </Card>
    );
  }

  const formatNumber = (num: number | null | undefined) => {
    if (num === null || num === undefined) return "N/A";
    return num.toLocaleString();
  };

  const formatCurrency = (num: number | null | undefined) => {
    if (num === null || num === undefined) return "N/A";
    return `$${num.toLocaleString()}`;
  };

  const formatPercentage = (num: number | null | undefined) => {
    if (num === null || num === undefined) return "N/A";
    return `${(num * 100).toFixed(1)}%`;
  };

  const ActionButton = () => {
    if (fromMyLists || isAdded) {
      return (
        <Button variant="outline" disabled>
          <CheckIcon className="h-4 w-4 mr-2" />
          In Your List
        </Button>
      );
    }

    return (
      <div className="relative">
        <Button
          onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
          disabled={addToListMutation.isPending}
        >
          {addToListMutation.isPending ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>
              Adding...
            </>
          ) : (
            <>
              <PlusIcon className="h-4 w-4 mr-2" />
              Add to List
            </>
          )}
        </Button>

        {showCategoryDropdown && (
          <div className="absolute right-0 mt-2 w-48 bg-card rounded-md shadow-lg border border-border z-10">
            <div className="py-1">
              {(["reach", "target", "safety"] as CollegeCategory[]).map(
                (category) => (
                  <button
                    key={category}
                    onClick={() => {
                      setSelectedCategory(category);
                      addToListMutation.mutate();
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-muted capitalize"
                  >
                    {category}
                  </button>
                )
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back
        </Button>

        <ActionButton />
      </div>

      {/* College Header */}
      <Card>
        <div className="p-6">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-text-primary mb-2">
                {college.name}
              </h1>
              <div className="flex items-center text-text-secondary mb-2">
                <MapPinIcon className="h-5 w-5 mr-2" />
                <span>
                  {college.city}, {college.state}
                </span>
              </div>
              <div className="flex items-center text-text-secondary">
                <GlobeAltIcon className="h-5 w-5 mr-2" />
                <a
                  href={`https://${college.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {college.website}
                </a>
              </div>
            </div>
            <div className="flex-shrink-0">
              <Badge variant="default" size="md">
                ID: {college.id}
              </Badge>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold text-text-primary mb-4 flex items-center">
                <ChartBarIcon className="h-6 w-6 mr-3 text-primary" />
                Admission Statistics
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div>
                  <p className="text-2xl font-bold text-text-primary">
                    {formatPercentage(college.admission_rate)}
                  </p>
                  <p className="text-sm text-text-secondary">Admission Rate</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-text-primary">
                    {formatNumber(college.enrollment)}
                  </p>
                  <p className="text-sm text-text-secondary">Enrollment</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-text-primary">
                    {formatNumber(college.sat_avg)}
                  </p>
                  <p className="text-sm text-text-secondary">Average SAT</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-text-primary">
                    {formatNumber(college.act_avg)}
                  </p>
                  <p className="text-sm text-text-secondary">Average ACT</p>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold text-text-primary mb-4 flex items-center">
                <CurrencyDollarIcon className="h-6 w-6 mr-3 text-success" />
                Tuition & Costs
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm text-text-secondary">
                    In-State Tuition
                  </p>
                  <p className="text-2xl font-bold text-text-primary">
                    {formatCurrency(college.tuition_in_state)}
                  </p>
                </div>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm text-text-secondary">
                    Out-of-State Tuition
                  </p>
                  <p className="text-2xl font-bold text-text-primary">
                    {formatCurrency(college.tuition_out_state)}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold text-text-primary mb-4 flex items-center">
                <AcademicCapIcon className="h-6 w-6 mr-3 text-info" />
                Academic Departments
              </h2>
              <div className="flex flex-wrap gap-2">
                {departments.map((dept) => (
                  <Badge key={dept} variant="default">
                    {dept}
                  </Badge>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold text-text-primary mb-4">
                Quick Stats
              </h2>
              <ul className="space-y-3 text-sm">
                <li className="flex justify-between">
                  <span className="text-text-secondary">Student Body</span>
                  <span className="font-medium text-text-primary">
                    {formatNumber(college.enrollment)} students
                  </span>
                </li>
                <li className="flex justify-between">
                  <span className="text-text-secondary">Admission Rate</span>
                  <span className="font-medium text-text-primary">
                    {formatPercentage(college.admission_rate)}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span className="text-text-secondary">In-State Tuition</span>
                  <span className="font-medium text-text-primary">
                    {formatCurrency(college.tuition_in_state)}
                  </span>
                </li>
              </ul>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold text-text-primary mb-4 flex items-center">
                <CalendarIcon className="h-6 w-6 mr-3 text-warning" />
                Application Deadlines
              </h2>
              <ul className="space-y-3 text-sm">
                {applicationDeadlines.map((deadline) => (
                  <li key={deadline.type}>
                    <div className="flex justify-between font-medium">
                      <span>{deadline.type}</span>
                      <span>{deadline.date}</span>
                    </div>
                    <p className="text-text-secondary">
                      {deadline.description}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold text-text-primary mb-4">
                Location
              </h2>
              <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden bg-muted">
                {/* A real map would go here */}
                <div className="flex items-center justify-center h-full">
                  <p className="text-text-secondary">Map View Unavailable</p>
                </div>
              </div>
              <p className="text-sm mt-2 text-text-secondary">
                {college.city}, {college.state}
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
