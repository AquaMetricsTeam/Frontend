import type { ReactNode } from "react";
import { useMe } from "@/features/auth/hooks/useMe";
import FullPageLoading from "@/components/feedbacks/FullPageLoading";

interface WithPermissionAuthorizationProps {
  children: ReactNode;
}

const WithAuthentication = ({ children }: WithPermissionAuthorizationProps) => {
  const { data: currentUser, isLoading } = useMe({
    staleTime: 2 * 60 * 1000, // 2 Minute
  });

  if (isLoading) return <FullPageLoading className="bg-gray-0" />;

  if (!currentUser?.data) return null;

  return children;
};

export default WithAuthentication;
