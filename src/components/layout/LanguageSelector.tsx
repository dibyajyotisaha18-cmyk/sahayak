import { Languages } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { cn } from '@/lib/cn';
import { useT } from '@/i18n/useT';
import type { Language } from '@/types/models';

const OPTIONS: { id: Language; label: string; name: string }[] = [
  { id: 'en', label: 'EN', name: 'English' }, { id: 'hi', label: 'हिन्दी', name: 'हिन्दी' }, { id: 'bn', label: 'বাংলা', name: 'বাংলা' },
];

export function LanguageSelector({ dark, className }: { dark?: boolean; className?: string }) {
  const { language, setLanguage } = useAppStore();
  const { t } = useT();
  return (
    <div role="radiogroup" aria-label={t('language')} className={cn('inline-flex items-center rounded-lg border p-0.5', dark ? 'border-white/25' : 'border-line bg-white', className)}>
      <Languages size={14} className={cn('mx-1.5 hidden sm:block', dark ? 'text-white/70' : 'text-slate-600')} aria-hidden />
      {OPTIONS.map((o) => (
        <button
          key={o.id} role="radio" aria-checked={language === o.id} aria-label={o.name} lang={o.id} onClick={() => setLanguage(o.id)}
          className={cn(
            'rounded-md px-2.5 py-1.5 text-sm font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-600/40',
            language === o.id ? (dark ? 'bg-white text-navy-950' : 'bg-navy-900 text-white') : dark ? 'text-white/80 hover:bg-white/10' : 'text-slate-600 hover:bg-blue-50',
          )}
        >{o.label}</button>
      ))}
    </div>
  );
}
