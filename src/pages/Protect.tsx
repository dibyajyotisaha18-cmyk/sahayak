import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Pause, Play, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { SimBadge } from '@/components/ui/SimBadge';
import { LiveAnalysis } from '@/components/risk/LiveAnalysis';
import { Sandbox } from '@/components/risk/Sandbox';
import { useAppStore } from '@/store/useAppStore';
import { SCENARIOS } from '@/engine/scenarios';
import { cn } from '@/lib/cn';

export default function Protect() {
  const [params] = useSearchParams();
  const { call, playback, speed, mode, startCall, pause, resume, setSpeed, resetDemo, protectionOn } = useAppStore();
  const [scenario, setScenario] = useState<'A' | 'B'>(params.get('scenario') === 'B' ? 'B' : 'A');

  useEffect(() => {
    if (useAppStore.getState().mode === 'demo') useAppStore.getState().resetDemo();
    if (params.get('scenario') === 'B') useAppStore.getState().startCall('B', 'protect');
  }, [params]);

  const running = playback === 'playing' || playback === 'paused';
  const s = SCENARIOS[scenario];
  const label = protectionOn ? 'ACTIVE' : 'OFF';

  return (
    <main className="mx-auto max-w-[1200px] space-y-5 px-4 py-6 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-wide sm:text-3xl">SAHAYAK PROTECTION <span className={cn('ml-2 inline-flex items-center gap-2 align-middle text-base font-bold', protectionOn ? 'text-teal-600' : 'text-slate-600')}>
            <span className="relative flex h-3 w-3"><span className={cn('absolute inset-0 rounded-full bg-teal-600', protectionOn && 'pulse-ring')} /><span className={cn('relative h-3 w-3 rounded-full', protectionOn ? 'bg-teal-600' : 'bg-slate-400')} /></span>{label}
          </span></h1>
          <p className="mt-1 text-sm text-slate-600">Standalone live-call simulator: watch the rule engine score a call line by line.</p>
        </div>
        <SimBadge />
      </div>

      <Card className="p-4">
        <fieldset>
          <legend className="text-xs font-bold uppercase tracking-[0.12em] text-slate-600">Scenario</legend>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {(['A', 'B'] as const).map((id) => (
              <label key={id} className={cn('flex cursor-pointer items-start gap-3 rounded-xl border-2 p-3 transition-colors duration-150 focus-within:ring-4 focus-within:ring-blue-600/40', scenario === id ? 'border-navy-900 bg-blue-50' : 'border-line hover:bg-blue-50/60')}>
                <input type="radio" name="scenario" className="mt-1 accent-[#0F1F45]" checked={scenario === id} onChange={() => setScenario(id)} disabled={running} />
                <span><span className="block font-bold">{id}: {SCENARIOS[id].title}</span><span className="block text-sm text-slate-600">{id === 'A' ? 'Caller pretends to be a CBI officer and escalates to a payment demand.' : 'A real-sounding bank reminder that mentions OTP only to say it will never ask. Should stay low.'}</span></span>
              </label>
            ))}
          </div>
        </fieldset>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Button onClick={() => startCall(scenario, 'protect')}><Play size={18} aria-hidden />Start demo call</Button>
          <Button variant="outline" disabled={!running} onClick={playback === 'paused' ? resume : pause}>{playback === 'paused' ? <><Play size={18} aria-hidden />Resume</> : <><Pause size={18} aria-hidden />Pause</>}</Button>
          <Button variant="outline" onClick={() => setSpeed(speed === 1 ? 2 : 1)} aria-label={`Playback speed ${speed}×, switch to ${speed === 1 ? 2 : 1}×`}><span className="tnum">{speed}×</span></Button>
          <Button variant="ghost" onClick={resetDemo} disabled={!call}><RotateCcw size={18} aria-hidden />Reset</Button>
        </div>
      </Card>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <LiveAnalysis layout="wide" />
        <div className="space-y-4">
          {mode === 'protect' && call && scenario === 'B' && call.transcript.length > 0 && (
            <Card className="border-safe/30 bg-safe-bg p-4 text-sm font-medium text-safe" role="status">{s.note}</Card>
          )}
          <Sandbox />
        </div>
      </div>
    </main>
  );
}
