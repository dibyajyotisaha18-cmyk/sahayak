import { AnimatePresence, motion } from 'motion/react';
import { Mic2 } from 'lucide-react';
import { STEPS } from './StepRail';

export const CAPTIONS = [
  "Mrs. Sen's phone rings from an unknown number. Sahayak protection is already on.",
  'The call is answered. Sahayak turns the caller’s words into a live transcript.',
  'The caller claims to be from the CBI. On its own that is low risk — one signal is never enough.',
  'Accusations and an arrest threat stack up. Every signal adds points, and every point is explained.',
  'The caller asked Mrs. Sen to hide the call — so Sahayak immediately told her son.',
  'A demand to transfer ₹2,00,000 immediately pushes the risk to critical, while Mrs. Sen is warned calmly.',
  'Arjun steps in. A calm protection screen and his own voice message reach his mother’s phone.',
  'When Mrs. Sen tries to pay, Sahayak pauses the transaction and steers her toward her son.',
  'Scam stopped: detected before the money moved. (Simulated — no real call or payment.)',
];

export function PresenterCaption({ step, active }: { step: number; active: boolean }) {
  const text = active ? CAPTIONS[step - 1] : 'Press Start demo (or Space) to watch a digital-arrest scam get stopped in about 100 seconds.';
  const label = active ? `Step ${step} · ${STEPS[step - 1].label}` : 'Ready';
  return (
    <div className="min-w-0 flex-1" aria-live="polite">
      <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-teal-600"><Mic2 size={12} aria-hidden />{label}</p>
      <AnimatePresence mode="wait" initial={false}>
        <motion.p key={text} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }} className="mt-0.5 text-base font-medium leading-snug text-navy-900 sm:text-lg">
          {text}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
