import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./services/queryClient";
import { AuthProvider } from "./components/auth/AuthProvider";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthGuard, AuthPage, ForgotPasswordForm } from "./components/auth";
import { UpdatePasswordPage } from "./components/auth/UpdatePasswordPage";
import { CollegeSearchPage, CollegeDetailsPage } from "./components/colleges";
import { MyListsPage } from "./components/lists";
import { DashboardPage } from "./components/dashboard";
import { DeadlinesPage } from "./components/deadlines";
import { AppLayout } from "./components/ui/AppLayout";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider storageKey="launchmasters-theme">
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<AuthPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordForm />} />
              <Route path="/update-password" element={<UpdatePasswordPage />} />

              <Route element={<AuthGuard />}>
                <Route element={<AppLayout />}>
                  <Route
                    path="/"
                    element={<Navigate to="/dashboard" replace />}
                  />
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/colleges" element={<CollegeSearchPage />} />
                  <Route
                    path="/colleges/:collegeId"
                    element={<CollegeDetailsPage />}
                  />
                  <Route path="/lists" element={<MyListsPage />} />
                  <Route path="/deadlines" element={<DeadlinesPage />} />
                </Route>
              </Route>
            </Routes>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
