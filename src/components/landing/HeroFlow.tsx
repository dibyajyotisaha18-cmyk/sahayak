import { useEffect, useState } from 'react';
import { BellRing, PhoneCall, ShieldCheck, Wallet } from 'lucide-react';
import { RiskMeter } from '@/components/risk/RiskMeter';
import { cn } from '@/lib/cn';

function Connector({ lit }: { lit: boolean }) {
  return (
    <svg className="mx-auto hidden h-2 w-14 shrink-0 lg:block" viewBox="0 0 56 8" aria-hidden preserveAspectRatio="none">
      <line x1="0" y1="4" x2="56" y2="4" stroke={lit ? '#2DD4BF' : 'rgba(255,255,255,0.25)'} strokeWidth="2" strokeDasharray="6 6" className="dash-flow" />
    </svg>
  );
}
function VConnector({ lit }: { lit: boolean }) {
  return (
    <svg className="mx-auto h-10 w-2 lg:hidden" viewBox="0 0 8 40" aria-hidden>
      <line x1="4" y1="0" x2="4" y2="40" stroke={lit ? '#2DD4BF' : 'rgba(255,255,255,0.25)'} strokeWidth="2" strokeDasharray="6 6" className="dash-flow" />
    </svg>
  );
}

export function HeroFlow() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const h = setInterval(() => setStep((s) => (s + 1) % 6), 1600);
    return () => clearInterval(h);
  }, []);
  const nodes = [
    { title: "Parent's phone", icon: PhoneCall, body: (<div className="rounded-xl bg-navy-950/60 p-3 text-left"><p className="text-xs text-white/60">Incoming call</p><p className="font-bold">CBI Officer</p><p className="tnum text-sm text-white/80">01:12</p></div>) },
    { title: 'Risk detection', icon: ShieldCheck, body: (<div className="flex justify-center"><RiskMeter score={96} level="CRITICAL" size={104} /></div>) },
    { title: 'Family alert', icon: BellRing, body: (<div className="rounded-xl bg-white p-3 text-left text-navy-900"><p className="text-xs font-bold uppercase tracking-wide text-critical">Sahayak alert</p><p className="font-bold">Arjun Sen</p><p className="text-sm text-slate-600">High-risk call in progress</p></div>) },
    { title: 'Payment protection', icon: Wallet, body: (<div className="rounded-xl bg-white p-3 text-left text-navy-900"><p className="text-xs font-bold uppercase tracking-wide text-teal-600">Demo</p><p className="font-bold">Transaction paused</p><p className="tnum text-sm text-slate-600">₹2,00,000 · not sent</p></div>) },
  ];
  return (
    <ol className="flex flex-col items-stretch lg:flex-row lg:items-center" aria-label="How Sahayak protects a call">
      {nodes.map((n, i) => {
        const lit = step > i || step === 5;
        const Icon = n.icon;
        return (
          <li key={n.title} className="contents">
            <div
                            className={cn('flex-1 rounded-2xl border p-4 transition-colors duration-500 lg:min-w-0', lit ? 'border-teal-600/60 bg-white/10' : 'border-white/10 bg-white/[0.04]')}
            >
              <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-white/85"><Icon size={16} aria-hidden />{n.title}</p>
              <div className="text-white">{n.body}</div>
            </div>
            {i < nodes.length - 1 && <><VConnector lit={step > i + 1 || step === 5} /><Connector lit={step > i + 1 || step === 5} /></>}
          </li>
        );
      })}
    </ol>
  );
}
