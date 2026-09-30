import { useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Loader2, PhoneCall, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { VoiceWarningCard } from './VoiceWarningCard';
import { SimulatedCall } from './SimulatedCall';
import { useAppStore } from '@/store/useAppStore';
import { useT } from '@/i18n/useT';

/** Calm overlay shown on the parent's device after the family member intervenes. */
export function ProtectionOverlay({ onDismiss }: { onDismiss?: () => void }) {
  const { t } = useT();
  const intervention = useAppStore((s) => s.intervention);
  const [calling, setCalling] = useState(false);
  const connected = intervention === 'CONNECTED';
  return (
    <div className="flex min-h-full flex-col gap-4 bg-navy-950 p-5 text-white" role="alertdialog" aria-labelledby="prot-title">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="flex flex-col items-center gap-2 pt-2 text-center">
        <span className="grid h-16 w-16 place-items-center rounded-full bg-teal-600"><ShieldCheck size={36} aria-hidden /></span>
        <h2 id="prot-title" className="text-[22px] font-extrabold uppercase tracking-[0.08em]">{t('protectionTitle')}</h2>
        <p className="text-[22px] font-semibold leading-snug">{t('trustedAlerted')}</p>
        <p className="text-lg leading-snug text-white/80">{t('doNotTransfer')}</p>
      </motion.div>

      <div className="flex items-center gap-3 rounded-2xl bg-white/10 p-3.5">
        <Avatar name="Arjun Sen" size={48} className="!bg-white/15 !text-white" />
        <div className="min-w-0 flex-1">
          <p className="text-xl font-bold">Arjun Sen</p>
          <p className="text-base text-white/80">{t('son')}</p>
        </div>
        <span className="inline-flex items-center gap-1.5 text-base font-semibold" aria-live="polite">
          {connected ? <><CheckCircle2 size={20} className="text-[#6EE7B7]" aria-hidden />{t('connected')}</> : <><Loader2 size={20} className="animate-spin" aria-hidden />{t('connecting')}</>}
        </span>
      </div>

      <div className="text-navy-900"><VoiceWarningCard /></div>

      <div className="mt-auto flex flex-col gap-3 pt-2">
        <Button size="xl" variant="primary" full onClick={() => setCalling(true)}><PhoneCall size={26} aria-hidden />{t('callArjun')}</Button>
        <Button size="xl" variant="ghostDark" full onClick={onDismiss}>{t('iUnderstand')}</Button>
      </div>
      <SimulatedCall open={calling} onClose={() => setCalling(false)} note={t('emergencyDemo')} />
    </div>
  );
}
