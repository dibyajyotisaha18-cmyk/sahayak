import { useState } from 'react';
import { PhoneCall } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { SimulatedCall } from './SimulatedCall';
import { useT } from '@/i18n/useT';
import { useAppStore } from '@/store/useAppStore';

export function EmergencySheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useT();
  const addEvent = useAppStore((s) => s.addEvent);
  const [calling, setCalling] = useState(false);
  return (
    <>
      <Modal open={open && !calling} onClose={onClose} title={t('emergencyTitle')} variant="sheet">
        <div className="space-y-4 p-6 pt-3">
          <p className="pr-10 text-[26px] font-bold leading-tight">{t('emergencyTitle')}</p>
          <p className="text-lg text-slate-600">{t('emergencyDemo')}</p>
          <Button size="xl" full variant="dangerOutline" onClick={() => { setCalling(true); addEvent({ type: 'INTERVENTION', severity: 'WARN', resolved: true, description: 'Emergency contact call started (simulated)' }); }}>
            <PhoneCall size={26} aria-hidden />{t('emergencyYes')}
          </Button>
          <Button size="xl" full variant="outline" onClick={onClose}>{t('cancel')}</Button>
        </div>
      </Modal>
      <SimulatedCall open={open && calling} onClose={() => { setCalling(false); onClose(); }} />
    </>
  );
}
