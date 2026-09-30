import { useEffect, useId, useRef, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X } from 'lucide-react';
import { cn } from '@/lib/cn';
import { EASE } from '@/lib/risk';
import { useScope } from '@/lib/scope';

const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  /** 'sheet' slides from the bottom; 'modal' is centred. */
  variant?: 'modal' | 'sheet';
  /** local = absolutely positioned inside the nearest relative parent (e.g. a phone frame). */
  scope?: 'viewport' | 'local';
  hideTitle?: boolean;
  dismissible?: boolean;
  className?: string;
}

export function Modal({ open, onClose, title, children, variant = 'modal', scope: scopeProp, hideTitle, dismissible = true, className }: Props) {
  const panel = useRef<HTMLDivElement>(null);
  const returnTo = useRef<Element | null>(null);
  const titleId = useId();
  const ctxScope = useScope();
  const scope = scopeProp ?? ctxScope;

  useEffect(() => {
    if (!open) return;
    returnTo.current = document.activeElement;
    const el = panel.current;
    const first = el?.querySelector<HTMLElement>(FOCUSABLE);
    (first ?? el)?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && dismissible) { e.stopPropagation(); onClose(); }
      if (e.key !== 'Tab' || !el) return;
      const nodes = [...el.querySelectorAll<HTMLElement>(FOCUSABLE)];
      if (!nodes.length) { e.preventDefault(); return; }
      const [a, z] = [nodes[0], nodes[nodes.length - 1]];
      if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
      else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
    };
    document.addEventListener('keydown', onKey, true);
    return () => {
      document.removeEventListener('keydown', onKey, true);
      (returnTo.current as HTMLElement | null)?.focus?.();
    };
  }, [open, onClose, dismissible]);

  const pos = scope === 'viewport' ? 'fixed' : 'absolute';
  return (
    <AnimatePresence>
      {open && (
        <div className={cn(pos, 'inset-0 z-50 flex', variant === 'sheet' ? 'items-end' : 'items-center justify-center p-4')}>
          <motion.div
            className="absolute inset-0 bg-navy-950/50"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}
            onClick={dismissible ? onClose : undefined}
          />
          <motion.div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            tabIndex={-1}
            className={cn(
              'relative w-full bg-white shadow-modal outline-none',
              variant === 'sheet' ? 'rounded-t-3xl max-h-[92%] overflow-y-auto' : 'max-w-lg rounded-2xl max-h-[90vh] overflow-y-auto',
              className,
            )}
            initial={variant === 'sheet' ? { y: 40, opacity: 0 } : { opacity: 0, scale: 0.98 }}
            animate={variant === 'sheet' ? { y: 0, opacity: 1 } : { opacity: 1, scale: 1 }}
            exit={variant === 'sheet' ? { y: 40, opacity: 0 } : { opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.25, ease: EASE }}
          >
            <h2 id={titleId} className={hideTitle ? 'sr-only' : 'px-6 pt-6 text-xl font-bold'}>{title}</h2>
            {dismissible && !hideTitle && (
              <button onClick={onClose} aria-label="Close" className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-lg text-slate-600 hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-600/40">
                <X size={20} aria-hidden />
              </button>
            )}
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
