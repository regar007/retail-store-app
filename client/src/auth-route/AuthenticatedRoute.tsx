import React, { ReactElement } from "react";
import { Navigate, Outlet } from "react-router-dom";

type ProtectedRouteProps = {
  isAuthenticated: boolean
  children: ReactElement
}

const ProtectedRoute = ({
  isAuthenticated,
  children,
}:ProtectedRouteProps) => {
  if (!isAuthenticated) {
    return <Navigate to={'/login'} />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;