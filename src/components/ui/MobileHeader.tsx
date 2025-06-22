// src/components/ui/MobileHeader.tsx
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  HomeIcon,
  MagnifyingGlassIcon,
  BookmarkIcon,
  CalendarIcon,
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
<<<<<<< HEAD
  UserCircleIcon,
=======
>>>>>>> main
} from "@heroicons/react/24/outline";
import { useAuth } from "../../hooks/useAuth";
import { ThemeToggle } from "./ThemeToggle";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
  { name: "Colleges", href: "/colleges", icon: MagnifyingGlassIcon },
  { name: "My Lists", href: "/lists", icon: BookmarkIcon },
  { name: "Deadlines", href: "/deadlines", icon: CalendarIcon },
];

export function MobileHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { signOut, user } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
    setIsMenuOpen(false);
  };

  const closeMenu = () => setIsMenuOpen(false);

  const getInitials = (name: string | null, email: string) => {
    if (name) {
      return name
        .split(" ")
        .map((word) => word.charAt(0))
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    return email.charAt(0).toUpperCase();
  };

  return (
    <>
      {/* Mobile Header Bar */}
      <div className="lg:hidden bg-white dark:bg-secondary-900 border-b border-secondary-200 dark:border-secondary-700 sticky top-0 z-40">
        <div className="flex items-center justify-between p-3">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <div className="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center shadow-md shadow-primary-600/20">
              <span className="text-white font-bold text-sm">LM</span>
            </div>
            <span className="ml-3 text-lg font-bold text-secondary-800 dark:text-white">
              LaunchMasters
            </span>
          </div>

          {/* Theme Toggle & Menu Button */}
          <div className="flex items-center space-x-1">
            <ThemeToggle />
            {/* Hamburger Menu Button */}
            <button
              onClick={() => setIsMenuOpen(true)}
              className="text-secondary-500 hover:text-secondary-700 dark:text-secondary-400 dark:hover:text-white p-2 rounded-md hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors"
              aria-label="Open menu"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-60 transition-opacity"
            onClick={closeMenu}
          />

          {/* Sliding Menu Panel */}
          <div className="relative flex flex-col flex-1 max-w-xs w-full bg-white dark:bg-secondary-900 shadow-xl transform transition-transform">
            {/* Menu Header with Close Button */}
            <div className="flex-shrink-0 flex items-center justify-between px-4 py-5 border-b border-secondary-200 dark:border-secondary-700">
              <div className="flex items-center">
                <div className="h-9 w-9 bg-primary-600 rounded-lg flex items-center justify-center shadow-md shadow-primary-600/20">
                  <span className="text-white font-bold">LM</span>
                </div>
                <span className="ml-3 text-lg font-bold text-secondary-800 dark:text-white">
                  LaunchMasters
                </span>
              </div>
              <button
                onClick={closeMenu}
                className="p-2 rounded-full text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors"
                aria-label="Close menu"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Navigation Links */}
            <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
              <nav className="px-2 space-y-1">
                {navigation.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    onClick={closeMenu}
                    className={({ isActive }) =>
                      `group flex items-center px-3 py-3 text-base font-medium rounded-lg transition-colors ${
                        isActive
                          ? "bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-200"
                          : "text-secondary-700 hover:bg-secondary-100 dark:text-secondary-200 dark:hover:bg-secondary-800"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <item.icon
                          className={`mr-4 h-6 w-6 flex-shrink-0 ${
                            isActive
                              ? "text-primary-600 dark:text-primary-300"
                              : "text-secondary-400 group-hover:text-secondary-500 dark:text-secondary-400 dark:group-hover:text-secondary-300"
                          }`}
                        />
                        {item.name}
                      </>
                    )}
                  </NavLink>
                ))}
              </nav>
            </div>

            {/* User Section */}
            <div className="flex-shrink-0 border-t border-secondary-200 dark:border-secondary-700 p-4">
              {user && (
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0">
                    {user.avatar_url ? (
                      <img
                        className="h-10 w-10 rounded-full"
                        src={user.avatar_url}
                        alt={user.full_name || "User avatar"}
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-primary-600 flex items-center justify-center">
                        <span className="text-white font-medium">
                          {getInitials(user.full_name, user.email)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="ml-3 min-w-0 flex-1">
                    <p className="text-base font-medium text-secondary-800 dark:text-white truncate">
                      {user.full_name || "Student"}
                    </p>
                    <p className="text-sm text-secondary-500 dark:text-secondary-400 truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
              )}

              <button
                onClick={handleSignOut}
                className="w-full flex items-center px-3 py-3 text-base font-medium text-secondary-700 dark:text-secondary-200 hover:bg-secondary-100 dark:hover:bg-secondary-800 rounded-lg transition-colors"
              >
                <ArrowLeftOnRectangleIcon className="mr-4 h-6 w-6 flex-shrink-0 text-secondary-400 dark:text-secondary-500" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
