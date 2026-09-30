import { useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { BellRing } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

export function Toaster() {
  const toasts = useAppStore((s) => s.toasts);
  const dismiss = useAppStore((s) => s.dismissToast);
  return (
    <div className="pointer-events-none fixed right-4 top-16 z-[70] flex w-[min(92vw,360px)] flex-col gap-2" aria-live="polite">
      <AnimatePresence>
        {toasts.map((t) => <ToastItem key={t.id} id={t.id} message={t.message} onDone={dismiss} />)}
      </AnimatePresence>
    </div>
  );
}

function ToastItem({ id, message, onDone }: { id: number; message: string; onDone: (id: number) => void }) {
  useEffect(() => {
    const h = setTimeout(() => onDone(id), 4200);
    return () => clearTimeout(h);
  }, [id, onDone]);
  return (
    <motion.div
      layout initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.22 }}
      className="pointer-events-auto flex items-start gap-3 rounded-xl border border-line bg-white p-3.5 shadow-modal"
    >
      <BellRing size={20} className="mt-0.5 shrink-0 text-teal-600" aria-hidden />
      <p className="text-sm font-medium">{message}</p>
    </motion.div>
  );
}
