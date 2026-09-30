import { cn } from '@/lib/cn';
import { ScopeContext } from '@/lib/scope';

/** A device frame. On small screens (`bare`) it drops the chrome and renders full-bleed. */
export function PhoneFrame({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <figure className={cn('mx-auto flex flex-col items-center', className)}>
      <figcaption className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-slate-600">{label}</figcaption>
      <div className="relative w-full max-w-[380px] rounded-[2.5rem] bg-navy-950 p-2.5 shadow-modal lg:w-[330px] 2xl:w-[360px]">
        <div className="absolute left-1/2 top-3.5 z-20 h-5 w-24 -translate-x-1/2 rounded-full bg-navy-950" aria-hidden />
        <div className="relative isolate h-[640px] overflow-hidden rounded-[2rem] bg-[#FBFAF7] 2xl:h-[680px]">
          <ScopeContext.Provider value="local"><div className="h-full overflow-y-auto pt-8" tabIndex={0} role="region" aria-label={label}>{children}</div></ScopeContext.Provider>
        </div>
      </div>
    </figure>
  );
}
