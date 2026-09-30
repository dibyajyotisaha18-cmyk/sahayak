import { useCallback, useEffect, useState } from 'react';
import { Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAppStore } from '@/store/useAppStore';
import { useT } from '@/i18n/useT';
import { speak, stopSpeaking } from '@/voice/speech';
import { DICTIONARY } from '@/i18n/dictionary';

export function VoiceWarningCard() {
  const warning = useAppStore((s) => s.voiceWarning);
  const { t } = useT();
  const [voiceOk, setVoiceOk] = useState<boolean | null>(null);

  const play = useCallback(async () => {
    if (!warning) return;
    setVoiceOk(await speak(warning.text, warning.lang));
  }, [warning]);

  useEffect(() => {
    void play();
    return () => stopSpeaking();
  }, [play]);

  if (!warning) return null;
  const roman = warning.lang === 'bn' ? DICTIONARY.bn.voiceWarnRoman : null;
  return (
    <section aria-label={t('trustedMessage')} className="rounded-2xl border-2 border-navy-700 bg-white p-4 shadow-card">
      <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.1em] text-navy-700">
        <Volume2 size={20} aria-hidden />{t('trustedMessage')}
      </div>
      <p className="mt-1 text-base text-slate-600">{t('fromArjun')}</p>
      <p lang={warning.lang} className="mt-3 text-[24px] font-semibold leading-snug">{warning.text}</p>
      {roman && <p className="mt-1 text-base italic text-slate-600">{roman}</p>}
      {voiceOk === false && <p className="mt-2 text-sm text-slate-600">{t('voiceNA')}</p>}
      <Button variant="soft" size="lg" className="mt-3" onClick={() => void play()}><Volume2 size={22} aria-hidden />{t('replay')}</Button>
    </section>
  );
}
