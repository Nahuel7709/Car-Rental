import { Navigate, Outlet } from "react-router";
import { useAuthContext } from "../context/auth";

export const RequireAdmin = () => {
  const { user, loading } = useAuthContext();

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "ADMIN") {
    return <Navigate to="/cars" replace />;
  }

  return <Outlet />;
};
