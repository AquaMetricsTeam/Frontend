import { Navigate } from "react-router-dom";
import { useAuth } from "@/components/Providers/AuthProvider";
import { HeroPanel } from "@/features/auth/components/HeroPanel";
import { LoginForm } from "@/features/auth/components/LoginForm";
import logoHorizontal from "@/assets/logo-horizontal.png";

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

      <div className="flex w-full flex-col items-center justify-center px-6 lg:w-1/2 lg:px-16 bg-background">
        <div className="  flex items-center justify-between lg:hidden ">
          <img
            src={logoHorizontal}
            alt="AquaMetrics"
            className="h-16 w-auto object-contain"
          />
        </div>

        <LoginForm />
      </div>
    </div>
  );
}
