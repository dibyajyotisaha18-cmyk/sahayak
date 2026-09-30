import { useState } from 'react';
import { Link } from 'react-router-dom';
import { HeartHandshake, Mic, Pill, ShieldCheck, ShieldOff, Siren, Users, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { BigTile } from '@/components/parent/BigTile';
import { Modal } from '@/components/ui/Modal';
import { Toggle } from '@/components/ui/Toggle';
import { EmergencySheet } from '@/components/parent/EmergencySheet';
import { useT } from '@/i18n/useT';
import { useAppStore } from '@/store/useAppStore';
import { partOfDay } from '@/lib/time';
import { cn } from '@/lib/cn';

export function ParentHomeContent({ compact }: { compact?: boolean }) {
  const { t } = useT();
  const protectionOn = useAppStore((s) => s.protectionOn);
  const setProtection = useAppStore((s) => s.setProtection);
  const [sos, setSos] = useState(false);
  const [prot, setProt] = useState(false);
  return (
    <div className={cn('mx-auto flex w-full max-w-xl flex-col gap-5', compact ? 'p-4' : 'p-1')}>
      <header>
        {(() => { const H = compact ? 'h2' : 'h1'; return <H className="text-[36px] font-extrabold leading-tight sm:text-[44px]">{t(partOfDay())}, {t('mrsSen')}</H>; })()}
        <p className={cn('mt-2 inline-flex items-center gap-2 text-[22px] font-semibold', protectionOn ? 'text-teal-600' : 'text-slate-600')}>
          {protectionOn ? <ShieldCheck size={28} aria-hidden /> : <ShieldOff size={28} aria-hidden />}
          {protectionOn ? t('protectionOn') : t('protectionOff')}
        </p>
      </header>

      <Link
        to="/parent/talk"
        className="flex min-h-[160px] w-full flex-col items-center justify-center gap-3 rounded-3xl bg-teal-600 p-5 text-center text-[30px] font-extrabold leading-tight text-white shadow-card transition-[transform,background-color] duration-150 hover:bg-[#096a61] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-600/40"
      >
        <Mic size={56} aria-hidden />{t('talkBig')}
      </Link>

      <div className="grid grid-cols-2 gap-4">
        <BigTile icon={Pill} label={t('medicines')} to="/parent/medicines" />
        <BigTile icon={HeartHandshake} label={t('callProtection')} onClick={() => setProt(true)} />
        <BigTile icon={Users} label={t('family')} to="/parent/family" />
        <BigTile icon={Siren} label={t('emergency')} tone="emergency" onClick={() => setSos(true)} />
      </div>
      {!compact && (
        <Link to="/parent/pay" className="inline-flex min-h-[64px] items-center justify-center gap-3 rounded-2xl border-2 border-line bg-white px-4 text-[22px] font-bold shadow-card focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-600/40">
          <Wallet size={28} aria-hidden />{t('paymentProtection')}
        </Link>
      )}
      <Modal open={prot} onClose={() => setProt(false)} title={t('callProtection')} variant="sheet">
        <div className="space-y-4 p-6 pt-3">
          <p className="pr-10 text-[28px] font-bold leading-tight">{t('callProtection')}</p>
          <div className="flex items-center justify-between gap-4 rounded-2xl border-2 border-line p-4">
            <p className="text-[22px] font-semibold">{protectionOn ? t('protectionOn') : t('protectionOff')}</p>
            <Toggle checked={protectionOn} onChange={setProtection} label={t('callProtection')} />
          </div>
          <p className="text-lg text-slate-600">{t('simulatedNote')}</p>
          <Button size="xl" full variant="outline" onClick={() => setProt(false)}>{t('close')}</Button>
        </div>
      </Modal>
      <EmergencySheet open={sos} onClose={() => setSos(false)} />
    </div>
  );
}

export default function ParentHome() {
  return <ParentHomeContent />;
}
