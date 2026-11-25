import { FlaskConical } from 'lucide-react';

export function DemoBanner({ label = 'Simulated Demo Data', description }) {
  return (
    <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg border border-violet-500/25 bg-accent-subtle text-xs text-ink-secondary">
      <FlaskConical className="w-3.5 h-3.5 text-violet-400 shrink-0" />
      <span>
        <strong className="font-medium text-ink-primary">{label}:</strong>{' '}
        {description ||
          'Displaying simulated telemetry and workflow results. Connect Spring Boot + FastAPI backend to stream live production data.'}
      </span>
    </div>
  );
}
