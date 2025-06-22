import { NavLink, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  HomeIcon,
  MagnifyingGlassIcon,
  BookmarkIcon,
  CalendarIcon,
  XMarkIcon,
  ArrowLeftOnRectangleIcon,
  AcademicCapIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../../hooks/useAuth";
import { getUserCollegeList } from "../../services/colleges";
import { Avatar } from "./Avatar";
import { Badge } from "./Badge";
import { Button } from "./Button";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: HomeIcon,
    description: "Overview & progress",
  },
  {
    name: "Search Colleges",
    href: "/colleges",
    icon: MagnifyingGlassIcon,
    description: "Find new colleges",
  },
  {
    name: "My Lists",
    href: "/lists",
    icon: BookmarkIcon,
    description: "Saved colleges",
  },
  {
    name: "Deadlines",
    href: "/deadlines",
    icon: CalendarIcon,
    description: "Track applications",
  },
];

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();

  // Get user's college stats for badges
  const { data: collegeList } = useQuery({
    queryKey: ["userCollegeList", user?.id],
    queryFn: () => getUserCollegeList(user?.id!),
    enabled: !!user?.id,
  });

  const stats = {
    total: collegeList?.length || 0,
    deadlines: 3, // Mock - will be dynamic when deadlines are implemented
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
    onClose();
  };

  const handleNavClick = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 lg:hidden"
        onClick={onClose}
      />

      {/* Slide-out Navigation */}
      <div
        className={`
        fixed top-0 left-0 h-full w-80 max-w-[85vw] z-50 
        bg-background border-r border-border
        transform transition-transform duration-300 ease-out lg:hidden
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/20 rounded-lg">
              <AcademicCapIcon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-text-primary">
                LaunchMasters
              </h1>
              <p className="text-xs text-text-secondary">
                College Application Hub
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-text-secondary hover:bg-muted/50 transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* User Profile Section */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center space-x-3 mb-3">
            <Avatar
              src={user?.avatar_url || undefined}
              name={user?.full_name || user?.email || "User"}
              size="md"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text-primary truncate">
                {user?.full_name || "Student"}
              </p>
              <p className="text-xs text-text-secondary truncate">
                {user?.email}
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          {stats.total > 0 && (
            <div className="flex space-x-2">
              <Badge variant="info" size="sm">
                {stats.total} colleges
              </Badge>
              <Badge variant="warning" size="sm">
                {stats.deadlines} deadlines
              </Badge>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              onClick={handleNavClick}
              className={({ isActive }) =>
                `group flex items-center justify-between px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "text-text-secondary hover:text-text-primary hover:bg-muted"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center space-x-3">
                    <item.icon
                      className={`h-5 w-5 ${
                        isActive
                          ? "text-primary"
                          : "text-text-tertiary group-hover:text-text-secondary"
                      }`}
                    />
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p
                        className={`text-xs ${
                          isActive ? "text-primary/80" : "text-text-tertiary"
                        }`}
                      >
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Dynamic badges */}
                  {item.href === "/lists" && stats.total > 0 && (
                    <Badge variant={isActive ? "info" : "default"} size="sm">
                      {stats.total}
                    </Badge>
                  )}
                  {item.href === "/deadlines" && stats.deadlines > 0 && (
                    <Badge variant={isActive ? "warning" : "default"} size="sm">
                      {stats.deadlines}
                    </Badge>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-border space-y-3">
          {/* Quick Add Button */}
          <NavLink to="/colleges" onClick={handleNavClick}>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-center"
            >
              <MagnifyingGlassIcon className="h-4 w-4 mr-2" />
              Find Colleges
            </Button>
          </NavLink>

          {/* Sign Out */}
          <button
            onClick={handleSignOut}
            className="group flex w-full items-center px-3 py-2 text-sm font-medium text-text-secondary rounded-lg hover:text-destructive-foreground hover:bg-destructive/80 transition-all duration-200"
          >
            <ArrowLeftOnRectangleIcon className="mr-3 h-5 w-5 text-text-tertiary group-hover:text-destructive-foreground" />
            Sign out
          </button>
        </div>
      </div>
    </>
  );
}
