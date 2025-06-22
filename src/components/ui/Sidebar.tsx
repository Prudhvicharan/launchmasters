// src/components/ui/Sidebar.tsx
import { NavLink, useNavigate } from "react-router-dom";
import {
  HomeIcon,
  MagnifyingGlassIcon,
  BookmarkIcon,
  CalendarIcon,
  ArrowLeftOnRectangleIcon,
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

export function Sidebar() {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

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
    <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-secondary-900 px-6 pb-4 border-r border-secondary-700">
      {/* Logo/Brand */}
      <div className="flex h-16 shrink-0 items-center">
        <div className="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center shadow-md shadow-primary-600/20">
          <span className="text-white font-bold text-sm">LM</span>
        </div>
        <span className="ml-3 text-lg font-bold text-white">LaunchMasters</span>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) => (
                <li key={item.name}>
                  <NavLink
                    to={item.href}
                    className={({ isActive }) =>
                      `group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors ${
                        isActive
                          ? "bg-secondary-800 text-white"
                          : "text-secondary-300 hover:text-white hover:bg-secondary-800"
                      }`
                    }
                  >
                    <item.icon
                      className="h-6 w-6 shrink-0"
                      aria-hidden="true"
                    />
                    {item.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </li>

          {/* User Section at Bottom */}
          <li className="mt-auto space-y-3">
            {/* User Info */}
            <div className="flex items-center justify-between">
              {user && (
                <div className="flex items-center min-w-0">
                  <div className="flex-shrink-0">
                    {user.avatar_url ? (
                      <img
                        className="h-8 w-8 rounded-full"
                        src={user.avatar_url}
                        alt={user.full_name || "User avatar"}
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
                          {getInitials(user.full_name, user.email)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="ml-3 min-w-0 flex-1">
                    <p className="text-sm font-medium text-white truncate">
                      {user.full_name || "Student"}
                    </p>
                    <p className="text-xs text-secondary-300 truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
              )}
              <ThemeToggle />
            </div>

            {/* Sign Out Button */}
            <button
              onClick={handleSignOut}
              className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-secondary-300 hover:bg-secondary-800 hover:text-white cursor-pointer w-full transition-colors"
            >
              <ArrowLeftOnRectangleIcon
                className="h-6 w-6 shrink-0"
                aria-hidden="true"
              />
              Sign out
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}
