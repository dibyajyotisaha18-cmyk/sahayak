import { useState } from 'react';
import { PhoneCall } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { SimulatedCall } from '@/components/parent/SimulatedCall';
import { useAppStore } from '@/store/useAppStore';
import { useT } from '@/i18n/useT';
import { cn } from '@/lib/cn';

export default function ParentFamily() {
  const { t } = useT();
  const contacts = useAppStore((s) => s.contacts);
  const [calling, setCalling] = useState<string | null>(null);
  const avail = { AVAILABLE: ['availableNow', 'bg-safe'], BUSY: ['busy', 'bg-warn'], OFFLINE: ['offline', 'bg-slate-400'] } as const;
  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-4">
      <h1 className="text-[36px] font-extrabold leading-tight">{t('familyCircle')}</h1>
      <ul className="space-y-3">
        {[...contacts].sort((a, b) => a.priority - b.priority).map((c) => (
          <li key={c.id} className="flex items-center gap-4 rounded-2xl border-2 border-line bg-white p-4 shadow-card">
            <Avatar name={c.name} size={64} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[24px] font-bold">{c.name}</p>
              <p className="text-[20px] text-slate-600">{c.relationship}</p>
              <p className="mt-0.5 flex items-center gap-2 text-base text-slate-600"><span className={cn('h-2.5 w-2.5 rounded-full', avail[c.availability][1])} aria-hidden />{t(avail[c.availability][0])}</p>
            </div>
            <Button size="lg" aria-label={`${t('callFamily')} ${c.name}`} onClick={() => setCalling(c.name)} className="!min-h-16"><PhoneCall size={24} aria-hidden />{t('callFamily')}</Button>
          </li>
        ))}
      </ul>
      <p className="text-lg text-slate-600">{t('circleNote')}</p>
      <SimulatedCall open={!!calling} name={calling ?? ''} onClose={() => setCalling(null)} />
    </div>
  );
}
