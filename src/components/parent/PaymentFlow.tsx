import { useState } from 'react';
import { AlertTriangle, CheckCircle2, Landmark, PhoneCall, ShieldCheck, Users } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { SimulatedCall } from './SimulatedCall';
import { useAppStore } from '@/store/useAppStore';
import { useT } from '@/i18n/useT';
import { formatINR } from '@/lib/format';

export const DEMO_AMOUNT = 200000;

/** Generic, unbranded demo payment flow. Never imitates a real payment app. */
export function PaymentFlow({ onDone }: { onDone?: () => void }) {
  const { t } = useT();
  const attempt = useAppStore((s) => s.paymentAttempt);
  const outcome = useAppStore((s) => s.paymentOutcome);
  const call = useAppStore((s) => s.call);
  const countdown = useAppStore((s) => s.countdown);
  const attemptPayment = useAppStore((s) => s.attemptPayment);
  const resolve = useAppStore((s) => s.resolvePayment);
  const resetPayment = useAppStore((s) => s.resetPayment);
  const [calling, setCalling] = useState(false);
  const score = call?.riskScore ?? 0;

  const Footer = () => <p className="mt-6 text-sm leading-snug text-slate-600">{t('payFooter')}</p>;

  if (attempt === 'NONE') {
    return (
      <div className="flex min-h-full flex-col gap-4 p-5">
        <Badge tone="warn" className="self-start !text-sm"><Landmark size={14} aria-hidden />{t('demoPayment')}</Badge>
        <h2 className="text-[34px] font-extrabold leading-tight">{t('payMoney')}</h2>
        <dl className="space-y-3 rounded-2xl border border-line bg-white p-4">
          <div><dt className="text-base text-slate-600">{t('payee')}</dt><dd className="text-[22px] font-bold">{t('payeeName')}</dd></div>
          <div><dt className="text-base text-slate-600">{t('amount')}</dt><dd className="tnum text-[34px] font-extrabold">{formatINR(DEMO_AMOUNT)}</dd></div>
        </dl>
        <Button size="xl" full onClick={attemptPayment}>{t('payNow')}</Button>
        <Footer />
      </div>
    );
  }

  if (attempt === 'PAUSED') {
    const chips = ['chipFinancial', 'chipImpersonation', 'chipUrgency', 'chipIsolation'] as const;
    return (
      <div className="flex min-h-full flex-col gap-4 p-5" role="alertdialog" aria-labelledby="pause-title">
        <Badge tone="warn" className="self-start !text-sm"><Landmark size={14} aria-hidden />{t('demoPayment')}</Badge>
        <div className="rounded-2xl border-2 border-navy-700 bg-white p-4">
          <h2 id="pause-title" className="flex items-center gap-2 text-[26px] font-extrabold uppercase leading-tight tracking-wide text-navy-900">
            <ShieldCheck size={30} className="shrink-0 text-teal-600" aria-hidden />{t('txPaused')}
          </h2>
          <p className="mt-2 text-[22px] font-semibold leading-snug">{t('onRiskyCall')}</p>
          <p className="mt-1 text-[20px] leading-snug text-slate-600">{t('speakTrusted')}</p>
          <p className="tnum mt-3 text-lg font-bold">{t('riskLabel')}: {score}/100</p>
          <ul className="mt-2 flex flex-wrap gap-2">{chips.map((c) => <li key={c}><Badge tone="high" className="!text-sm">{t(c)}</Badge></li>)}</ul>
        </div>
        <Button size="xl" full onClick={() => { setCalling(true); resolve('CALL_SON'); }}><PhoneCall size={26} aria-hidden />{t('callMySon')}</Button>
        <Button size="xl" full variant="navy" onClick={() => resolve('VERIFY_FAMILY')}><Users size={26} aria-hidden />{t('verifyFamily')}</Button>
        <Button size="lg" full variant="outline" onClick={() => resolve('CONTINUE_ANYWAY')}>{t('continueAnyway')}</Button>
        {countdown?.kind === 'PAYMENT' && <p className="tnum text-center text-sm text-slate-600" aria-live="off">Demo: choosing “{t('callMySon')}” in {countdown.secondsLeft}s</p>}
      </div>
    );
  }

  if (attempt === 'CONFIRMING') {
    return (
      <div className="flex min-h-full flex-col gap-4 p-5" role="alertdialog" aria-labelledby="sure-title">
        <Badge tone="warn" className="self-start !text-sm"><Landmark size={14} aria-hidden />{t('demoPayment')}</Badge>
        <div className="rounded-2xl border-2 border-warn bg-white p-4">
          <h2 id="sure-title" className="flex items-center gap-2 text-[28px] font-extrabold leading-tight"><AlertTriangle size={30} className="shrink-0 text-warn" aria-hidden />{t('areYouSure')}</h2>
          <p className="mt-2 text-[22px] leading-snug">{t('recommendVerify')}</p>
        </div>
        <Button size="xl" full onClick={() => resolve('GO_BACK')}>{t('goBack')}</Button>
        <Button size="lg" full variant="outline" onClick={() => resolve('CONFIRM_CONTINUE')}>{t('continueBtn')}</Button>
      </div>
    );
  }

  // CANCELLED or CONTINUED
  const cancelled = attempt === 'CANCELLED';
  return (
    <div className="flex min-h-full flex-col gap-4 p-5">
      <Badge tone="warn" className="self-start !text-sm"><Landmark size={14} aria-hidden />{t('demoPayment')}</Badge>
      <div className={`rounded-2xl border-2 bg-white p-4 ${cancelled ? 'border-teal-600' : 'border-line'}`} role="status">
        <CheckCircle2 size={40} className={cancelled ? 'text-teal-600' : 'text-slate-600'} aria-hidden />
        <h2 className="mt-2 text-[28px] font-extrabold leading-tight">
          {cancelled ? t('paymentNotSent') : outcome === 'AFTER_WARNING' ? t('paymentRecorded') : t('paymentSuccess')}
        </h2>
        {cancelled && <p className="mt-2 text-[22px] leading-snug text-slate-600">{t('paymentNotSentBody')}</p>}
        {cancelled && <p className="tnum mt-2 text-lg font-bold">{formatINR(DEMO_AMOUNT)} · not sent (simulated)</p>}
      </div>
      {onDone && <Button size="xl" full onClick={() => { resetPayment(); onDone(); }}>{t('paymentBackHome')}</Button>}
      {!onDone && <Button size="lg" full variant="outline" onClick={resetPayment}>{t('back')}</Button>}
      <SimulatedCall open={calling} onClose={() => setCalling(false)} />
    </div>
  );
}
