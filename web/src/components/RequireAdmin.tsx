import { Navigate, Outlet } from "react-router";
import { useAuthContext } from "../context/auth";
import { ErrorMessage } from "../ui/ErrorMessage";

export const RequireAdmin = () => {
  const { user, loading, authError, checkSession } = useAuthContext();

  if (loading) {
    return <p>Loading...</p>;
  }

  if (authError) {
    return <ErrorMessage message={authError} onRetry={checkSession} />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "ADMIN") {
    return <Navigate to="/cars" replace />;
  }

  return <Outlet />;
};
