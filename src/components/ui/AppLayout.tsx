import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { MobileHeader } from "./MobileHeader";

export function AppLayout() {
  return (
    <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900 transition-colors duration-500">
      {/* Mobile Header - Only visible on mobile */}
      <MobileHeader />

      {/* Desktop Layout */}
      <div className="flex">
        {/* Desktop Sidebar - Hidden on mobile */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
          <Sidebar />
        </div>

        {/* Main Content */}
        <main className="flex-1 lg:pl-72">
          <div className="p-3 sm:p-4 md:p-6 lg:p-8 xl:p-10">
            <div className="max-w-7xl mx-auto">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
