import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

type Variant = 'primary' | 'navy' | 'outline' | 'ghost' | 'ghostDark' | 'dangerOutline' | 'soft';
type Size = 'sm' | 'md' | 'lg' | 'xl';

const VARIANT: Record<Variant, string> = {
  primary: 'bg-teal-600 text-white hover:bg-[#096a61] shadow-sm',
  navy: 'bg-navy-900 text-white hover:bg-navy-700 shadow-sm',
  outline: 'bg-white text-navy-900 border border-line hover:bg-blue-50',
  ghost: 'bg-transparent text-navy-900 hover:bg-blue-100',
  ghostDark: 'bg-white/5 text-white border border-white/25 hover:bg-white/10',
  dangerOutline: 'bg-white text-critical border-2 border-critical hover:bg-critical-bg',
  soft: 'bg-blue-100 text-navy-900 hover:bg-[#d8e5fa]',
};
const SIZE: Record<Size, string> = {
  sm: 'h-9 px-3 text-sm gap-1.5 rounded-lg',
  md: 'h-11 px-5 text-base gap-2 rounded-xl',
  lg: 'h-14 px-6 text-lg gap-2.5 rounded-xl',
  xl: 'min-h-[72px] px-6 text-[22px] font-semibold gap-3 rounded-xl',
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  full?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', full, className, type = 'button', ...rest }, ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        'inline-flex items-center justify-center font-semibold transition-[background-color,box-shadow,transform] duration-150 active:scale-[0.98]',
        'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-600/40 disabled:opacity-50 disabled:pointer-events-none',
        VARIANT[variant], SIZE[size], full && 'w-full', className,
      )}
      {...rest}
    />
  );
});
