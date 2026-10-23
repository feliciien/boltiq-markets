/**
 * Shared Empty State Component
 * Consistent empty UI across the application.
 */
import { ArrowUpRight } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  message: string;
  action?: { label: string; onClick: () => void };
  className?: string;
}

export default function EmptyState({
  title,
  message,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center py-20 text-center gap-3 ${className || ''}`}
    >
      <div className="w-12 h-12 rounded bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-400 shrink-0">
        <ArrowUpRight className="w-6 h-6" />
      </div>
      <h3 className="text-base font-bold text-white">{title}</h3>
      <p className="text-sm text-slate-400 max-w-sm mx-auto">{message}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="px-6 py-2 text-xs font-semibold text-slate-950 bg-amber-400 rounded-md hover:bg-amber-300 transition-colors cursor-pointer whitespace-nowrap"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}