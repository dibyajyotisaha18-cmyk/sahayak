import { Phone, ShieldCheck } from 'lucide-react';
import { useT } from '@/i18n/useT';
import type { CallSession } from '@/types/models';

export function IncomingCallScreen({ call }: { call: CallSession }) {
  const { t } = useT();
  return (
    <div className="flex min-h-full flex-col items-center justify-between bg-navy-950 p-6 text-center text-white">
      <div className="mt-6 flex flex-col items-center gap-3">
        <span className="rounded-full bg-white/10 px-3 py-1.5 text-base font-semibold">{t('incomingCall')}</span>
        <div className="relative mt-4 grid h-28 w-28 place-items-center">
          <span className="pulse-ring absolute inset-0 rounded-full bg-white/20" aria-hidden />
          <span className="relative grid h-24 w-24 place-items-center rounded-full bg-white/10"><Phone size={44} aria-hidden /></span>
        </div>
        <h2 className="mt-2 text-[34px] font-extrabold leading-tight">{call.callerName}</h2>
        <p className="tnum text-[22px] text-white/85">{call.callerNumberMasked}</p>
        <span className="rounded-full border border-warn/50 bg-warn-bg px-3 py-1.5 text-base font-bold text-warn">{t('unknownNumber')}</span>
      </div>
      <div className="mb-4 flex flex-col items-center gap-3">
        <span className="inline-flex items-center gap-2 rounded-full bg-teal-600 px-4 py-2.5 text-base font-bold">
          <span className="relative flex h-3 w-3"><span className="pulse-ring absolute inset-0 rounded-full bg-white" /><span className="relative h-3 w-3 rounded-full bg-white" /></span>
          <ShieldCheck size={20} aria-hidden />{t('protectionActivePill')}
        </span>
      </div>
    </div>
  );
}
