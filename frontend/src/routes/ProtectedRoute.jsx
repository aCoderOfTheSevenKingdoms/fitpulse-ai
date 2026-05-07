import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = () => {
  const { isAuthenticated, user } = useSelector((state) => state.user || {});
  const location = useLocation();

  // Not logged in
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  // Logged in but password not set
  if (
    user &&
    !user.isPasswordSet &&
    location.pathname !== "/set-password"
  ) {
    return <Navigate to="/set-password" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;

