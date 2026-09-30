import { cn } from '@/lib/cn';

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button" role="switch" aria-checked={checked} aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative inline-flex h-8 w-14 shrink-0 items-center rounded-full transition-colors duration-150',
        'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-600/40',
        checked ? 'bg-teal-600' : 'bg-slate-300',
      )}
    >
      <span className={cn('inline-block h-6 w-6 rounded-full bg-white shadow transition-transform duration-150', checked ? 'translate-x-7' : 'translate-x-1')} />
    </button>
  );
}
