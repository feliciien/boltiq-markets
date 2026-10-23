/**
 * Shared Loading State Component
 * Consistent loading UI across the application.
 */
import { Activity } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
  className?: string;
}

export default function LoadingState({ message = 'Loading...', className }: LoadingStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center py-12 text-center gap-3 ${className || ''}`}
    >
      <Activity className="w-8 h-8 text-amber-400 animate-spin shrink-0" />
      <p className="text-sm text-slate-400 font-mono">{message}</p>
    </div>
  );
}