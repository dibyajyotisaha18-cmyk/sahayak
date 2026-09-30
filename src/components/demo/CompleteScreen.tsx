import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { CheckCircle2, RotateCcw, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Badge';
import { useAppStore } from '@/store/useAppStore';
import { mmss } from '@/lib/time';
import { formatINR } from '@/lib/format';
import { DEMO_AMOUNT } from '@/components/parent/PaymentFlow';
import { EASE } from '@/lib/risk';

export function CompleteScreen({ onRestart }: { onRestart: () => void }) {
  const { call, familyAlert, intervention, paymentOutcome } = useAppStore();
  const signals = call?.detectedSignals ?? [];
  const sent = paymentOutcome === 'AFTER_WARNING';
  const rows = [
    ['Time to first signal', signals[0] ? mmss(signals[0].atSec) : '—'],
    ['Family alert sent', familyAlert ? mmss(familyAlert.callSec) : '—'],
    ['Intervention', intervention === 'CONNECTED' ? 'Connected' : intervention === 'ACTIVE' ? 'Active' : 'Not activated'],
    [`Payment ${formatINR(DEMO_AMOUNT)}`, sent ? 'Demo payment recorded after warning (no real money)' : 'Not sent (simulated)'],
  ];
  return (
    <motion.div
      role="dialog" aria-modal="false" aria-labelledby="complete-title"
      initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.35, ease: EASE }}
      className="absolute inset-x-2 top-2 z-30 rounded-3xl border border-teal-600/30 bg-white p-6 shadow-modal sm:inset-x-6 sm:top-4 sm:p-8"
    >
      <div className="flex flex-col items-center text-center">
        <span className="grid h-16 w-16 place-items-center rounded-full bg-teal-50 text-teal-600"><ShieldCheck size={36} aria-hidden /></span>
        <p className="mt-3 text-xs font-bold uppercase tracking-[0.18em] text-teal-600">Scam intervention complete</p>
        <h2 id="complete-title" className="mt-1 text-3xl font-extrabold sm:text-4xl">{sent ? 'Warned, and the choice was hers.' : 'Detected before the money moved.'}</h2>
      </div>
      <dl className="mx-auto mt-6 grid max-w-3xl gap-3 sm:grid-cols-2">
        {rows.map(([k, v]) => (
          <div key={k} className="rounded-xl border border-line bg-blue-50/60 p-3.5">
            <dt className="text-xs font-bold uppercase tracking-wider text-slate-600">{k}</dt>
            <dd className="tnum mt-0.5 flex items-center gap-1.5 font-bold"><CheckCircle2 size={16} className="shrink-0 text-teal-600" aria-hidden />{v}</dd>
          </div>
        ))}
        <div className="rounded-xl border border-line bg-blue-50/60 p-3.5 sm:col-span-2">
          <dt className="text-xs font-bold uppercase tracking-wider text-slate-600">Signals detected</dt>
          <dd className="mt-2 flex flex-wrap gap-2">{signals.map((s) => <Chip key={s.category} className="!text-xs">{s.label}</Chip>)}</dd>
        </div>
      </dl>
      <div className="mt-6 flex flex-col items-center gap-3">
        <Button size="lg" onClick={onRestart}><RotateCcw size={18} aria-hidden />Run demo again</Button>
        <Link to="/protect?scenario=B" className="text-sm font-semibold text-blue-600 underline underline-offset-4 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-600/40">Try the safe bank call</Link>
        <p className="text-xs text-slate-600">Prototype simulation — no real calls, payments or banking apps are accessed.</p>
      </div>
    </motion.div>
  );
}
