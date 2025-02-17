import { Navigate } from "react-router-dom";

interface RedirectIfAuthenticatedProps {
  children: React.ReactNode;
}

const RedirectIfAuthenticated = ({ children }: RedirectIfAuthenticatedProps) => {
  const authToken = localStorage.getItem("authToken");

  if (authToken) {
    // If the user is already authenticated, redirect to the dashboard or home page
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>; // If not authenticated, render the login page
};

export default RedirectIfAuthenticated;