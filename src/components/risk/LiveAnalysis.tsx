import { PhoneCall, PhoneIncoming } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { RiskMeter } from './RiskMeter';
import { TranscriptFeed } from './TranscriptFeed';
import { RiskTimeline } from './RiskTimeline';
import { WhyRiskyPanel } from './WhyRiskyPanel';
import { RiskBadge } from './RiskBadge';
import { useAppStore } from '@/store/useAppStore';
import { mmss } from '@/lib/time';
import { cn } from '@/lib/cn';

export function CallerCard() {
  const { call, callClockSec } = useAppStore();
  if (!call) {
    return (
      <Card className="flex items-center gap-3 p-4 text-slate-600">
        <PhoneCall size={20} aria-hidden /><p className="text-sm font-medium">No call in progress. Protection is listening.</p>
      </Card>
    );
  }
  const ringing = call.status === 'RINGING';
  return (
    <Card className="flex flex-wrap items-center gap-3 p-4">
      <span className="grid h-11 w-11 place-items-center rounded-full bg-blue-100 text-navy-700">{ringing ? <PhoneIncoming size={22} aria-hidden /> : <PhoneCall size={22} aria-hidden />}</span>
      <div className="min-w-0 flex-1">
        <p className="truncate font-bold">{call.callerName}</p>
        <p className="tnum text-sm text-slate-600">{call.callerNumberMasked} → Mrs. Sen</p>
      </div>
      <Badge tone="warn">Unknown number</Badge>
      <span className="tnum text-lg font-bold" aria-label="Call timer">{ringing ? 'Ringing…' : mmss(callClockSec)}</span>
    </Card>
  );
}

/** Centre-column analysis: meter, transcript, timeline and reasons. */
export function LiveAnalysis({ layout = 'stack', className }: { layout?: 'stack' | 'wide'; className?: string }) {
  const { call, speed } = useAppStore();
  const score = call?.riskScore ?? 0;
  const level = call?.riskLevel ?? 'LOW';
  return (
    <div className={cn('space-y-4', className)}>
      <CallerCard />
      <div className={cn('grid gap-4', layout === 'wide' && 'lg:grid-cols-[auto_1fr]')}>
        <Card className="flex flex-col items-center gap-3 p-5">
          <div className="flex w-full items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-[0.12em] text-slate-600">Risk score</h3>
            <RiskBadge level={level} size="sm" />
          </div>
          <RiskMeter score={score} level={level} size={layout === 'wide' ? 220 : 190} />
        </Card>
        <Card className="flex min-h-[220px] flex-col">
          <h3 className="px-5 pt-4 text-xs font-bold uppercase tracking-[0.12em] text-slate-600">Live transcript</h3>
          <TranscriptFeed lines={call?.transcript ?? []} speed={speed} callerName={call?.callerName ?? 'Caller'} className="max-h-[300px] flex-1 px-5 py-3" empty={call?.status === 'RINGING' ? 'Ringing… transcript starts when the call is answered.' : 'Start a call to see the live transcript.'} />
        </Card>
      </div>
      <RiskTimeline call={call} />
      <WhyRiskyPanel call={call} />
    </div>
  );
}
