import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

import { ROLES } from "@/constants/roles";
import { ROUTES } from "@/constants/routes";
import { useAppSelector } from "@/hooks/redux";

interface RequireAuthProps {
  allowedRole?: ROLES;
  redirectPath?: ROUTES;
  children: ReactNode;
}

export const RequireAuth = ({
  allowedRole = ROLES.USER,
  redirectPath = ROUTES.LOGIN,
  children,
}: RequireAuthProps) => {
  const { user } = useAppSelector((state) => state.auth);
  const location = useLocation();

  if (!user?.token || !user?.username || allowedRole !== user.user_role) {
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  return children;
};
