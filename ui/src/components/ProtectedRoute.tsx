import { Navigate, useLocation } from "react-router-dom";
import { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const location = useLocation();
  const authToken = localStorage.getItem("authToken"); // Check for authToken in localStorage

  if (!authToken) {
    // Redirect to login page if no authToken exists
    return <Navigate to="/login" state={{ from: location }} />;
  }

  return <>{children}</>; // If authenticated, render the protected route's children
};

export default ProtectedRoute;