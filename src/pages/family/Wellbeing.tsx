import { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Footprints, FlaskConical, Info, TrendingDown, TrendingUp, Upload, Minus } from 'lucide-react';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useAppStore } from '@/store/useAppStore';

function Sparkline({ values }: { values: number[] }) {
  const w = 320, h = 90, pad = 8;
  const min = Math.min(...values) - 0.03, max = Math.max(...values) + 0.03;
  const pts = values.map((v, i) => [pad + (i * (w - 2 * pad)) / Math.max(1, values.length - 1), h - pad - ((v - min) / (max - min)) * (h - 2 * pad)] as const);
  const d = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  const last = pts[pts.length - 1];
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full max-w-md" role="img" aria-label={`Walking speed over the last ${values.length} checks, from ${values[0].toFixed(2)} to ${values[values.length - 1].toFixed(2)} metres per second`}>
      <motion.path d={d} fill="none" stroke="#2F5FCC" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} />
      {pts.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={i === pts.length - 1 ? 4.5 : 2.5} fill={i === pts.length - 1 ? '#B45309' : '#2F5FCC'} />)}
      <text x={last[0]} y={last[1] - 10} textAnchor="end" fontSize="11" fontWeight="700" fill="#B45309">{values[values.length - 1].toFixed(2)}</text>
    </svg>
  );
}

export default function Wellbeing() {
  const { wellbeing, addWellbeing, addEvent, pushToast } = useAppStore();
  const [progress, setProgress] = useState<number | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const file = useRef<HTMLInputElement>(null);

  const latest = wellbeing[wellbeing.length - 1].speedMps;
  const previous = wellbeing[wellbeing.length - 2]?.speedMps ?? latest;
  const delta = latest - previous;
  const trend = delta <= -0.03 ? 'Slight decrease' : delta >= 0.03 ? 'Slight increase' : 'Stable';
  const monitor = delta <= -0.03;
  const TrendIcon = delta <= -0.03 ? TrendingDown : delta >= 0.03 ? TrendingUp : Minus;

  const analyse = (name: string | null) => {
    setFileName(name);
    setProgress(0);
    const start = performance.now();
    const step = () => {
      const p = Math.min(1, (performance.now() - start) / 3000);
      setProgress(p);
      if (p < 1) requestAnimationFrame(step);
      else {
        addWellbeing(0.78);
        addEvent({ type: 'WELLBEING', severity: 'INFO', resolved: true, description: 'Walking check completed (simulated result)' });
        pushToast('Walking check added (simulated analysis)');
        setProgress(null);
      }
    };
    requestAnimationFrame(step);
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-extrabold">Daily Wellbeing</h1>
      <Card>
        <CardHeader title={<span className="inline-flex items-center gap-2"><Footprints size={14} aria-hidden />Walking check</span>} action={<Badge tone={monitor ? 'warn' : 'safe'}><Info size={12} aria-hidden />{monitor ? 'Monitor' : 'Stable'}</Badge>} />
        <div className="grid gap-6 p-5 pt-0 md:grid-cols-2">
          <div>
            <dl className="grid grid-cols-3 gap-3">
              <div><dt className="text-xs font-semibold uppercase tracking-wider text-slate-600">Average speed</dt><dd className="tnum text-2xl font-extrabold">{latest.toFixed(2)}<span className="ml-1 text-sm font-semibold text-slate-600">m/s</span></dd></div>
              <div><dt className="text-xs font-semibold uppercase tracking-wider text-slate-600">Previous</dt><dd className="tnum text-2xl font-extrabold">{previous.toFixed(2)}<span className="ml-1 text-sm font-semibold text-slate-600">m/s</span></dd></div>
              <div><dt className="text-xs font-semibold uppercase tracking-wider text-slate-600">Trend</dt><dd className={`flex items-center gap-1 text-base font-bold ${monitor ? 'text-warn' : 'text-safe'}`}><TrendIcon size={18} aria-hidden />{trend}</dd></div>
            </dl>
            {monitor && <p className="mt-4 rounded-xl bg-warn-bg p-3 text-sm font-semibold text-warn">Change detected — consider checking in.</p>}
          </div>
          <div><Sparkline values={wellbeing.map((w) => w.speedMps)} /><p className="mt-1 text-xs text-slate-600">Last {wellbeing.length} checks (m/s)</p></div>
        </div>
      </Card>

      <Card className="p-5">
        <h2 className="text-lg font-bold">Add a walking check</h2>
        <p className="mt-1 flex items-start gap-2 text-sm text-slate-600"><FlaskConical size={16} className="mt-0.5 shrink-0" aria-hidden />Analysis is simulated in this prototype — no video is uploaded or stored.</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <input ref={file} type="file" accept="video/*" className="sr-only" aria-label="Upload walking video" onChange={(e) => { const f = e.target.files?.[0]; if (f) analyse(f.name); e.target.value = ''; }} />
          <Button onClick={() => file.current?.click()} disabled={progress !== null}><Upload size={18} aria-hidden />Upload walking video</Button>
          <Button variant="outline" onClick={() => analyse(null)} disabled={progress !== null}>Use sample measurement</Button>
        </div>
        {progress !== null && (
          <div className="mt-4" role="status" aria-live="polite">
            <p className="text-sm font-medium">Analysing{fileName ? ` ${fileName}` : ' sample'} (simulated)… <span className="tnum">{Math.round(progress * 100)}%</span></p>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-blue-100"><div className="h-full rounded-full bg-teal-600" style={{ width: `${progress * 100}%` }} /></div>
          </div>
        )}
      </Card>
      <p className="text-sm text-slate-600">Sahayak does not diagnose medical conditions. This is for family awareness only.</p>
    </div>
  );
}
