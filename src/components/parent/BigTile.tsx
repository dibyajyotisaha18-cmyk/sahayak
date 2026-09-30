import type { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/cn';

interface Props { icon: LucideIcon; label: string; to?: string; onClick?: () => void; tone?: 'default' | 'emergency' }

export function BigTile({ icon: Icon, label, to, onClick, tone = 'default' }: Props) {
  const cls = cn(
    'flex min-h-[132px] flex-col items-center justify-center gap-3 rounded-2xl border-2 bg-white p-4 text-center text-[22px] font-bold leading-tight',
    'shadow-card transition-[transform,box-shadow] duration-150 active:scale-[0.98]',
    'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-600/40',
    tone === 'emergency' ? 'border-critical text-critical' : 'border-line text-navy-900 hover:border-navy-700',
  );
  const inner = (<><Icon size={44} strokeWidth={1.8} aria-hidden />{label}</>);
  return to ? <Link to={to} className={cls}>{inner}</Link> : <button type="button" onClick={onClick} className={cls}>{inner}</button>;
}
