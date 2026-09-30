import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { AppBar } from './AppBar';
import { SimBadge } from '@/components/ui/SimBadge';
import { ProtectionOverlay } from '@/components/parent/ProtectionOverlay';
import { useAppStore } from '@/store/useAppStore';
import { useT } from '@/i18n/useT';

/** Live call state surfaced on the standalone parent pages (banner + protection overlay). */
function ParentLiveLayer() {
  const { t } = useT();
  const { call, intervention, mode, marks } = useAppStore();
  const [dismissed, setDismissed] = useState<number | undefined>();
  if (mode === 'demo' || !call) return null;
  const warn = call.riskLevel === 'HIGH' || call.riskLevel === 'CRITICAL';
  return (
    <>
      {warn && (
        <div role="status" className="mb-4 flex items-start gap-3 rounded-2xl border-2 border-teal-600 bg-white p-4 shadow-card">
          <ShieldCheck size={30} className="mt-0.5 shrink-0 text-teal-600" aria-hidden />
          <p className="text-[22px] font-semibold leading-snug">{t('gentleWarning')}</p>
        </div>
      )}
      {intervention !== 'NONE' && dismissed !== marks.intervened && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-navy-950"><div className="mx-auto max-w-xl"><ProtectionOverlay onDismiss={() => setDismissed(marks.intervened)} /></div></div>
      )}
    </>
  );
}

export function ParentLayout() {
  const { t } = useT();
  const { pathname } = useLocation();
  const home = pathname === '/parent';
  return (
    <div className="min-h-screen bg-[#FBFAF7]">
      <AppBar />
      <main className="mx-auto max-w-2xl px-4 pb-16 pt-5 text-[22px]">
        {!home && (
          <Link to="/parent" className="mb-4 inline-flex min-h-16 items-center gap-2 rounded-2xl border-2 border-line bg-white px-5 text-[22px] font-bold shadow-card focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-600/40">
            <ArrowLeft size={28} aria-hidden />{t('back')}
          </Link>
        )}
        <ParentLiveLayer />
        <Outlet />
        <SimBadge className="mt-8 !text-sm" />
      </main>
    </div>
  );
}
