import { useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, PhoneCall, ShieldCheck, Volume2, Zap } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { RiskBadge } from '@/components/risk/RiskBadge';
import { SimulatedCall } from '@/components/parent/SimulatedCall';
import { useAppStore } from '@/store/useAppStore';
import { EASE } from '@/lib/risk';
import { mmss } from '@/lib/time';
import { cn } from '@/lib/cn';
import type { Language } from '@/types/models';

const LANGS: { id: Language; label: string }[] = [{ id: 'en', label: 'EN' }, { id: 'hi', label: 'हिन्दी' }, { id: 'bn', label: 'বাংলা' }];

export function AlertCard({ compact }: { compact?: boolean }) {
  const { familyAlert, call, callClockSec, intervention, countdown, sendIntervention, sendVoiceWarning, pushToast } = useAppStore();
  const [vlang, setVlang] = useState<Language>('en');
  const [modal, setModal] = useState(false);
  const [calling, setCalling] = useState(false);
  if (!familyAlert || !call) return null;

  const critical = familyAlert.level === 'CRITICAL';
  const active = intervention !== 'NONE';
  const offering = countdown?.kind === 'INTERVENE';

  return (
    <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: EASE }}>
      <Card className={cn('overflow-hidden border-2 transition-colors duration-500', active ? 'border-teal-600' : critical ? 'border-critical' : 'border-high')}>
        <div
          className={cn('flex items-center justify-between gap-2 px-5 py-3 transition-colors duration-500', active ? 'bg-teal-50 text-teal-600' : critical ? 'bg-critical-bg text-critical' : 'bg-high-bg text-high')}
          role={critical && !active ? 'alert' : 'status'}
        >
          <h3 className={cn('font-extrabold uppercase tracking-wide', compact ? 'text-sm' : 'text-base')}>
            {active ? 'Intervention active' : critical ? 'Critical-risk call detected' : 'High-risk call detected'}
          </h3>
          <RiskBadge level={call.riskLevel} size="sm" />
        </div>
        <div className="space-y-3 p-5">
          <dl className={cn('grid gap-x-4 gap-y-2 text-sm', compact ? 'grid-cols-2' : 'sm:grid-cols-2')}>
            <div><dt className="text-xs font-semibold uppercase tracking-wider text-slate-600">Parent</dt><dd className="font-semibold">Mrs. Sen</dd></div>
            {active
              ? <div><dt className="text-xs font-semibold uppercase tracking-wider text-slate-600">Trusted contact</dt><dd className="font-semibold">Arjun Sen</dd></div>
              : <div><dt className="text-xs font-semibold uppercase tracking-wider text-slate-600">Current risk</dt><dd className="tnum font-bold">{call.riskScore}/100</dd></div>}
            {active
              ? <div><dt className="text-xs font-semibold uppercase tracking-wider text-slate-600">Status</dt><dd className="flex items-center gap-1.5 font-semibold text-teal-600" aria-live="polite">{intervention === 'CONNECTED' ? <><CheckCircle2 size={14} aria-hidden />Connected</> : 'Connecting…'}</dd></div>
              : <div><dt className="text-xs font-semibold uppercase tracking-wider text-slate-600">Call duration</dt><dd className="tnum font-semibold">{mmss(callClockSec)}</dd></div>}
            {active && <div><dt className="text-xs font-semibold uppercase tracking-wider text-slate-600">Current risk</dt><dd className="tnum font-bold">{call.riskScore}/100</dd></div>}
          </dl>
          {!active && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-600">Detected</p>
              <ul className="mt-1 space-y-1 text-sm">
                {call.detectedSignals.map((s) => <li key={s.category} className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-navy-700" aria-hidden />{s.label}</li>)}
              </ul>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <Button variant="outline" onClick={() => setCalling(true)}><PhoneCall size={18} aria-hidden />Call parent</Button>
            {!active && (
              <Button
                variant="primary"
                className={cn(offering && 'ring-4 ring-teal-600/40 ring-offset-2')}
                onClick={() => { sendIntervention(); setModal(true); }}
              >
                <Zap size={18} aria-hidden />Intervene
              </Button>
            )}
          </div>
          {offering && !active && <p className="tnum text-xs font-medium text-teal-600" aria-live="off">Demo: auto-intervening in {countdown!.secondsLeft}s — or click Intervene now</p>}

          <div className="rounded-xl bg-blue-50 p-3">
            <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-600"><Volume2 size={14} aria-hidden />Send voice warning</p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <div role="radiogroup" aria-label="Voice warning language" className="inline-flex rounded-lg border border-line bg-white p-0.5">
                {LANGS.map((l) => (
                  <button
                    key={l.id} role="radio" aria-checked={vlang === l.id} onClick={() => setVlang(l.id)}
                    className={cn('rounded-md px-2.5 py-1 text-sm font-semibold focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-600/40', vlang === l.id ? 'bg-navy-900 text-white' : 'text-slate-600')}
                  >{l.label}</button>
                ))}
              </div>
              <Button size="sm" variant="navy" onClick={() => { sendVoiceWarning(vlang); pushToast('Voice warning sent to Mrs. Sen'); }}>Send</Button>
            </div>
          </div>

          <p className="text-xs leading-snug text-slate-600">Native cellular call intervention requires Android/OEM/telecom integration. This prototype demonstrates the intervention workflow in a simulated call environment.</p>
        </div>
      </Card>

      <Modal open={modal} onClose={() => setModal(false)} title="Intervention activated">
        <div className="space-y-4 p-6 pt-3">
          <p className="pr-10 text-xl font-extrabold uppercase tracking-wide text-teal-600"><ShieldCheck size={22} className="mr-1.5 inline -translate-y-0.5" aria-hidden />Intervention activated</p>
          <ol className="space-y-2 text-base">
            <li className="flex gap-2"><span className="tnum font-bold text-teal-600">1.</span>Mrs. Sen sees a calm protection screen asking her not to transfer money.</li>
            <li className="flex gap-2"><span className="tnum font-bold text-teal-600">2.</span>A voice message from you is played on her device.</li>
            <li className="flex gap-2"><span className="tnum font-bold text-teal-600">3.</span>Any payment attempt is paused until you have spoken.</li>
          </ol>
          <p className="text-xs text-slate-600">Simulated workflow — no real call is interrupted.</p>
          <Button full onClick={() => setModal(false)}>Got it</Button>
        </div>
      </Modal>
      <SimulatedCall open={calling} name="Mrs. Ananya Sen" onClose={() => setCalling(false)} />
    </motion.div>
  );
}
