import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

type Tone = 'neutral' | 'teal' | 'blue' | 'safe' | 'warn' | 'high' | 'critical' | 'navy';
const TONE: Record<Tone, string> = {
  neutral: 'bg-slate-100 text-slate-600 border-slate-200',
  teal: 'bg-teal-50 text-teal-600 border-teal-600/25',
  blue: 'bg-blue-100 text-blue-600 border-blue-600/20',
  safe: 'bg-safe-bg text-safe border-safe/25',
  warn: 'bg-warn-bg text-warn border-warn/25',
  high: 'bg-high-bg text-high border-high/25',
  critical: 'bg-critical-bg text-critical border-critical/25',
  navy: 'bg-navy-900 text-white border-navy-900',
};

export function Badge({ tone = 'neutral', className, ...rest }: HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  return (
    <span
      className={cn('inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold leading-none', TONE[tone], className)}
      {...rest}
    />
  );
}

export function Chip({ className, ...rest }: HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn('inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1.5 text-sm font-medium text-navy-900', className)} {...rest} />;
}
