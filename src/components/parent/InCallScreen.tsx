import { motion } from 'motion/react';
import { PhoneCall, ShieldCheck } from 'lucide-react';
import { mmss } from '@/lib/time';
import { useT } from '@/i18n/useT';
import { useAppStore } from '@/store/useAppStore';
import type { CallSession } from '@/types/models';

/** The parent's active-call view. At HIGH+ a calm (non-red, non-flashing) banner appears. */
export function InCallScreen({ call, callClockSec }: { call: CallSession; callClockSec: number }) {
  const { t } = useT();
  const warn = call.riskLevel === 'HIGH' || call.riskLevel === 'CRITICAL';
  const language = useAppStore((s) => s.language);
  return (
    <div className="flex min-h-full flex-col bg-navy-950 p-5 text-white">
      <div className="flex flex-col items-center gap-2 pt-4 text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-base font-semibold"><PhoneCall size={18} aria-hidden />{call.callerNumberMasked}</span>
        <h2 className="text-[32px] font-extrabold leading-tight">{call.callerName}</h2>
        <p className="tnum text-[26px] font-semibold text-white/90" aria-label="Call duration">{mmss(callClockSec)}</p>
      </div>
      <div className="mt-6">
        {warn ? (
          <motion.div
            role="status" lang={language}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-2xl border-2 border-teal-600 bg-white p-4 text-navy-900 shadow-modal"
          >
            <div className="flex items-center gap-2 text-base font-extrabold uppercase tracking-wide text-teal-600"><ShieldCheck size={22} aria-hidden />SAHAYAK</div>
            <p className="mt-2 text-[22px] font-semibold leading-snug">{t('gentleWarning')}</p>
          </motion.div>
        ) : (
          <div className="flex items-center gap-3 rounded-2xl bg-white/10 p-4 text-[20px] font-semibold">
            <ShieldCheck size={26} className="shrink-0 text-[#6EE7B7]" aria-hidden />{t('protectionActivePill')}
          </div>
        )}
      </div>
    </div>
  );
}
