import { NavLink, Outlet } from 'react-router-dom';
import { HeartPulse, LayoutDashboard, Users } from 'lucide-react';
import { AppBar } from './AppBar';
import { SimBadge } from '@/components/ui/SimBadge';
import { cn } from '@/lib/cn';

const ITEMS = [
  { to: '/family', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/family/circle', label: 'Safety circle', icon: Users, end: false },
  { to: '/family/wellbeing', label: 'Wellbeing', icon: HeartPulse, end: false },
];

export function FamilyLayout() {
  return (
    <div className="min-h-screen">
      <AppBar />
      <div className="mx-auto flex max-w-[1200px] gap-6 px-4 pb-24 pt-6 sm:px-6 md:pb-10">
        <aside className="hidden w-52 shrink-0 md:block">
          <nav aria-label="Family sections" className="sticky top-20 flex flex-col gap-1">
            {ITEMS.map(({ to, label, icon: Icon, end }) => (
              <NavLink key={to} to={to} end={end} className={({ isActive }) => cn('flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-semibold focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-600/40', isActive ? 'bg-navy-900 text-white' : 'text-slate-600 hover:bg-white')}>
                <Icon size={18} aria-hidden />{label}
              </NavLink>
            ))}
          </nav>
        </aside>
        <main className="min-w-0 flex-1">
          <Outlet />
          <SimBadge className="mt-8" />
        </main>
      </div>
      <nav aria-label="Family sections" className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 border-t border-line bg-white md:hidden">
        {ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end} className={({ isActive }) => cn('flex flex-col items-center gap-1 py-2.5 text-xs font-semibold focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-blue-600/40', isActive ? 'text-teal-600' : 'text-slate-600')}>
            <Icon size={20} aria-hidden />{label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
