import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PhoneFrame } from '@/components/ui/PhoneFrame';
import { SimBadge } from '@/components/ui/SimBadge';
import { Tabs } from '@/components/ui/Tabs';
import { StepRail } from '@/components/demo/StepRail';
import { PresenterCaption } from '@/components/demo/PresenterCaption';
import { DemoControls } from '@/components/demo/DemoControls';
import { CompleteScreen } from '@/components/demo/CompleteScreen';
import { LiveAnalysis } from '@/components/risk/LiveAnalysis';
import { ParentDevice } from '@/components/parent/ParentDevice';
import { FamilyDashboardContent } from '@/pages/family/FamilyDashboard';
import { useAppStore } from '@/store/useAppStore';
import { useLayout } from '@/lib/useMedia';
import { ScopeContext } from '@/lib/scope';

type Tab = 'parent' | 'analysis' | 'family';

function DeviceScreen({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <section aria-label={label} className="relative isolate min-h-[560px] overflow-hidden rounded-2xl border border-line bg-[#FBFAF7]">
      <ScopeContext.Provider value="local">{children}</ScopeContext.Provider>
    </section>
  );
}

const ParentPhone = () => <PhoneFrame label="Parent device · Mrs. Sen"><ParentDevice /></PhoneFrame>;
const FamilyPhone = () => <PhoneFrame label="Family device · Arjun Sen"><FamilyDashboardContent compact /></PhoneFrame>;

export default function Demo() {
  const layout = useLayout();
  const [params] = useSearchParams();
  const { playback, demoStep, intervention } = useAppStore();
  const startCall = useAppStore((s) => s.startCall);
  const resetDemo = useAppStore((s) => s.resetDemo);
  const active = playback !== 'idle';
  const [tab, setTab] = useState<Tab>('parent');
  const [side, setSide] = useState<'parent' | 'family'>('parent');

  const start = useCallback(() => { resetDemo(); startCall('A', 'demo'); }, [resetDemo, startCall]);

  // Always begin from a clean state; clean up when leaving.
  useEffect(() => {
    resetDemo();
    let h: ReturnType<typeof setTimeout> | undefined;
    if (params.get('autostart') === '1') h = setTimeout(start, 900);
    return () => { if (h) clearTimeout(h); useAppStore.getState().resetDemo(); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-switch the visible device as the story moves between them.
  useEffect(() => {
    if (!active) return;
    const family = demoStep === 5 || (demoStep === 7 && intervention === 'NONE');
    const parent = demoStep === 1 || demoStep === 8 || (demoStep === 7 && intervention !== 'NONE');
    setSide(family ? 'family' : parent ? 'parent' : (s) => s);
    setTab(family ? 'family' : parent ? 'parent' : demoStep === 9 || (demoStep >= 2 && demoStep <= 6) ? 'analysis' : 'parent');
  }, [demoStep, intervention, active]);

  // Keyboard: Space = pause/resume, → = next step.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement;
      if (el.closest('input,textarea,select,[contenteditable="true"],[role="dialog"]')) return;
      const s = useAppStore.getState();
      if (e.key === ' ' && el.tagName !== 'BUTTON' && el.tagName !== 'A') {
        e.preventDefault();
        if (s.playback === 'idle') start();
        else if (s.playback === 'playing') s.pause();
        else if (s.playback === 'paused') s.resume();
      } else if (e.key === 'ArrowRight' && s.playback !== 'idle') { s.nextStep(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [start]);

  const complete = playback === 'done' && demoStep === 9;

  return (
    <main className="relative mx-auto max-w-[1440px] px-4 pb-4 pt-4 sm:px-6">
      <h1 className="sr-only">Guided demo: a scam call stopped by Sahayak and family</h1>
      <div className="mb-3 w-full min-w-0">
        <StepRail current={demoStep} active={active} />
      </div>

      <div className="relative">
        {layout === 'three' && (
          <div className="grid grid-cols-[330px_minmax(0,1fr)_330px] items-start gap-5 2xl:grid-cols-[360px_minmax(0,1fr)_360px]">
            <ParentPhone />
            <LiveAnalysis />
            <FamilyPhone />
          </div>
        )}
        {layout === 'two' && (
          <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,360px)] items-start gap-5">
            <LiveAnalysis />
            <div className="space-y-3">
              <Tabs label="Device" value={side} onChange={setSide} items={[{ id: 'parent', label: 'Parent' }, { id: 'family', label: 'Family' }]} />
              {side === 'parent' ? <ParentPhone /> : <FamilyPhone />}
            </div>
          </div>
        )}
        {layout === 'one' && (
          <div className="space-y-3">
            <Tabs label="View" value={tab} onChange={setTab} items={[{ id: 'parent', label: 'Parent' }, { id: 'analysis', label: 'Analysis' }, { id: 'family', label: 'Family' }]} className="w-full [&>button]:flex-1 [&>button]:justify-center" />
            {tab === 'parent' && <DeviceScreen label="Parent device"><ParentDevice /></DeviceScreen>}
            {tab === 'analysis' && <LiveAnalysis />}
            {tab === 'family' && <DeviceScreen label="Family device"><FamilyDashboardContent compact /></DeviceScreen>}
          </div>
        )}
        {complete && <CompleteScreen onRestart={start} />}
      </div>

      <div className="sticky bottom-0 z-30 -mx-4 mt-4 border-t border-line bg-white/95 px-4 py-3 backdrop-blur-sm sm:-mx-6 sm:px-6">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <PresenterCaption step={demoStep} active={active} />
          <DemoControls onStart={start} onRestart={start} />
        </div>
        <SimBadge className="mt-2 !py-1" />
      </div>
    </main>
  );
}
