import { NavLink, useLocation } from 'react-router-dom';
import { PlayCircle } from 'lucide-react';
import { Logo } from './Logo';
import { LanguageSelector } from './LanguageSelector';
import { cn } from '@/lib/cn';
import { useT } from '@/i18n/useT';

export function AppBar() {
  const { t } = useT();
  const { pathname } = useLocation();
  const views = [
    { to: '/parent', label: t('parentView'), active: pathname.startsWith('/parent') },
    { to: '/family', label: t('familyView'), active: pathname.startsWith('/family') },
    { to: '/demo', label: t('demoMode'), active: pathname.startsWith('/demo') },
  ];
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-[1440px] flex-wrap items-center gap-x-4 gap-y-2 px-4 py-2 sm:px-6">
        <Logo />
        <nav aria-label="Switch view" className="order-3 flex w-full rounded-xl border border-line bg-blue-50 p-0.5 sm:order-none sm:ml-2 sm:w-auto">
          {views.map((v) => (
            <NavLink
              key={v.to} to={v.to} aria-current={v.active ? 'page' : undefined}
              className={cn(
                'flex-1 whitespace-nowrap rounded-lg px-3 py-1.5 text-center text-sm font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-600/40 sm:flex-none',
                v.active ? 'bg-navy-900 text-white' : 'text-slate-600 hover:bg-white',
              )}
            >{v.label}</NavLink>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <LanguageSelector />
          <NavLink
            to="/demo"
            className="hidden items-center gap-1.5 rounded-lg bg-teal-600 px-3.5 py-2 text-sm font-bold uppercase tracking-wide text-white transition-colors duration-150 hover:bg-[#096a61] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-600/40 md:inline-flex"
          ><PlayCircle size={16} aria-hidden />Demo mode</NavLink>
        </div>
      </div>
    </header>
  );
}
