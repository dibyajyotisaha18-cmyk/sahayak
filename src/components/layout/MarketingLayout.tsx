import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Logo } from './Logo';
import { LanguageSelector } from './LanguageSelector';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/cn';
import { useT } from '@/i18n/useT';

const LINKS = [
  { to: '/#how', label: 'How it works' }, { to: '/#why', label: 'Why Sahayak' },
  { to: '/architecture', label: 'Architecture' }, { to: '/privacy', label: 'Privacy' },
];

export function MarketingLayout({ dark }: { dark?: boolean }) {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const { t } = useT();
  useEffect(() => setOpen(false), [pathname]);
  const heroDark = pathname === '/' ;
  return (
    <div className="min-h-screen">
      <header className={cn('sticky top-0 z-40 border-b', heroDark || dark ? 'border-white/10 bg-navy-950/95 text-white' : 'border-line bg-white/95')}>
        <div className="mx-auto flex max-w-[1200px] items-center gap-4 px-4 py-3 sm:px-6">
          <Logo dark={heroDark || dark} />
          <nav aria-label="Main" className="ml-6 hidden items-center gap-1 lg:flex">
            {LINKS.map((l) => (
              l.to.startsWith('/#')
                ? <a key={l.to} href={l.to} onClick={(e) => { if (pathname === '/') { e.preventDefault(); document.getElementById(l.to.slice(2))?.scrollIntoView({ behavior: 'smooth' }); } }} className={cn('rounded-lg px-3 py-2 text-sm font-medium focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-600/40', heroDark ? 'text-white/85 hover:bg-white/10' : 'text-slate-600 hover:bg-blue-50')}>{l.label}</a>
                : <NavLink key={l.to} to={l.to} className={({ isActive }) => cn('rounded-lg px-3 py-2 text-sm font-medium focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-600/40', heroDark ? 'text-white/85 hover:bg-white/10' : 'text-slate-600 hover:bg-blue-50', isActive && !heroDark && 'bg-blue-100 text-navy-900')}>{l.label}</NavLink>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <LanguageSelector dark={heroDark || dark} className="hidden lg:inline-flex" />
            <Link to="/demo" className="hidden sm:block"><Button variant="primary">Try live demo</Button></Link>
            <button className={cn('grid h-11 w-11 place-items-center rounded-lg lg:hidden focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-600/40', heroDark ? 'hover:bg-white/10' : 'hover:bg-blue-50')} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen(!open)}>
              {open ? <X size={22} aria-hidden /> : <Menu size={22} aria-hidden />}
            </button>
          </div>
        </div>
        {open && (
          <div className="border-t border-white/10 px-4 pb-4 lg:hidden">
            <ul className="flex flex-col gap-1 pt-2">
              {LINKS.map((l) => <li key={l.to}><a href={l.to} className="block rounded-lg px-3 py-3 font-medium hover:bg-white/10">{l.label}</a></li>)}
            </ul>
            <div className="mt-3 flex items-center gap-2"><LanguageSelector dark={heroDark} /><Link to="/demo" className="flex-1"><Button full>{t('demoMode')}</Button></Link></div>
          </div>
        )}
      </header>
      <Outlet />
      <footer className="border-t border-line bg-white">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <Logo />
            <p className="mt-3 text-sm text-slate-600">Detect manipulation. Verify the risk. Bring the family in. Protect before the payment.</p>
            <p className="mt-3 text-sm font-medium text-navy-900">Hackathon prototype — simulated calls, alerts and payments.</p>
          </div>
          <nav aria-label="Footer" className="grid grid-cols-2 gap-x-10 gap-y-2 text-sm">
            <Link className="text-slate-600 hover:text-navy-900" to="/demo">Live demo</Link>
            <Link className="text-slate-600 hover:text-navy-900" to="/protect">Live protection</Link>
            <Link className="text-slate-600 hover:text-navy-900" to="/parent">Parent view</Link>
            <Link className="text-slate-600 hover:text-navy-900" to="/family">Family view</Link>
            <Link className="text-slate-600 hover:text-navy-900" to="/architecture">Architecture</Link>
            <Link className="text-slate-600 hover:text-navy-900" to="/privacy">Privacy &amp; limitations</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
