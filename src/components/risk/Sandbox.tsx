import { useMemo, useState } from 'react';
import { FlaskConical } from 'lucide-react';
import { Card, CardHeader } from '@/components/ui/Card';
import { RiskBadge } from './RiskBadge';
import { PointsChip } from './SignalChip';
import { scoreText } from '@/engine/riskEngine';
import { LEVEL } from '@/lib/risk';
import { cn } from '@/lib/cn';

const EXAMPLES = [
  'I am calling from the CBI. There is an arrest warrant against you.',
  'Do not tell your son. Transfer ₹50,000 immediately.',
  'Install AnyDesk and share your screen, then tell me the OTP.',
  'We will never ask for your OTP or PIN.',
  'आपको गिरफ्तार किया जाएगा, किसी को मत बताना',
  'কাউকে বলবেন না, এখনই টাকা পাঠান',
  'abhi turant paise bhejo',
];

export function Sandbox({ className }: { className?: string }) {
  const [text, setText] = useState('');
  const result = useMemo(() => scoreText(text), [text]);
  const style = LEVEL[result.level];
  return (
    <Card className={className}>
      <CardHeader title={<span className="inline-flex items-center gap-2"><FlaskConical size={14} aria-hidden />Test a sentence</span>} />
      <div className="space-y-3 px-5 pb-5">
        <p className="text-sm text-slate-600">Type or paste a sentence. The same rule engine that runs the demo scores it live — English, Hinglish, Hindi and Bengali.</p>
        <label htmlFor="sandbox" className="sr-only">Sentence to test</label>
        <textarea
          id="sandbox" value={text} onChange={(e) => setText(e.target.value)} rows={3} placeholder="e.g. There is an arrest warrant against you. Do not tell anyone."
          className="w-full rounded-xl border border-line bg-white p-3 text-base focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-600/40"
        />
        <ul className="flex flex-wrap gap-2" aria-label="Example sentences">
          {EXAMPLES.map((e) => (
            <li key={e}><button type="button" onClick={() => setText(e)} className="rounded-full border border-line bg-blue-50 px-3 py-1.5 text-left text-xs font-medium hover:bg-blue-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-600/40">{e}</button></li>
          ))}
        </ul>
        <div className={cn('rounded-xl border p-3 transition-colors duration-300', style.bg, style.border)} aria-live="polite">
          <div className="flex items-center justify-between gap-2">
            <RiskBadge level={result.level} size="sm" />
            <span className={cn('tnum font-bold', style.fg)}>{result.score} / 100</span>
          </div>
          {result.signals.length === 0 ? (
            <p className="mt-2 text-sm text-slate-600">{text.trim() ? 'No scam signals detected in this sentence.' : 'Waiting for text…'}</p>
          ) : (
            <ul className="mt-2 space-y-1.5">
              {result.signals.map((s) => (
                <li key={s.category} className="flex items-center gap-2 text-sm">
                  <span className="flex-1"><strong>{s.label}</strong> <span className="text-slate-600">— “{s.evidence}”</span></span>
                  <PointsChip points={s.points} />
                </li>
              ))}
            </ul>
          )}
          {result.capped && <p className="mt-2 text-xs font-medium text-slate-600">One indicator alone never makes a call high-risk — score capped at 29.</p>}
        </div>
      </div>
    </Card>
  );
}
