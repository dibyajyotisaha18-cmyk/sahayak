import { AnimatePresence, motion } from 'motion/react';
import { Activity } from 'lucide-react';
import { BASELINE_LABEL, BASELINE_POINTS } from '@/engine/signals';
import { EASE, LEVEL } from '@/lib/risk';
import { mmss } from '@/lib/time';
import { PointsChip } from './SignalChip';
import { Card, CardHeader } from '@/components/ui/Card';
import type { CallSession } from '@/types/models';

export function RiskTimeline({ call, className }: { call: CallSession | null; className?: string }) {
  const active = !!call && call.status !== 'RINGING';
  const style = LEVEL[call?.riskLevel ?? 'LOW'];
  return (
    <Card className={className}>
      <CardHeader title={<span className="inline-flex items-center gap-2"><Activity size={14} aria-hidden />Live risk analysis</span>} />
      <ol className="space-y-2 px-5 pb-3">
        {!active && <li className="text-sm text-slate-600">No call in progress.</li>}
        {active && (
          <li className="flex items-center gap-3 text-sm">
            <span className="tnum w-11 text-slate-600">00:00</span>
            <span className="flex-1 font-medium">{BASELINE_LABEL}</span>
            <PointsChip points={BASELINE_POINTS} />
          </li>
        )}
        <AnimatePresence initial={false}>
          {call?.detectedSignals.map((s) => (
            <motion.li
              key={s.category}
              initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, ease: EASE }}
              className="flex items-start gap-3 text-sm"
            >
              <span className="tnum mt-0.5 w-11 text-slate-600">{mmss(s.atSec)}</span>
              <span className="flex-1">
                <span className="block font-semibold">{s.label}</span>
                <span className="block text-xs text-slate-600">Matched: “{s.evidence}”</span>
              </span>
              <PointsChip points={s.points} />
            </motion.li>
          ))}
        </AnimatePresence>
      </ol>
      <div className={`flex items-center justify-between rounded-b-2xl border-t border-line px-5 py-3 text-sm font-bold uppercase tracking-wide transition-colors duration-300 ${style.bg} ${style.fg}`}>
        <span>Current risk</span>
        <span className="tnum">{call?.riskScore ?? 0} / 100 · {call?.riskLevel ?? 'LOW'}</span>
      </div>
    </Card>
  );
}
