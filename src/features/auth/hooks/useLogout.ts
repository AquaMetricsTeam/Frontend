import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { logoutService } from "../services/logout.service";
import { clearAllTokens, getStoredRefreshToken } from "@/utils/authStorage";
import { AUTH_QUERY_KEYS } from "../constants/queryKeys";

export function useLogout() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const logout = () => {
    const refreshToken = getStoredRefreshToken();
    if (refreshToken) {
      logoutService({ refreshToken }).catch(() => {});
    }

    clearAllTokens();
    queryClient.setQueryData(AUTH_QUERY_KEYS.me(), null);
    queryClient.clear();
    navigate("/login", { replace: true });
    toast.success("Logged out successfully!");
  };

  return { logout, mutate: logout, isPending: false };
}
