<<<<<<< HEAD
import type { ReactNode } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "./AuthProvider";

interface AuthGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
}
=======
import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
>>>>>>> main

export const AuthGuard = () => {
  const { isAuthenticated, loading } = useAuthContext();

  if (loading) {
    return <div>Loading...</div>; // Or a spinner component
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

<<<<<<< HEAD
interface PublicRouteGuardProps {
  children: ReactNode;
  redirectTo?: string;
}

=======
>>>>>>> main
export const PublicRouteGuard = () => {
  const { isAuthenticated, loading } = useAuthContext();

  if (loading) {
    return <div>Loading...</div>; // Or a spinner component
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};
