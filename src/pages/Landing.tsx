import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, ChevronDown, EyeOff, FlaskConical, Lock, LockKeyhole, Radar, SearchCheck, ServerOff, ShieldCheck, Users, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { HeroFlow } from '@/components/landing/HeroFlow';
import { EASE } from '@/lib/risk';

const HOW = [
  { n: '01', title: 'DETECT', icon: Radar, body: 'Sahayak listens for the patterns scammers rely on — fake authority, fear, urgency and secrecy — and scores each one openly.' },
  { n: '02', title: 'VERIFY', icon: SearchCheck, body: 'Risk builds from several signals together, never one keyword. Every point is explained, so a warning is something you can check.' },
  { n: '03', title: 'INTERVENE', icon: Users, body: 'When the risk turns high, a trusted family member is alerted and can step in with a call or a voice message in her language.' },
  { n: '04', title: 'PROTECT', icon: LockKeyhole, body: 'If a payment is attempted during a risky call, it pauses and points her toward family before any money moves.' },
];

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const rise = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } } };

export default function Landing() {
  return (
    <main>
      <section className="relative overflow-hidden bg-navy-950 text-white">
        <div className="pointer-events-none absolute left-1/2 top-40 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-teal-600/20 blur-3xl" aria-hidden />
        <div className="relative mx-auto max-w-[1200px] px-4 pb-16 pt-14 sm:px-6 lg:pt-20">
          <p className="text-sm font-extrabold tracking-[0.3em] text-teal-50/90">SAHAYAK</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-extrabold leading-[1.05] sm:text-5xl lg:text-[56px]">The family-powered live scam shield for elderly Indians.</h1>
          <p className="mt-5 max-w-2xl text-lg text-white/80">Detect manipulation. Verify the risk. Bring the family in. Protect before the payment.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/demo?autostart=1"><Button size="lg">Try live demo <ArrowRight size={18} aria-hidden /></Button></Link>
            <a href="#how" onClick={(e) => { e.preventDefault(); document.getElementById('how')?.scrollIntoView({ behavior: 'smooth' }); }}><Button size="lg" variant="ghostDark">Explore how it works <ChevronDown size={18} aria-hidden /></Button></a>
          </div>
          <div className="mt-14"><HeroFlow /></div>
          <p className="mt-6 text-xs text-white/60">Prototype simulation — no real calls, payments or banking apps are accessed.</p>
        </div>
      </section>

      <section id="how" className="mx-auto max-w-[1200px] scroll-mt-20 px-4 py-20 sm:px-6">
        <h2 className="text-3xl font-extrabold sm:text-4xl">How it works</h2>
        <p className="mt-2 text-slate-600">One loop, four steps: detect, verify, intervene, protect.</p>
        <motion.ul variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }} className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {HOW.map((h) => (
            <motion.li key={h.n} variants={rise}>
              <Card className="h-full p-6">
                <div className="flex items-center justify-between"><span className="tnum text-sm font-bold text-teal-600">{h.n}</span><h.icon size={26} className="text-navy-700" aria-hidden /></div>
                <h3 className="mt-4 text-xl font-extrabold tracking-wide">{h.title}</h3>
                <p className="mt-2 text-slate-600">{h.body}</p>
              </Card>
            </motion.li>
          ))}
        </motion.ul>
      </section>

      <section id="why" className="scroll-mt-20 bg-white py-20">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <h2 className="text-3xl font-extrabold sm:text-4xl">Why Sahayak?</h2>
          <p className="mt-3 max-w-3xl text-lg text-slate-600">Real-time scam detection is increasingly available on modern devices. Sahayak focuses on the missing human layer: trusted-family intervention designed around elderly users.</p>
          <div className="mt-8 flex flex-wrap items-center gap-2 text-sm font-bold tracking-wide sm:text-base" aria-label="AI detection plus elderly-first UX plus family intervention plus payment safety equals Sahayak">
            {['AI DETECTION', 'ELDERLY-FIRST UX', 'FAMILY INTERVENTION', 'PAYMENT SAFETY'].map((t, i) => (
              <span key={t} className="contents"><span className="rounded-xl border border-line bg-blue-50 px-3.5 py-2.5">{t}</span>{i < 3 && <span className="text-slate-600" aria-hidden>+</span>}</span>
            ))}
            <span className="text-slate-600" aria-hidden>=</span>
            <span className="rounded-xl bg-navy-950 px-3.5 py-2.5 text-white">SAHAYAK</span>
          </div>
          <blockquote className="mt-10 border-l-4 border-teal-600 pl-5 text-2xl font-extrabold leading-snug sm:text-3xl">“Google can warn you. Sahayak brings your family in.”</blockquote>
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-5 rounded-3xl bg-navy-900 p-8 text-white sm:flex-row sm:items-center sm:p-10">
          <div><h2 className="text-2xl font-extrabold sm:text-3xl">See a scam stopped in under two minutes</h2><p className="mt-1 text-white/75">A guided, fully simulated walkthrough — no setup, no microphone needed.</p></div>
          <Link to="/demo?autostart=1"><Button size="lg">Try live demo <ArrowRight size={18} aria-hidden /></Button></Link>
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-4 pb-16 sm:px-6">
        <Card className="p-6 sm:p-8">
          <h2 className="text-2xl font-extrabold">Architecture at a glance</h2>
          <ol className="mt-5 flex flex-wrap items-center gap-2 text-sm font-bold">
            {['CALL / DEMO AUDIO', 'SPEECH-TO-TEXT', 'SIGNAL EXTRACTION', 'RISK ENGINE', 'USER WARNING', 'FAMILY ALERT', 'PAYMENT SAFETY'].map((s, i, a) => (
              <li key={s} className="flex items-center gap-2"><span className="rounded-lg bg-blue-100 px-2.5 py-1.5">{s}</span>{i < a.length - 1 && <ArrowRight size={14} className="text-slate-600" aria-hidden />}</li>
            ))}
          </ol>
          <Link to="/architecture" className="mt-5 inline-flex items-center gap-1.5 font-semibold text-blue-600 underline underline-offset-4">See the full architecture <ArrowRight size={16} aria-hidden /></Link>
        </Card>
      </section>

      <section className="bg-teal-50 py-16">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#075e56]">Privacy by design</p>
          <h2 className="mt-1 text-2xl font-extrabold sm:text-3xl">Your conversations should not become someone else’s dataset.</h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[[Lock, 'Prefer on-device processing'], [EyeOff, 'No raw call audio stored by default'], [UserCheck, 'She controls her circle'], [ServerOff, 'No sale of personal data']].map(([Icon, label]) => {
              const I = Icon as typeof Lock;
              return <li key={label as string} className="flex items-center gap-3 rounded-xl border border-teal-600/20 bg-white p-4 font-semibold"><I size={20} className="shrink-0 text-teal-600" aria-hidden />{label as string}</li>;
            })}
          </ul>
          <Link to="/privacy" className="mt-5 inline-flex items-center gap-1.5 font-semibold text-blue-600 underline underline-offset-4">Read privacy &amp; limitations <ArrowRight size={16} aria-hidden /></Link>
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6">
        <Card className="border-warn/30 p-6 sm:p-8">
          <h2 className="flex items-center gap-2 text-xl font-extrabold"><FlaskConical size={22} className="text-warn" aria-hidden />Prototype limitations</h2>
          <ul className="mt-3 list-disc space-y-1.5 pl-5 text-slate-600">
            <li>Calls, alerts, interventions and payments are simulated in a local environment.</li>
            <li>It does not intercept real cellular calls or block real banking or UPI apps.</li>
            <li>Detection is a transparent rule engine, not a trained model.</li>
          </ul>
          <Link to="/privacy#limitations" className="mt-4 inline-flex items-center gap-1.5 font-semibold text-blue-600 underline underline-offset-4">Full limitations <ArrowRight size={16} aria-hidden /></Link>
        </Card>
      </section>

      <section className="bg-navy-950 py-20 text-center text-white">
        <ShieldCheck size={36} className="mx-auto text-teal-600" aria-hidden />
        <p className="mx-auto mt-4 max-w-2xl px-4 text-2xl font-extrabold leading-snug sm:text-3xl">Because the strongest safety net isn’t just AI. It’s someone you trust.</p>
      </section>
    </main>
  );
}
