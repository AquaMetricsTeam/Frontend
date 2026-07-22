import type { ReactNode } from "react";
import { Navigate } from "react-router";
import FullPageLoading from "@/components/feedbacks/FullPageLoading";
import { useHasPermission } from "@/hooks/useHasPermission";

interface WithPermissionAuthorizationProps {
  children: ReactNode;
  requiredPermissions: PermissionKey[];
  unauthorizedNavigation?: boolean;
  operator?: PermissionsOperator;
  inline?: boolean;
}

const WithPermissionAuthorization = ({
  children,
  requiredPermissions,
  unauthorizedNavigation,
  operator = "AND",
  inline = false,
}: WithPermissionAuthorizationProps) => {
  const { hasPermission, isLoading } = useHasPermission({
    requiredPermissions,
    operator,
  });

  if (isLoading) return inline ? null : <FullPageLoading />;

  if (!hasPermission)
    return unauthorizedNavigation ? <Navigate to="/unauthorized" /> : null;

  return children;
};

export default WithPermissionAuthorization;
