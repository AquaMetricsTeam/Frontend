import { type ReactNode } from "react";
import TanstackQueryProvider from "@/components/Providers/TanstackQueryProvider";
import { ThemeProvider } from "@/components/Providers/ThemeProvider";
import { AuthProvider } from "@/components/Providers/AuthProvider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "sonner";

type ProvidersProps = {
  children: ReactNode;
};

function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider>
      <TanstackQueryProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster richColors position="bottom-right" />
            {children}
          </TooltipProvider>
        </AuthProvider>
      </TanstackQueryProvider>
    </ThemeProvider>
  );
}

export default Providers;

