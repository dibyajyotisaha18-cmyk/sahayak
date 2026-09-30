import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/cn';

export function Logo({ dark, className }: { dark?: boolean; className?: string }) {
  return (
    <Link to="/" className={cn('inline-flex items-center gap-2 rounded-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-600/40', className)} aria-label="Sahayak home">
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-teal-600 text-white"><ShieldCheck size={20} aria-hidden /></span>
      <span className={cn('text-lg font-extrabold tracking-[0.14em]', dark ? 'text-white' : 'text-navy-950')}>SAHAYAK</span>
    </Link>
  );
}
