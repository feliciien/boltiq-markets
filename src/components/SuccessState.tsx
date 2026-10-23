/**
 * Shared Success State Component
 * Consistent success UI across the application.
 */
import { CheckCircle2 } from 'lucide-react';

interface SuccessStateProps {
  title: string;
  message: string;
  onNext?: { label: string; onClick: () => void };
  className?: string;
}

export default function SuccessState({
  title,
  message,
  onNext,
  className,
}: SuccessStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center py-20 text-center gap-3 ${className || ''}`}
    >
      <CheckCircle2 className="w-8 h-8 text-emerald-400 shrink-0" />
      <h3 className="text-base font-bold text-white">{title}</h3>
      <p className="text-sm text-slate-400 max-w-sm mx-auto">{message}</p>
      {onNext && (
        <button
          onClick={onNext.onClick}
          className="px-6 py-2 text-xs font-semibold text-slate-950 bg-amber-400 rounded-md hover:bg-amber-300 transition-colors cursor-pointer whitespace-nowrap"
        >
          {onNext.label}
        </button>
      )}
    </div>
  );
}