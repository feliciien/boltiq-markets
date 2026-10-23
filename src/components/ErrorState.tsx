/**
 * Shared Error State Component
 * Consistent error UI without exposing sensitive information.
 */
import { AlertCircle } from 'lucide-react';

interface ErrorStateProps {
  title: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}

export default function ErrorState({
  title,
  message,
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center py-20 text-center gap-3 ${className || ''}`}
    >
      <AlertCircle className="w-8 h-8 text-red-400 shrink-0" />
      <h3 className="text-base font-bold text-white">{title}</h3>
      <p className="text-sm text-slate-400 max-w-sm mx-auto">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-2 text-xs font-semibold text-slate-950 bg-amber-400 rounded-md hover:bg-amber-300 transition-colors cursor-pointer whitespace-nowrap"
        >
          Try Again
        </button>
      )}
    </div>
  );
}