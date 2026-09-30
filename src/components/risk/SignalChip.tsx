import { motion } from 'motion/react';
import { EASE } from '@/lib/risk';

export function PointsChip({ points }: { points: number }) {
  return (
    <motion.span
      initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.25, ease: EASE }}
      className="tnum inline-flex items-center rounded-full bg-navy-900 px-2.5 py-1 text-xs font-bold text-white"
    >
      +{points}
    </motion.span>
  );
}
