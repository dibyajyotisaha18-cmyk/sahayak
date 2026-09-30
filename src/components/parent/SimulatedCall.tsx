import { PhoneCall, PhoneOff } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { useT } from '@/i18n/useT';

/** Simulated outgoing call screen. No real call is placed. */
export function SimulatedCall({ open, onClose, name = 'Arjun Sen', note }: { open: boolean; onClose: () => void; name?: string; note?: string }) {
  const { t } = useT();
  return (
    <Modal open={open} onClose={onClose} title={t('calling')} variant="sheet" hideTitle className="!max-h-full !rounded-none h-full bg-navy-950 text-white">
      <div className="flex h-full min-h-[480px] flex-col items-center justify-center gap-5 p-6 text-center">
        <Avatar name={name} size={96} className="!bg-white/10 !text-white" />
        <p className="text-[28px] font-bold leading-tight">{name === 'Arjun Sen' ? t('calling') : `${name}…`}</p>
        <span className="inline-flex items-center gap-2 text-lg text-white/80"><PhoneCall size={22} aria-hidden />{t('connecting')}</span>
        <p className="max-w-xs text-base text-white/70">{note ?? t('emergencyDemo')}</p>
        <Button variant="dangerOutline" size="xl" onClick={onClose} className="mt-2 w-full max-w-xs !bg-transparent !text-white !border-white/60 hover:!bg-white/10">
          <PhoneOff size={26} aria-hidden />{t('endCall')}
        </Button>
      </div>
    </Modal>
  );
}
