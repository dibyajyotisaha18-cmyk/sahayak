import { useState } from 'react';
import { AlarmClock, Check, CheckCircle2, CircleAlert, Clock, Pill, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { useAppStore } from '@/store/useAppStore';
import { useT } from '@/i18n/useT';
import type { Medication } from '@/types/models';

const SLOTS = [['MORNING', 'morning'], ['AFTERNOON', 'afternoon'], ['EVENING', 'evening']] as const;

function StatusBadge({ status }: { status: Medication['status'] }) {
  const { t } = useT();
  if (status === 'TAKEN') return <Badge tone="safe" className="!text-base !px-3 !py-1.5"><CheckCircle2 size={16} aria-hidden />{t('taken')}</Badge>;
  if (status === 'MISSED') return <Badge tone="warn" className="!text-base !px-3 !py-1.5"><CircleAlert size={16} aria-hidden />{t('missed')}</Badge>;
  return <Badge tone="blue" className="!text-base !px-3 !py-1.5"><Clock size={16} aria-hidden />{t('upcoming')}</Badge>;
}

export default function Medicines() {
  const { t } = useT();
  const { medications, setMedicationStatus, addMedication, pushToast, addEvent } = useAppStore();
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ name: '', dosage: '', time: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [notified, setNotified] = useState(false);
  const needsFamily = medications.some((m) => m.missedCount7d >= 2);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Enter the medicine name';
    if (!form.dosage.trim()) errs.dosage = 'Enter the dosage';
    if (!/^\d{1,2}(:\d{2})?\s*(am|pm)$/i.test(form.time.trim())) errs.time = 'Use a time like 9:00 AM';
    setErrors(errs);
    if (Object.keys(errs).length) return;
    const time = form.time.trim().toUpperCase().replace(/^(\d{1,2})\s*(AM|PM)$/, '$1:00 $2').replace(/\s*(AM|PM)$/, ' $1');
    addMedication({ name: form.name.trim(), dosage: form.dosage.trim(), time });
    setForm({ name: '', dosage: '', time: '' });
    setAdding(false);
  };

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-5">
      <h1 className="text-[36px] font-extrabold leading-tight">{t('medicines')}</h1>

      {needsFamily && (
        <div role="status" className="rounded-2xl border-2 border-warn bg-warn-bg p-4">
          <p className="flex items-center gap-2 text-[22px] font-bold text-warn"><CircleAlert size={26} aria-hidden />{t('familyNotifyRec')}</p>
          <Button
            size="lg" variant="navy" className="mt-3" disabled={notified}
            onClick={() => { setNotified(true); pushToast('Arjun notified about missed medicines (simulated)'); addEvent({ type: 'MEDICINE', severity: 'WARN', resolved: false, description: 'Medicine missed twice this week — family notified (simulated)' }); }}
          >
            {notified ? t('arjunNotified') : t('notifyArjun')}
          </Button>
        </div>
      )}

      {SLOTS.map(([slot, key]) => {
        const items = medications.filter((m) => m.slot === slot);
        if (!items.length) return null;
        return (
          <section key={slot} aria-labelledby={`slot-${slot}`} className="space-y-3">
            <h2 id={`slot-${slot}`} className="text-[26px] font-bold">{t(key)}</h2>
            {items.map((m) => (
              <article key={m.id} className="rounded-2xl border-2 border-line bg-white p-4 shadow-card">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="flex items-center gap-2 text-[24px] font-bold"><Pill size={24} className="text-teal-600" aria-hidden />{m.name}</p>
                    <p className="tnum mt-1 text-[20px] text-slate-600">{m.dosage} · {m.time}</p>
                    {m.missedCount7d > 0 && <p className="tnum mt-1 text-base text-warn">{m.missedCount7d}× {t('missedThisWeek')}</p>}
                  </div>
                  <StatusBadge status={m.status} />
                </div>
                <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <Button size="lg" variant="primary" disabled={m.status === 'TAKEN'} onClick={() => setMedicationStatus(m.id, 'TAKEN')}><Check size={22} aria-hidden />{t('markTaken')}</Button>
                  <Button size="lg" variant="outline" disabled={m.status === 'MISSED'} onClick={() => setMedicationStatus(m.id, 'MISSED')}><X size={22} aria-hidden />{t('markMissed')}</Button>
                </div>
                <Button size="lg" variant="ghost" className="mt-2" onClick={() => pushToast(`${t('reminderSet')}: ${m.name} · ${m.time}`)}><AlarmClock size={22} aria-hidden />{t('setReminder')}</Button>
              </article>
            ))}
          </section>
        );
      })}

      <Button size="xl" full variant="navy" onClick={() => setAdding(true)}><Plus size={26} aria-hidden />{t('addMedicine')}</Button>
      <p className="text-base text-slate-600">{t('medNote')}</p>

      <Modal open={adding} onClose={() => setAdding(false)} title={t('addMedicine')}>
        <form onSubmit={submit} className="space-y-4 p-6 pt-2" noValidate>
          {([['name', t('medName'), 'Amlodipine'], ['dosage', t('medDosage'), '5 mg'], ['time', t('medTime'), '9:00 AM']] as const).map(([k, label, ph]) => (
            <div key={k}>
              <label htmlFor={`med-${k}`} className="mb-1 block text-lg font-semibold">{label}</label>
              <input
                id={`med-${k}`} value={form[k]} placeholder={ph} aria-invalid={!!errors[k]} aria-describedby={errors[k] ? `err-${k}` : undefined}
                onChange={(e) => setForm({ ...form, [k]: e.target.value })}
                className="h-14 w-full rounded-xl border-2 border-line px-4 text-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-600/40"
              />
              {errors[k] && <p id={`err-${k}`} className="mt-1 text-base font-medium text-critical">{errors[k]}</p>}
            </div>
          ))}
          <div className="flex gap-3">
            <Button type="submit" size="lg" className="flex-1">{t('add')}</Button>
            <Button type="button" size="lg" variant="outline" onClick={() => setAdding(false)}>{t('cancel')}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
