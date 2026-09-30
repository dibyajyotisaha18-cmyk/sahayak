import { cn } from '@/lib/cn';

export interface TabItem<T extends string> { id: T; label: string; icon?: React.ReactNode }

export function Tabs<T extends string>({ items, value, onChange, label, className }: {
  items: TabItem<T>[]; value: T; onChange: (v: T) => void; label: string; className?: string;
}) {
  return (
    <div role="tablist" aria-label={label} className={cn('inline-flex rounded-xl border border-line bg-white p-1', className)}>
      {items.map((it) => (
        <button
          key={it.id} role="tab" aria-selected={value === it.id} onClick={() => onChange(it.id)}
          className={cn(
            'inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors duration-150',
            'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-600/40',
            value === it.id ? 'bg-navy-900 text-white' : 'text-slate-600 hover:bg-blue-50',
          )}
        >
          {it.icon}{it.label}
        </button>
      ))}
    </div>
  );
}
