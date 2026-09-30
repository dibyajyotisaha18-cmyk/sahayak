import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { EASE } from '@/lib/risk';
import { mmss } from '@/lib/time';
import { cn } from '@/lib/cn';
import type { TranscriptLine } from '@/types/models';

/** Lines that have already been revealed once, so remounting doesn't replay them. */
const seen = new Set<string>();

function RevealText({ id, text, speed, live }: { id: string; text: string; speed: number; live: boolean }) {
  const words = text.split(' ');
  const [count, setCount] = useState(seen.has(id) || !live ? words.length : 0);
  useEffect(() => {
    if (count >= words.length) { seen.add(id); return; }
    const h = setTimeout(() => setCount((c) => c + 1), 60 / speed);
    return () => clearTimeout(h);
  }, [count, words.length, id, speed]);
  const done = count >= words.length;
  return (
    <>
      {words.slice(0, count).join(' ')}
      {!done && <span className="caret ml-0.5 inline-block h-[1em] w-[2px] translate-y-[2px] bg-navy-900" aria-hidden />}
    </>
  );
}

export function TranscriptFeed({ lines, speed = 1, callerName, userName = 'Mrs. Sen', className, empty }: {
  lines: TranscriptLine[]; speed?: number; callerName: string; userName?: string; className?: string; empty?: string;
}) {
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => { box.current?.scrollTo({ top: box.current.scrollHeight, behavior: 'smooth' }); }, [lines.length]);
  return (
    <div ref={box} className={cn('space-y-3 overflow-y-auto', className)} role="log" aria-label="Live transcript">
      {lines.length === 0 && <p className="text-sm text-slate-600">{empty ?? 'Waiting for the call to start…'}</p>}
      {lines.map((l, i) => (
        <motion.div
          key={l.id}
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: EASE }}
          className={cn('flex flex-col', l.speaker === 'USER' ? 'items-end' : 'items-start')}
        >
          <span className="mb-0.5 text-[11px] font-semibold uppercase tracking-wider text-slate-600 tnum">
            {l.speaker === 'CALLER' ? callerName : userName} · {mmss(l.atSec)}
          </span>
          <p className={cn(
            'max-w-[92%] rounded-2xl px-3.5 py-2.5 text-[15px] leading-snug',
            l.speaker === 'CALLER' ? 'rounded-tl-sm bg-blue-100 text-navy-900' : 'rounded-tr-sm bg-teal-50 text-navy-900',
          )}>
            <RevealText id={l.id} text={l.text} speed={speed} live={i === lines.length - 1} />
          </p>
        </motion.div>
      ))}
    </div>
  );
}
