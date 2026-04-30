import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Button } from './ui/Button';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * Global Error Boundary to catch component crashes and show a fallback UI.
 */
class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-linen-50 dark:bg-forest-950 p-6">
          <div className="text-center max-w-md">
            <h1 className="font-serif text-3xl text-forest-900 dark:text-linen-50 mb-4">
              Something went wrong
            </h1>
            <p className="text-stone-500 dark:text-stone-400 mb-8 leading-relaxed">
              An unexpected error occurred. Please try refreshing the page or come back later.
            </p>
            <Button 
              variant="primary" 
              size="md" 
              onClick={() => window.location.reload()}
              className="rounded-full px-8"
            >
              Reload Page
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
