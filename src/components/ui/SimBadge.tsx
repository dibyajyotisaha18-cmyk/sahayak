import { FlaskConical } from 'lucide-react';
import { cn } from '@/lib/cn';
import { useT } from '@/i18n/useT';

export function SimBadge({ className }: { className?: string }) {
  const { t } = useT();
  return (
    <p className={cn('inline-flex items-start gap-2 rounded-lg border border-line bg-white px-3 py-2 text-xs font-medium text-slate-600', className)}>
      <FlaskConical size={14} className="mt-0.5 shrink-0" aria-hidden />
      <span>{t('simulatedNote')}</span>
    </p>
  );
}
