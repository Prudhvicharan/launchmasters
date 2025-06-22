import { useQuery } from "@tanstack/react-query";
import { searchColleges } from "../../services/collegeScorecard";
import { getUserCollegeList } from "../../services/colleges";
import { useAuth } from "../../hooks/useAuth";
import { CollegeCard } from "./CollegeCard";
import { SearchBar } from "../ui/SearchBar";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { LoadingSpinner, Skeleton } from "../ui/LoadingSpinner";
import {
  AcademicCapIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { useSearchParams } from "react-router-dom";

export function CollegeSearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const { user } = useAuth();

  const { data, isLoading, error } = useQuery({
    queryKey: ["colleges", query],
    queryFn: () => searchColleges({ query }),
    enabled: !!query.trim(),
  });

  const { data: userCollegeList } = useQuery({
    queryKey: ["userCollegeList", user?.id],
    queryFn: () => getUserCollegeList(user?.id ?? ""),
    enabled: !!user,
  });

  const userCollegeIds = new Set(userCollegeList?.map((c) => c.college_id));

  const handleSearch = (searchTerm: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("q", searchTerm.trim());
    setSearchParams(newParams);
  };

  const handleClear = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete("q");
    setSearchParams(newParams);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-block p-4 bg-primary/10 rounded-full mb-4">
          <AcademicCapIcon className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-text-primary mb-3">
          Find Your Future College
        </h1>
        <p className="text-lg text-text-secondary max-w-2xl mx-auto">
          Search over 7,000 colleges and universities. Filter by location,
          admission rates, and more to find your perfect match.
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-3xl mx-auto">
        <SearchBar
          placeholder="Search by name, e.g., 'University of California'"
          onSearch={handleSearch}
          onClear={handleClear}
          initialValue={query}
          autoFocus
          className="w-full"
          showSearchButton
        />
      </div>

      {/* Search Results */}
      <div className="max-w-7xl mx-auto">
        {/* Loading State */}
        {isLoading && query && (
          <div className="space-y-6 pt-8">
            <div className="flex items-center justify-center">
              <LoadingSpinner size="lg" />
              <span className="ml-4 text-lg text-text-secondary">
                Searching for colleges...
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i}>
                  <Skeleton lines={4} />
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Error State */}
        {error instanceof Error && (
          <Card className="text-center py-12 mt-8">
            <div className="text-destructive mb-4">
              <MagnifyingGlassIcon className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              Search Error
            </h3>
            <p className="text-text-secondary mb-4">
              We couldn't perform the search: {error.message}
            </p>
            <Badge variant="error">Please try again later</Badge>
          </Card>
        )}

        {/* Results */}
        {data && !isLoading && (
          <div className="space-y-6">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <h2 className="text-2xl font-semibold text-text-primary">
                Search Results
              </h2>
              <Badge variant="info" size="md">
                {data.total.toLocaleString()} colleges found
              </Badge>
            </div>

            {/* Results Grid */}
            {data.results.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.results.map((college) => (
                  <CollegeCard
                    key={college.id}
                    college={college}
                    isAdded={userCollegeIds.has(college.id)}
                  />
                ))}
              </div>
            ) : (
              <Card className="text-center py-12">
                <AcademicCapIcon className="h-16 w-16 text-text-tertiary mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-text-primary mb-2">
                  No Colleges Found
                </h3>
                <p className="text-text-secondary mb-4">
                  Try adjusting your search terms or check for spelling errors.
                </p>
                <Badge variant="warning">Try "University" or "College"</Badge>
              </Card>
            )}

            {/* Load More (Future Enhancement) */}
            {data.results.length > 0 && data.total > data.results.length && (
              <div className="text-center py-6">
                <Badge variant="info" className="px-4 py-2">
                  Showing {data.results.length} of {data.total.toLocaleString()}
                  results
                </Badge>
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {!query && (
          <Card className="text-center py-16">
            <div className="flex items-center justify-center mb-6">
              <div className="p-4 bg-muted rounded-full">
                <MagnifyingGlassIcon className="h-12 w-12 text-text-tertiary" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-text-primary mb-2">
              Ready to find your perfect college?
            </h3>
            <p className="text-text-secondary mb-6 max-w-md mx-auto">
              Enter a college name in the search bar above to begin.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {["Harvard", "Stanford", "MIT", "UCLA", "Yale"].map((name) => (
                <Badge
                  key={name}
                  variant="default"
                  className="cursor-pointer hover:bg-muted"
                  onClick={() => handleSearch(name)}
                >
                  {name}
                </Badge>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
