import { useNavigate } from 'react-router-dom';
import { Radar } from 'lucide-react';
import { PaymentFlow } from '@/components/parent/PaymentFlow';
import { Button } from '@/components/ui/Button';
import { useAppStore } from '@/store/useAppStore';
import { useT } from '@/i18n/useT';

export default function ParentPay() {
  const { t } = useT();
  const navigate = useNavigate();
  const { call, paymentAttempt, startCall, resetDemo } = useAppStore();
  const risky = !!call && (call.riskLevel === 'HIGH' || call.riskLevel === 'CRITICAL');
  return (
    <div className="mx-auto w-full max-w-xl">
      <h1 className="sr-only">{t('paymentProtection')}</h1>
      <div className="overflow-hidden rounded-3xl border border-line bg-[#FBFAF7] shadow-card"><PaymentFlow onDone={() => navigate('/parent')} /></div>
      {paymentAttempt === 'NONE' && (
        <div className="mt-4 rounded-2xl border border-dashed border-line bg-white p-4 text-base text-slate-600">
          <p><strong className="text-navy-900">Judge tip:</strong> {risky ? 'A simulated high-risk call is active, so Pay now will pause the transaction.' : 'With no risky call, the demo payment simply succeeds — friction only appears when needed.'}</p>
          {!risky ? (
            <Button variant="soft" className="mt-3" onClick={() => startCall('A', 'protect', { skipTo: 73, hold: true })}><Radar size={18} aria-hidden />Simulate a high-risk call first</Button>
          ) : (
            <Button variant="outline" className="mt-3" onClick={resetDemo}>End simulated call</Button>
          )}
        </div>
      )}
    </div>
  );
}
