import { cn } from '@/lib/cn';

export function Avatar({ name, size = 40, className }: { name: string; size?: number; className?: string }) {
  const initials = name.replace(/^(Mrs?\.|Dr\.)\s*/, '').split(' ').map((p) => p[0]).slice(0, 2).join('');
  return (
    <span
      aria-hidden
      style={{ width: size, height: size, fontSize: size * 0.38 }}
      className={cn('inline-grid shrink-0 place-items-center rounded-full bg-blue-100 font-bold text-navy-700', className)}
    >
      {initials}
    </span>
  );
}
