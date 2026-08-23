import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { loginService } from "../services/login.service";
import { getMeService } from "../services/me.service";
import { saveTokenPair } from "@/utils/authStorage";
import { AUTH_QUERY_KEYS } from "../constants/queryKeys";
import type { LoginPayload } from "../types";

export function useLogin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: ({
      payload,
    }: {
      payload: LoginPayload;
      rememberMe?: boolean;
    }) => loginService(payload),

    onSuccess: async (response, variables) => {
      const { accessToken, refreshToken } = response.data;
      const rememberMe = variables.rememberMe ?? true;

      saveTokenPair(accessToken, refreshToken, rememberMe);

      const meResponse = await queryClient.fetchQuery({
        queryKey: AUTH_QUERY_KEYS.me(),
        queryFn: getMeService,
      });

      toast.success(response.message || "Logged in successfully!");
      const userRoles = meResponse?.data?.roles || response.data.roles || [];
      const isNutritionOnly =
        userRoles.includes("NutritionSpecialist") &&
        !userRoles.some((r) => ["Admin", "SwimmingCoach", "FitnessCoach"].includes(r));
      navigate(isNutritionOnly ? "/athletes" : "/", { replace: true });
    },

    onError: (error: { message?: string }) => {
      toast.error(error?.message ?? "Login failed. Check your credentials.");
    },
  });
}
