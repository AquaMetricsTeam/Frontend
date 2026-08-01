import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createUser } from "../services/createUser.service";
import { USER_KEYS } from "../constants/queryKeys";
import type { CreateUserPayload, StaffUser, UsersPaginatedResponse } from "../types/index";

const OPTIMISTIC_ID = "__optimistic_new_user__";

export function useCreateUser(onSuccess: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateUserPayload) => createUser(payload),

    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: USER_KEYS.all });

      const previousCaches = queryClient.getQueriesData<ApiResponse<UsersPaginatedResponse>>({
        queryKey: USER_KEYS.all,
      });

      const optimisticUser: StaffUser = {
        id: OPTIMISTIC_ID,
        fullName: payload.fullName,
        email: payload.email,
        phoneNumber: "",
        role: payload.role,
        isActive: true,
        emailConfirmed: false,
        createdAt: new Date().toISOString(),
      };

      queryClient.setQueriesData<ApiResponse<UsersPaginatedResponse>>(
        { queryKey: USER_KEYS.all },
        (old) => {
          if (!old?.data) return old;
          return {
            ...old,
            data: {
              ...old.data,
              items: [optimisticUser, ...old.data.items],
              totalCount: old.data.totalCount + 1,
            },
          };
        },
      );

      return { previousCaches };
    },

    onError: (_error: { message?: string }, _payload, context) => {
      if (context?.previousCaches) {
        for (const [queryKey, data] of context.previousCaches) {
          queryClient.setQueryData(queryKey, data);
        }
      }
      toast.error(_error?.message ?? "Failed to create user.");
    },

    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: USER_KEYS.all });
      toast.success(response.message ?? "User created successfully.");
      onSuccess();
    },
  });
}
