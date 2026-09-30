import { useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { LEVEL } from '@/lib/risk';
import { cn } from '@/lib/cn';
import { useT, LEVEL_KEY } from '@/i18n/useT';
import type { RiskLevel } from '@/types/models';

const R = 52;
const C = 2 * Math.PI * R;

export function RiskMeter({ score, level, size = 220, showLabel = true, className }: {
  score: number; level: RiskLevel; size?: number; showLabel?: boolean; className?: string;
}) {
  const { t } = useT();
  const target = useMotionValue(0);
  const spring = useSpring(target, { stiffness: 60, damping: 18 });
  const offset = useTransform(spring, (v) => C * (1 - v / 100));
  const shown = useTransform(spring, (v) => Math.round(v));
  const style = LEVEL[level];
  const Icon = style.icon;

  useEffect(() => { target.set(score); }, [score, target]);

  return (
    <div className={cn('flex flex-col items-center gap-3', className)}>
      <div
        className="relative rounded-full transition-shadow duration-500"
        style={{ width: size, height: size, boxShadow: level === 'CRITICAL' ? '0 0 0 6px rgba(185,28,28,0.08), 0 0 32px rgba(185,28,28,0.18)' : '0 0 0 0 rgba(0,0,0,0)' }}
        role="img"
        aria-label={`${t('risk')} ${score} / 100, ${t(LEVEL_KEY[level])}`}
      >
        <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
          <circle cx="60" cy="60" r={R} fill="none" stroke="#E3E8F0" strokeWidth="10" />
          <motion.circle
            cx="60" cy="60" r={R} fill="none" strokeWidth="10" strokeLinecap="round"
            strokeDasharray={C} style={{ strokeDashoffset: offset }}
            animate={{ stroke: style.ring }} initial={false} transition={{ duration: 0.45 }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="flex items-baseline gap-1">
            <motion.span className="tnum font-extrabold leading-none" style={{ fontSize: size * 0.27 }}>{shown}</motion.span>
            <span className="tnum font-semibold text-slate-600" style={{ fontSize: size * 0.085 }}>/100</span>
          </div>
          {showLabel && (
            <span className={cn('mt-1 inline-flex items-center gap-1 font-bold uppercase tracking-wide transition-colors duration-300', style.fg)} style={{ fontSize: Math.max(11, size * 0.065) }}>
              <Icon size={Math.max(12, size * 0.07)} aria-hidden />{t(LEVEL_KEY[level])}
            </span>
          )}
        </div>
      </div>
      <span className="sr-only" aria-live="polite">{`${t('risk')}: ${t(LEVEL_KEY[level])}, ${score} / 100`}</span>
    </div>
  );
}
