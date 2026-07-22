import { Component, type ReactNode, type ErrorInfo } from "react";
import { MdRefresh, MdHome } from "react-icons/md";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

// ── Error Fallback UI ────────────────────────────────────────────────────────

interface ErrorFallbackProps {
  error: Error | null;
  onReset: () => void;
}

function ErrorFallback({ error, onReset }: ErrorFallbackProps) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center px-6 text-center">
      {/* Icon */}
      <div className="mb-6 flex size-16 items-center justify-center rounded-2xl bg-destructive/10">
        <svg
          className="size-8 text-destructive"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
          />
        </svg>
      </div>

      <h2
        className="mb-2 text-xl font-bold text-foreground"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Something went wrong
      </h2>

      <p className="mb-2 max-w-sm text-sm text-muted-foreground">
        An unexpected error occurred. Please refresh the page or go back home.
      </p>

      {/* Error detail (dev only) */}
      {import.meta.env.DEV && error?.message && (
        <details className="mb-6 mt-2 w-full max-w-md rounded-lg border border-border bg-muted/50 p-3 text-start">
          <summary className="cursor-pointer text-xs font-medium text-muted-foreground">
            Error details
          </summary>
          <code className="mt-2 block whitespace-pre-wrap break-all text-xs text-destructive">
            {error.message}
          </code>
        </details>
      )}

      {!import.meta.env.DEV && <div className="mb-6" />}

      <div className="flex items-center gap-3">
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
        >
          <MdRefresh className="size-4" />
          Refresh Page
        </button>

        <a
          href="/"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-600"
        >
          <MdHome className="size-4" />
          Back to Home
        </a>
      </div>
    </div>
  );
}

// ── ErrorBoundary ─────────────────────────────────────────────────────────────

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[ErrorBoundary]", error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <ErrorFallback error={this.state.error} onReset={this.handleReset} />
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
