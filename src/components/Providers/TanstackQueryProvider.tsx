import { type ReactNode } from "react";
import {
  QueryClient,
  QueryClientProvider,
  MutationCache,
} from "@tanstack/react-query";
import { toast } from "sonner";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      networkMode: "always",
    },
    mutations: {
      networkMode: "always",
    },
  },
  mutationCache: new MutationCache({
    onError: (error: any, _variables, _context, mutation) => {
      // Avoid duplicate toasts if mutation explicitly opts out via meta
      if (mutation.meta?.skipGlobalErrorToast) return;

      const errorMessage =
        error?.message || "An unexpected error occurred. Please try again.";

      // Display Sonner toast with a global "Retry" button (deduplicated by mutationId)
      toast.error(errorMessage, {
        id: `mutation-error-${mutation.mutationId}`,
        duration: 8000,
        action: {
          label: "Retry",
          onClick: () => {
            // Re-executes the exact mutation with its original variables & same Idempotency-Key
            mutation.execute(mutation.state.variables);
          },
        },
      });
    },
  }),
});

type TanstackQueryProviderProps = {
  children: ReactNode;
};

function TanstackQueryProvider({ children }: TanstackQueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

export default TanstackQueryProvider;
