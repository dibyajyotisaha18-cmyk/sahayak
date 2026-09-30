import { AnimatePresence, motion } from 'motion/react';
import { AlertOctagon, CheckCircle2, HeartPulse, Info, Pill, ShieldAlert, Wallet } from 'lucide-react';
import { Card, CardHeader } from '@/components/ui/Card';
import { clockTime } from '@/lib/time';
import { EASE } from '@/lib/risk';
import { cn } from '@/lib/cn';
import { useAppStore } from '@/store/useAppStore';
import type { SafetyEvent } from '@/types/models';

const ICON = { CALL_RISK: ShieldAlert, INTERVENTION: AlertOctagon, MEDICINE: Pill, WELLBEING: HeartPulse, PAYMENT_PAUSED: Wallet } as const;
const TONE = { INFO: 'text-teal-600 bg-teal-50', WARN: 'text-warn bg-warn-bg', HIGH: 'text-high bg-high-bg', CRITICAL: 'text-critical bg-critical-bg' } as const;

function when(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const days = Math.round((new Date(now.toDateString()).getTime() - new Date(d.toDateString()).getTime()) / 86400000);
  if (days === 0) return clockTime(iso);
  return days === 1 ? 'Yesterday' : d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

export function EventsTimeline({ limit, className }: { limit?: number; className?: string }) {
  const events = useAppStore((s) => s.events);
  const shown: SafetyEvent[] = limit ? events.slice(0, limit) : events;
  return (
    <Card className={className}>
      <CardHeader title="Recent safety events" />
      <ol className="px-5 pb-4">
        <AnimatePresence initial={false}>
          {shown.map((e) => {
            const Icon = ICON[e.type] ?? Info;
            return (
              <motion.li key={e.id} layout initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, ease: EASE }} className="flex gap-3 border-t border-line py-3 first:border-t-0">
                <span className={cn('mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full', TONE[e.severity])}><Icon size={16} aria-hidden /></span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold leading-snug">{e.description}</p>
                  <p className="tnum mt-0.5 flex items-center gap-1.5 text-xs text-slate-600">
                    {when(e.timestamp)}{e.resolved && <><span aria-hidden>·</span><CheckCircle2 size={12} aria-hidden />Resolved</>}
                  </p>
                </div>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ol>
    </Card>
  );
}
