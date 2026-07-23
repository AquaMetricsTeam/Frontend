import { Navigate } from "react-router-dom";
import { useAuth } from "@/components/Providers/AuthProvider";
import { HeroPanel } from "@/features/auth/components/HeroPanel";
import { LoginForm } from "@/features/auth/components/LoginForm";

export default function LoginPage() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#080e1a]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-cyan-400 border-t-transparent" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#080e1a]">
      <HeroPanel />

      <div className="flex w-full flex-col items-center justify-center px-6 lg:w-1/2 lg:px-16">
        <div className="mb-8 flex items-center gap-2.5 lg:hidden">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-400/20 ring-1 ring-cyan-400/30">
            <svg
              className="h-4 w-4 text-cyan-400"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M2 20c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2v-4c-2.5 0-2.5-2-5-2s-2.5 2-5 2-2.5-2-5-2-2.5 2-5 2zm0-8c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2v-4c-2.5 0-2.5-2-5-2s-2.5 2-5 2-2.5-2-5-2-2.5 2-5 2z" />
            </svg>
          </div>
          <span className="text-lg font-semibold text-white">
            Aqua<span className="text-cyan-400">Metrics</span>
          </span>
        </div>

        <LoginForm />
      </div>
    </div>
  );
}
