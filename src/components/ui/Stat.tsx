import type { LucideIcon } from 'lucide-react';
import { Card } from './Card';

export function Stat({ icon: Icon, label, value, hint }: { icon: LucideIcon; label: string; value: React.ReactNode; hint?: string }) {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.1em] text-slate-600">
        <Icon size={16} aria-hidden /> {label}
      </div>
      <div className="mt-2 text-xl font-bold tnum">{value}</div>
      {hint && <div className="mt-0.5 text-sm text-slate-600">{hint}</div>}
    </Card>
  );
}
