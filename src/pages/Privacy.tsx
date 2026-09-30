import { Lock, ShieldCheck } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Toggle } from '@/components/ui/Toggle';
import { useAppStore } from '@/store/useAppStore';

const PRINCIPLES = [
  'Prefer on-device processing',
  'No raw call audio stored by default',
  'Store only necessary risk events',
  'Minimal information in family alerts',
  'The elderly user controls trusted contacts',
  'The user can turn protection off',
  'No sale of personal data',
];
const SECURITY = ['Encrypted family alerts', 'Secure authentication', 'Role-based access', 'Minimal retention', 'Never stores banking credentials, OTPs or passwords'];

export default function Privacy() {
  const { protectionOn, setProtection } = useAppStore();
  return (
    <main className="mx-auto max-w-[900px] px-4 py-14 sm:px-6">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal-600">Privacy by design</p>
      <h1 className="mt-1 text-4xl font-extrabold leading-tight sm:text-5xl">Your conversations should not become someone else’s dataset.</h1>

      <Card className="mt-8 flex items-center justify-between gap-4 p-5">
        <div className="flex items-center gap-3"><ShieldCheck size={24} className={protectionOn ? 'text-teal-600' : 'text-slate-600'} aria-hidden /><div><p className="font-bold">Call protection is {protectionOn ? 'on' : 'off'}</p><p className="text-sm text-slate-600">Working demo toggle — the same setting Mrs. Sen sees on her home screen.</p></div></div>
        <Toggle checked={protectionOn} onChange={setProtection} label="Call protection" />
      </Card>

      <h2 className="mt-10 text-2xl font-extrabold">Principles</h2>
      <ul className="mt-3 grid gap-2 sm:grid-cols-2">{PRINCIPLES.map((p) => <li key={p} className="flex items-center gap-2.5 rounded-xl border border-line bg-white p-3.5 font-medium"><Lock size={16} className="shrink-0 text-teal-600" aria-hidden />{p}</li>)}</ul>

      <h2 className="mt-10 text-2xl font-extrabold">Security (production architecture)</h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5">{SECURITY.map((s) => <li key={s}>{s}</li>)}</ul>
      <p className="mt-3 text-slate-600">In this prototype, authentication and payments are mocked. No regulatory compliance is claimed.</p>

      <h2 id="limitations" className="mt-10 scroll-mt-24 text-2xl font-extrabold">Prototype limitations</h2>
      <ul className="mt-3 space-y-3">
        {[
          'Native cellular call-audio interception and direct intervention into arbitrary phone calls are restricted by mobile operating systems and require deeper Android/OEM/telecom integration.',
          'For this prototype, Sahayak uses a simulated live-call environment to demonstrate the complete detection and intervention workflow.',
          'This prototype does not block real banking applications or cellular calls.',
        ].map((t) => <li key={t} className="rounded-xl border border-warn/30 bg-warn-bg/50 p-4">{t}</li>)}
      </ul>
    </main>
  );
}
