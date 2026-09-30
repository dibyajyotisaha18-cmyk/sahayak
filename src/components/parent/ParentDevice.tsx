import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { IncomingCallScreen } from './IncomingCallScreen';
import { InCallScreen } from './InCallScreen';
import { ProtectionOverlay } from './ProtectionOverlay';
import { PaymentFlow } from './PaymentFlow';
import { ParentHomeContent } from '@/pages/parent/ParentHome';

/** The parent's whole device as one state-driven screen (used inside the demo phone frame). */
export function ParentDevice() {
  const call = useAppStore((s) => s.call);
  const callClockSec = useAppStore((s) => s.callClockSec);
  const intervention = useAppStore((s) => s.intervention);
  const payment = useAppStore((s) => s.paymentAttempt);
  const [dismissedKey, setDismissedKey] = useState<number | undefined>();
  const key = useAppStore((s) => s.marks.intervened);

  if (payment !== 'NONE') return <PaymentFlow />;
  if (call?.status === 'RINGING') return <IncomingCallScreen call={call} />;
  if (intervention !== 'NONE' && dismissedKey !== key) return <ProtectionOverlay onDismiss={() => setDismissedKey(key)} />;
  if (call) return <InCallScreen call={call} callClockSec={Math.max(0, callClockSec)} />;
  return <ParentHomeContent compact />;
}
