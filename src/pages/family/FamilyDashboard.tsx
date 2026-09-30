import { HeartPulse, Pill, PhoneIncoming, ShieldCheck, Users } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Stat } from '@/components/ui/Stat';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { AlertCard } from '@/components/family/AlertCard';
import { EventsTimeline } from '@/components/family/EventsTimeline';
import { useAppStore } from '@/store/useAppStore';
import { useT } from '@/i18n/useT';
import { cn } from '@/lib/cn';

export function StatusPill() {
  const { t } = useT();
  const call = useAppStore((s) => s.call);
  const alert = useAppStore((s) => s.familyAlert);
  const live = !!call && call.status !== 'ENDED' && call.status !== 'RINGING';
  if (alert && live) return <Badge tone="critical" role="status"><PhoneIncoming size={14} aria-hidden />{t('statusHighRisk')}</Badge>;
  if (live) return <Badge tone="warn" role="status"><ShieldCheck size={14} aria-hidden />{t('statusMonitoring')}</Badge>;
  return <Badge tone="safe" role="status"><ShieldCheck size={14} aria-hidden />{t('statusSafe')}</Badge>;
}

export function FamilyDashboardContent({ compact }: { compact?: boolean }) {
  const { t } = useT();
  const { medications, contacts } = useAppStore();
  const taken = medications.filter((m) => m.status === 'TAKEN').length;
  const due = medications.filter((m) => m.status !== 'UPCOMING').length;
  return (
    <div className={cn('space-y-4', compact && 'p-4')}>
      <div>
        {compact
          ? <h2 className="text-lg font-extrabold">SAHAYAK · Family Safety Dashboard</h2>
          : <h1 className="text-2xl font-extrabold">SAHAYAK · Family Safety Dashboard</h1>}
        <p className="text-sm text-slate-600">Signed in as Arjun Sen (mock)</p>
      </div>

      <Card className="flex flex-wrap items-center gap-4 p-5">
        <Avatar name="Ananya Sen" size={52} />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-600">Mother</p>
          <p className="text-lg font-bold">Mrs. Ananya Sen</p>
        </div>
        <StatusPill />
      </Card>

      <AlertCard compact={compact} />

      <div className={cn('grid gap-3', compact ? 'grid-cols-2' : 'grid-cols-2 lg:grid-cols-4')}>
        <Stat icon={ShieldCheck} label={t('callProtection')} value="Active" />
        <Stat icon={Pill} label="Today's medication" value={`${taken} / ${due}`} hint="doses due so far" />
        <Stat icon={HeartPulse} label="Wellbeing" value="Stable" hint="Walking check: monitor" />
        <Stat icon={Users} label={t('family')} value={`${contacts.length} trusted`} hint="contacts" />
      </div>

      <EventsTimeline limit={compact ? 4 : undefined} />
    </div>
  );
}

export default function FamilyDashboard() {
  return <FamilyDashboardContent />;
}
