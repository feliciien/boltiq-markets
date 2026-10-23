/**
 * Error Boundary — catches rendering errors in child components
 * Displays a graceful fallback UI without exposing sensitive information.
 */
import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = { hasError: false, errorMessage: '' };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      errorMessage: error.message || 'An unexpected error occurred.',
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error server-side only in production; never expose to client
    console.error('[ErrorBoundary]', error.message, errorInfo.componentStack);
  }

  public render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <AlertTriangle className="w-10 h-10 text-amber-400 mb-4 shrink-0" />
          <h2 className="text-xl font-bold text-white mb-2">Something went wrong</h2>
          <p className="text-slate-400 max-w-md mx-auto mb-6">
            We encountered an issue. Please refresh the page or contact support if the problem persists.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 text-xs font-semibold text-slate-950 bg-amber-400 rounded-md hover:bg-amber-300 transition-colors cursor-pointer"
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}