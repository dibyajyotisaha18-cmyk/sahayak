import { LEVEL } from '@/lib/risk';
import { cn } from '@/lib/cn';
import type { RiskLevel } from '@/types/models';

export function RiskBadge({ level, label, size = 'md', className }: { level: RiskLevel; label?: string; size?: 'sm' | 'md' | 'lg'; className?: string }) {
  const s = LEVEL[level];
  const Icon = s.icon;
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border font-bold uppercase tracking-wide transition-colors duration-300',
        s.bg, s.fg, s.border,
        size === 'sm' && 'px-2 py-1 text-[11px]', size === 'md' && 'px-3 py-1.5 text-xs', size === 'lg' && 'px-4 py-2 text-base',
        className,
      )}
    >
      <Icon size={size === 'lg' ? 20 : 14} aria-hidden />
      {label ?? s.label}
    </span>
  );
}
