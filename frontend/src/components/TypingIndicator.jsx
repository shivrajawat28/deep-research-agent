import { PenLine } from 'lucide-react';

export function TypingIndicator() {
  return (
    <div className="flex justify-center">
      <div className="inline-flex items-center gap-3 rounded-full bg-card px-4 py-2 text-sm text-muted shadow-subtle">
        <PenLine className="h-4 w-4 text-primary" />
        <span>Generating report</span>
        <span className="flex gap-1">
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted [animation-delay:-0.2s]" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted [animation-delay:-0.1s]" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted" />
        </span>
      </div>
    </div>
  );
}
