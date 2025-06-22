import { useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { LoginForm } from "./LoginForm";
import { SignUpForm } from "./SignUpForm";
import { AuthLayout } from "./AuthLayout";
<<<<<<< HEAD
import { useAuth } from "../../hooks/useAuth";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
=======
import { useAuthContext } from "../../hooks/useAuthContext";
import { Card } from "../ui/Card";
>>>>>>> main
import { AcademicCapIcon } from "@heroicons/react/24/outline";

type AuthMode = "login" | "signup";

export function AuthPage() {
  const [mode, setMode] = useState<AuthMode>("login");
<<<<<<< HEAD
  const { user, loading } = useAuth();
=======
  const { user, loading } = useAuthContext();
>>>>>>> main
  const location = useLocation();

  // If user is already authenticated, redirect to intended destination or dashboard
  if (user && !loading) {
    const from = location.state?.from?.pathname || "/dashboard";
    return <Navigate to={from} replace />;
  }

  if (loading) {
    return (
      <AuthLayout>
        <Card className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-secondary-600 dark:text-secondary-300">
            Loading...
          </p>
        </Card>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      {/* Mobile Header - Only visible on sm screens and below */}
      <div className="lg:hidden text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <AcademicCapIcon className="h-10 w-10 text-primary-600 mr-3" />
          <h1 className="text-2xl font-bold text-secondary-800 dark:text-white">
            LaunchMasters
          </h1>
        </div>
        <p className="text-secondary-600 dark:text-secondary-300">
          Master your college application journey.
        </p>
      </div>

      <Card padding="lg" className="dark:bg-secondary-800">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-secondary-800 dark:text-white mb-2">
            {mode === "login" ? "Welcome Back" : "Create Your Account"}
          </h2>
          <p className="text-secondary-600 dark:text-secondary-300">
            {mode === "login"
              ? "Sign in to continue your college journey."
              : "Start organizing your college applications."}
          </p>
        </div>

        {/* Form */}
        {mode === "login" ? (
<<<<<<< HEAD
          <LoginForm onSwitchMode={() => setMode("signup")} />
=======
          <LoginForm />
>>>>>>> main
        ) : (
          <SignUpForm onSwitchMode={() => setMode("login")} />
        )}

        {/* Mode Toggle */}
        <div className="mt-6 pt-6 border-t border-secondary-200 dark:border-secondary-700 text-center">
          <p className="text-sm text-secondary-600 dark:text-secondary-400">
            {mode === "login"
              ? "Don't have an account?"
              : "Already have an account?"}
            <button
              onClick={() => setMode(mode === "login" ? "signup" : "login")}
              className="font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 ml-2 bg-transparent border-none"
            >
              {mode === "login" ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>
      </Card>
    </AuthLayout>
  );
}
