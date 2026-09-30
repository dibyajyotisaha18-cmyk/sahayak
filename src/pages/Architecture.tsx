import { motion } from 'motion/react';
import { ArrowDown, CheckCircle2, Rocket, Wrench } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { SIGNALS, BASELINE_POINTS } from '@/engine/signals';
import { EASE } from '@/lib/risk';

const PIPELINE = [
  ['CALL / DEMO AUDIO', 'Prototype: scripted call scenarios. Production: on-device or telecom stream.', 'SIMULATED'],
  ['SPEECH-TO-TEXT', 'Prototype: pre-written transcript. Production: on-device recognition.', 'SIMULATED'],
  ['SCAM SIGNAL EXTRACTION', 'Multilingual patterns for authority, threats, urgency, secrecy and payment requests.', 'RUNS TODAY'],
  ['RISK ENGINE', 'Deterministic scoring: each category counts once, single indicators are capped, negations are skipped.', 'RUNS TODAY'],
  ['CONTEXT + CONFIDENCE', 'Every score change is tied to a named signal, its points and the words that matched.', 'RUNS TODAY'],
  ['USER WARNING', 'A calm, non-alarming message on the parent’s device — never a diagnosis of the caller.', 'RUNS TODAY'],
  ['FAMILY ALERT', 'Fires once when risk first reaches High and escalates at Critical.', 'SIMULATED'],
  ['INTERVENTION', 'Trusted contact sends a voice message and a protection screen appears.', 'SIMULATED'],
  ['PAYMENT SAFETY', 'A payment attempted during a risky call is paused; the user keeps the final choice.', 'SIMULATED'],
] as const;

const MODELS: [string, string[]][] = [
  ['User', ['id', 'name', 'age', 'preferredLanguage', 'phone', 'emergencyContacts']],
  ['TrustedContact', ['id', 'name', 'relationship', 'phone', 'role', 'priority', 'availability', 'notificationPreference']],
  ['CallSession', ['id', 'callerName', 'callerNumberMasked', 'startTime', 'transcript[]', 'riskScore', 'riskLevel', 'detectedSignals[]', 'status']],
  ['DetectedSignal', ['category', 'label', 'points', 'atSec', 'evidence']],
  ['SafetyEvent', ['id', 'type', 'timestamp', 'severity', 'description', 'resolved']],
  ['Medication', ['id', 'name', 'dosage', 'time', 'slot', 'status', 'missedCount7d']],
  ['WellbeingCheck', ['id', 'date', 'speedMps']],
];

export default function Architecture() {
  return (
    <main className="mx-auto max-w-[1200px] px-4 py-14 sm:px-6">
      <h1 className="text-4xl font-extrabold sm:text-5xl">Architecture</h1>
      <p className="mt-3 max-w-2xl text-lg text-slate-600">How a call becomes a warning, a family alert and a paused payment — and which parts really run in this prototype.</p>

      <ol className="mt-10 max-w-2xl">
        {PIPELINE.map(([name, desc, tag], i) => (
          <motion.li key={name} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.35, delay: 0.03 * (i % 4), ease: EASE }}>
            <Card className="flex items-start gap-4 p-4">
              <span className="tnum grid h-8 w-8 shrink-0 place-items-center rounded-full bg-navy-900 text-sm font-bold text-white">{i + 1}</span>
              <div className="min-w-0 flex-1"><p className="font-extrabold tracking-wide">{name}</p><p className="text-sm text-slate-600">{desc}</p></div>
              <Badge tone={tag === 'RUNS TODAY' ? 'teal' : 'neutral'}>{tag}</Badge>
            </Card>
            {i < PIPELINE.length - 1 && <ArrowDown size={20} className="mx-auto my-1 text-slate-600" aria-hidden />}
          </motion.li>
        ))}
      </ol>

      <div className="mt-14 grid gap-5 md:grid-cols-2">
        <Card className="border-teal-600/30 p-6">
          <h2 className="flex items-center gap-2 text-xl font-extrabold"><Wrench size={20} className="text-teal-600" aria-hidden />PROTOTYPE — what runs today</h2>
          <ul className="mt-4 space-y-2.5">
            {['Scripted call transcript', 'Local, deterministic rule engine in TypeScript', 'Simulated family alerts, intervention and payment pause', 'Web Speech API for the voice assistant and spoken warnings'].map((t) => <li key={t} className="flex gap-2"><CheckCircle2 size={18} className="mt-0.5 shrink-0 text-teal-600" aria-hidden />{t}</li>)}
          </ul>
        </Card>
        <Card className="p-6">
          <h2 className="flex items-center gap-2 text-xl font-extrabold"><Rocket size={20} className="text-blue-600" aria-hidden />FUTURE PRODUCTION INTEGRATION</h2>
          <ul className="mt-4 space-y-2.5">
            {['Android / OEM / telecom integration for call audio', 'On-device speech recognition', 'Indic language models', 'Secure, encrypted family notifications', 'Bank and UPI partnerships for payment safety'].map((t) => <li key={t} className="flex gap-2"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" aria-hidden />{t}</li>)}
          </ul>
        </Card>
      </div>

      <h2 className="mt-14 text-2xl font-extrabold">Transparent scoring</h2>
      <p className="mt-1 max-w-3xl text-slate-600">Each category counts once per call. Unknown numbers start at +{BASELINE_POINTS}. One indicator alone is capped at 29 (Low). OTP and ID requests are skipped when negated (“we will never ask for your OTP”).</p>
      <div className="mt-4 overflow-x-auto rounded-2xl border border-line bg-white shadow-card">
        <table className="w-full min-w-[560px] text-left text-sm">
          <caption className="sr-only">Signal categories and points</caption>
          <thead className="bg-blue-50 text-xs uppercase tracking-wider text-slate-600"><tr><th scope="col" className="px-4 py-3">Category</th><th scope="col" className="px-4 py-3">Shown to users as</th><th scope="col" className="px-4 py-3 text-right">Points</th></tr></thead>
          <tbody>
            {SIGNALS.map((s) => <tr key={s.category} className="border-t border-line"><th scope="row" className="px-4 py-2.5 font-mono text-xs font-semibold">{s.category}</th><td className="px-4 py-2.5">{s.label}</td><td className="tnum px-4 py-2.5 text-right font-bold">+{s.points}</td></tr>)}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-sm text-slate-600">Levels: Low 0–29 · Suspicious 30–59 · High 60–79 · Critical 80–100.</p>

      <h2 className="mt-14 text-2xl font-extrabold">Data models</h2>
      <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {MODELS.map(([name, fields]) => (
          <li key={name}><Card className="h-full p-5"><h3 className="font-mono text-sm font-bold text-teal-600">{name}</h3><ul className="mt-2 flex flex-wrap gap-1.5">{fields.map((f) => <li key={f} className="rounded-md bg-blue-50 px-2 py-1 font-mono text-xs">{f}</li>)}</ul></Card></li>
        ))}
      </ul>
    </main>
  );
}
