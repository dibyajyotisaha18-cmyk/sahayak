import { AnimatePresence, motion } from 'motion/react';
import { CheckCircle2, HelpCircle } from 'lucide-react';
import { Card, CardHeader } from '@/components/ui/Card';
import { EASE } from '@/lib/risk';
import type { CallSession, SignalCategory } from '@/types/models';

const TEXT: Record<SignalCategory, string> = {
  IMPERSONATION: 'Caller impersonates an authority',
  ACCUSATION: 'Accuses you of a financial crime',
  THREAT: 'Uses fear of arrest',
  URGENCY: 'Creates urgency',
  SECRECY: 'Tells the user to hide the conversation',
  FINANCIAL_REQUEST: 'Asks for bank or card details',
  PAYMENT_REQUEST: 'Requests a payment',
  OTP_REQUEST: 'Asks for an OTP or PIN',
  REMOTE_ACCESS: 'Asks you to install a remote-access app',
  SCREEN_SHARING: 'Asks you to share your screen',
  PERSONAL_INFORMATION: 'Asks for personal ID details',
  SUSPICIOUS_LINK: 'Sends a link to click',
};

const ORDER: SignalCategory[] = ['IMPERSONATION', 'ACCUSATION', 'THREAT', 'URGENCY', 'SECRECY', 'FINANCIAL_REQUEST', 'PAYMENT_REQUEST', 'OTP_REQUEST', 'REMOTE_ACCESS', 'SCREEN_SHARING', 'PERSONAL_INFORMATION', 'SUSPICIOUS_LINK'];

export function WhyRiskyPanel({ call, className }: { call: CallSession | null; className?: string }) {
  const found = new Set(call?.detectedSignals.map((s) => s.category));
  const largeAmount = !!call?.transcript.some((l) => l.speaker === 'CALLER' && /₹\s?[\d,]{6,}|lakh/iu.test(l.text));
  const items = ORDER.filter((c) => found.has(c));
  return (
    <Card className={className}>
      <CardHeader title={<span className="inline-flex items-center gap-2"><HelpCircle size={14} aria-hidden />Why is this call risky?</span>} />
      <ul className="space-y-2 px-5 pb-3" aria-live="polite">
        {items.length === 0 && <li className="text-sm text-slate-600">No warning signals so far.</li>}
        <AnimatePresence initial={false}>
          {items.map((c) => (
            <motion.li key={c} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.28, ease: EASE }} className="flex items-center gap-2.5 text-[15px] font-medium">
              <CheckCircle2 size={18} className="shrink-0 text-teal-600" aria-hidden />
              {c === 'PAYMENT_REQUEST' && largeAmount ? 'Requests a large payment' : TEXT[c]}
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
      <p className="border-t border-line px-5 py-3 text-xs text-slate-600">These signals commonly appear in social-engineering and impersonation scams.</p>
    </Card>
  );
}
