import { BellRing, Check, CheckCircle2, MessageSquareText, PhoneIncoming, ShieldAlert, ShieldX, TrendingUp, Users, Wallet, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/cn';

export const STEPS: { label: string; icon: LucideIcon }[] = [
  { label: 'Incoming call', icon: PhoneIncoming },
  { label: 'Live transcript', icon: MessageSquareText },
  { label: 'Risk rises', icon: TrendingUp },
  { label: 'Warning signals', icon: ShieldAlert },
  { label: 'Family alert', icon: BellRing },
  { label: 'Critical risk', icon: ShieldX },
  { label: 'Intervention', icon: Users },
  { label: 'Payment protection', icon: Wallet },
  { label: 'Complete', icon: CheckCircle2 },
];

export function StepRail({ current, active }: { current: number; active: boolean }) {
  return (
    <nav aria-label="Demo progress" className="relative overflow-x-auto">
      <ol className="flex min-w-max items-center gap-1 px-1 py-1 xl:min-w-0 xl:justify-between">
        {STEPS.map((s, i) => {
          const n = i + 1;
          const done = active && (n < current || (n === 9 && current === 9));
          const now = active && n === current && current !== 9;
          const Icon = s.icon;
          return (
            <li key={s.label} className="flex items-center gap-1 xl:flex-1" aria-current={now ? 'step' : undefined}>
              <div className={cn('flex items-center gap-1.5 rounded-xl border px-2 py-1.5 transition-colors duration-300', now ? 'border-navy-900 bg-navy-900 text-white' : done ? 'border-teal-600/30 bg-teal-50 text-teal-600' : 'border-line bg-white text-slate-600')}>
                <span className={cn('grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs font-bold tnum', now ? 'bg-white/15' : done ? 'bg-teal-600 text-white' : 'bg-blue-50')}>
                  {done ? <Check size={14} aria-hidden /> : n}
                </span>
                <Icon size={16} className="hidden 2xl:block" aria-hidden />
                <span className="whitespace-nowrap text-xs font-semibold">{s.label}</span>
                <span className="sr-only">{done ? '(completed)' : now ? '(current step)' : ''}</span>
              </div>
              {i < STEPS.length - 1 && <span className="hidden h-px min-w-2 flex-1 bg-line xl:block" aria-hidden />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
