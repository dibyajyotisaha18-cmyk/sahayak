import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

export function Card({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('rounded-2xl border border-line bg-white shadow-card', className)} {...rest} />;
}

export function CardHeader({ title, action, className }: { title: React.ReactNode; action?: React.ReactNode; className?: string }) {
  return (
    <div className={cn('flex items-center justify-between gap-3 px-5 pt-4 pb-3', className)}>
      <h3 className="text-xs font-bold uppercase tracking-[0.12em] text-slate-600">{title}</h3>
      {action}
    </div>
  );
}
