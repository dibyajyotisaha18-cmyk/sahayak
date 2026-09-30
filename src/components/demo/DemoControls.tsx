import { Pause, Play, RotateCcw, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAppStore } from '@/store/useAppStore';
import { cn } from '@/lib/cn';

export function DemoControls({ onStart, onRestart }: { onStart: () => void; onRestart: () => void }) {
  const { playback, speed, setSpeed, pause, resume, nextStep } = useAppStore();
  const idle = playback === 'idle';
  const done = playback === 'done';
  return (
    <div className="flex flex-wrap items-center gap-2">
      {idle ? (
        <Button size="lg" onClick={onStart}><Play size={20} aria-hidden />Start demo</Button>
      ) : (
        <Button variant="navy" onClick={playback === 'paused' ? resume : pause} disabled={done} aria-keyshortcuts="Space">
          {playback === 'paused' ? <><Play size={18} aria-hidden />Resume</> : <><Pause size={18} aria-hidden />Pause</>}
        </Button>
      )}
      <Button variant="outline" onClick={nextStep} disabled={idle || done} aria-keyshortcuts="ArrowRight"><SkipForward size={18} aria-hidden />Next step</Button>
      <Button variant="outline" onClick={onRestart} disabled={idle}><RotateCcw size={18} aria-hidden />Restart</Button>
      <div role="group" aria-label="Playback speed" className="inline-flex rounded-xl border border-line bg-white p-0.5">
        {([1, 2] as const).map((s) => (
          <button key={s} onClick={() => setSpeed(s)} aria-pressed={speed === s} className={cn('tnum h-10 rounded-lg px-3 text-sm font-bold focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-600/40', speed === s ? 'bg-navy-900 text-white' : 'text-slate-600')}>{s}×</button>
        ))}
      </div>
    </div>
  );
}
