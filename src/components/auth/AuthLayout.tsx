import { type ReactNode } from "react";
import {
  AcademicCapIcon,
  CheckCircleIcon,
  ClockIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  const features = [
    { icon: AcademicCapIcon, text: "Search 7,000+ colleges" },
    { icon: CheckCircleIcon, text: "Track application progress" },
    { icon: ClockIcon, text: "Never miss deadlines" },
    { icon: ChartBarIcon, text: "Organize your strategy" },
  ];

  return (
    <div className="min-h-screen lg:flex">
      {/* Form Section */}
      <div className="lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-white dark:bg-secondary-900">
        <div className="w-full max-w-md">{children}</div>
      </div>

      {/* Hero Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 to-primary-800 dark:from-primary-700 dark:to-primary-900 relative items-center justify-center p-12">
        <div className="relative z-10 text-white">
          <div className="flex items-center mb-6">
            <AcademicCapIcon className="h-10 w-10 text-white mr-4" />
            <h1 className="text-3xl font-bold">LaunchMasters</h1>
          </div>
          <h2 className="text-4xl font-bold mb-4 leading-tight">
            Master Your College Journey
          </h2>
          <p className="text-lg text-primary-100 dark:text-primary-200 mb-8">
            The complete platform for college research, application tracking,
            and deadline management.
          </p>

          {/* Features */}
          <div className="space-y-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center">
                <div className="bg-white/20 p-2 rounded-full mr-4">
                  <feature.icon className="h-5 w-5" />
                </div>
                <span className="text-lg">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full bg-black/10"></div>
      </div>
    </div>
  );
}
