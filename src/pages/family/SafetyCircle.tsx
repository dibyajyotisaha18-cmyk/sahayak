import { useState } from 'react';
import { ArrowDown, ArrowUp, Bell, Plus, Trash2, UserRound } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { useAppStore } from '@/store/useAppStore';
import { cn } from '@/lib/cn';
import type { TrustedContact } from '@/types/models';

const ROLE_LABEL: Record<TrustedContact['role'], string> = { PRIMARY: 'Primary', SECONDARY: 'Secondary', EMERGENCY: 'Emergency', OTHER: 'Other' };
const AVAIL = { AVAILABLE: ['Available', 'bg-safe'], BUSY: ['Busy', 'bg-warn'], OFFLINE: ['Offline', 'bg-slate-400'] } as const;
const NOTIFY = { APP: 'In-app alert', SMS: 'SMS', CALL: 'Phone call' } as const;

export default function SafetyCircle() {
  const { contacts, addContact, removeContact, setContactRole, moveContact } = useAppStore();
  const [adding, setAdding] = useState(false);
  const [removing, setRemoving] = useState<TrustedContact | null>(null);
  const [form, setForm] = useState({ name: '', relationship: '', phone: '', role: 'OTHER' as TrustedContact['role'], notificationPreference: 'APP' as TrustedContact['notificationPreference'] });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const sorted = [...contacts].sort((a, b) => a.priority - b.priority);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (form.name.trim().length < 2) errs.name = 'Enter a name';
    if (!form.relationship.trim()) errs.relationship = 'Enter the relationship';
    if (!/^[+\d\s•-]{6,}$/.test(form.phone.trim())) errs.phone = 'Enter a valid phone number';
    setErrors(errs);
    if (Object.keys(errs).length) return;
    addContact({ name: form.name.trim(), relationship: form.relationship.trim(), phone: form.phone.trim(), role: form.role, availability: 'AVAILABLE', notificationPreference: form.notificationPreference });
    setForm({ name: '', relationship: '', phone: '', role: 'OTHER', notificationPreference: 'APP' });
    setAdding(false);
  };

  const field = 'h-11 w-full rounded-xl border border-line bg-white px-3 text-base focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-600/40';

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold">Safety Circle</h1>
          <p className="text-sm text-slate-600">Mrs. Sen controls who is in her circle.</p>
        </div>
        <Button onClick={() => setAdding(true)}><Plus size={18} aria-hidden />Add contact</Button>
      </div>

      <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {sorted.map((c, i) => (
          <li key={c.id}>
            <Card className="flex h-full flex-col gap-3 p-5">
              <div className="flex items-start gap-3">
                <Avatar name={c.name} size={48} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-lg font-bold">{c.name}</p>
                  <p className="text-sm text-slate-600">{c.relationship}</p>
                </div>
                <Badge tone={c.role === 'PRIMARY' ? 'teal' : c.role === 'EMERGENCY' ? 'high' : 'blue'}>{ROLE_LABEL[c.role]}</Badge>
              </div>
              <dl className="grid grid-cols-2 gap-2 text-sm">
                <div><dt className="text-xs font-semibold uppercase tracking-wider text-slate-600">Availability</dt><dd className="flex items-center gap-1.5 font-semibold"><span className={cn('h-2.5 w-2.5 rounded-full', AVAIL[c.availability][1])} aria-hidden />{AVAIL[c.availability][0]}</dd></div>
                <div><dt className="text-xs font-semibold uppercase tracking-wider text-slate-600">Notify by</dt><dd className="flex items-center gap-1.5 font-semibold"><Bell size={14} aria-hidden />{NOTIFY[c.notificationPreference]}</dd></div>
                <div><dt className="text-xs font-semibold uppercase tracking-wider text-slate-600">Priority</dt><dd className="tnum font-semibold">#{c.priority}</dd></div>
                <div><dt className="text-xs font-semibold uppercase tracking-wider text-slate-600">Phone</dt><dd className="tnum font-semibold">{c.phone}</dd></div>
              </dl>
              <div className="mt-auto flex flex-wrap items-center gap-2 border-t border-line pt-3">
                <label className="sr-only" htmlFor={`role-${c.id}`}>Role for {c.name}</label>
                <select id={`role-${c.id}`} value={c.role} onChange={(e) => setContactRole(c.id, e.target.value as TrustedContact['role'])} className="h-9 rounded-lg border border-line bg-white px-2 text-sm font-medium focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-600/40">
                  {Object.entries(ROLE_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
                <div className="ml-auto flex gap-1">
                  <Button size="sm" variant="outline" aria-label={`Move ${c.name} up in priority`} disabled={i === 0} onClick={() => moveContact(c.id, -1)}><ArrowUp size={16} aria-hidden /></Button>
                  <Button size="sm" variant="outline" aria-label={`Move ${c.name} down in priority`} disabled={i === sorted.length - 1} onClick={() => moveContact(c.id, 1)}><ArrowDown size={16} aria-hidden /></Button>
                  <Button size="sm" variant="outline" aria-label={`Remove ${c.name}`} onClick={() => setRemoving(c)}><Trash2 size={16} aria-hidden /></Button>
                </div>
              </div>
            </Card>
          </li>
        ))}
        {sorted.length === 0 && <li className="text-slate-600">No contacts yet. Add someone Mrs. Sen trusts.</li>}
      </ul>
      <p className="text-xs text-slate-600">Only one contact can be Primary. Making someone Primary moves the previous Primary to Secondary.</p>

      <Modal open={adding} onClose={() => setAdding(false)} title="Add contact">
        <form onSubmit={submit} className="space-y-3 p-6 pt-3" noValidate>
          {([['name', 'Name'], ['relationship', 'Relationship'], ['phone', 'Phone']] as const).map(([k, label]) => (
            <div key={k}>
              <label htmlFor={`f-${k}`} className="mb-1 block text-sm font-semibold">{label}</label>
              <input id={`f-${k}`} className={field} value={form[k]} aria-invalid={!!errors[k]} aria-describedby={errors[k] ? `e-${k}` : undefined} onChange={(e) => setForm({ ...form, [k]: e.target.value })} />
              {errors[k] && <p id={`e-${k}`} className="mt-1 text-sm font-medium text-critical">{errors[k]}</p>}
            </div>
          ))}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="f-role" className="mb-1 block text-sm font-semibold">Role</label>
              <select id="f-role" className={field} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as TrustedContact['role'] })}>
                {Object.entries(ROLE_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="f-notify" className="mb-1 block text-sm font-semibold">Notify by</label>
              <select id="f-notify" className={field} value={form.notificationPreference} onChange={(e) => setForm({ ...form, notificationPreference: e.target.value as TrustedContact['notificationPreference'] })}>
                {Object.entries(NOTIFY).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-2 pt-1">
            <Button type="submit" className="flex-1"><UserRound size={18} aria-hidden />Add to circle</Button>
            <Button type="button" variant="outline" onClick={() => setAdding(false)}>Cancel</Button>
          </div>
        </form>
      </Modal>

      <Modal open={!!removing} onClose={() => setRemoving(null)} title="Remove contact?">
        <div className="space-y-4 p-6 pt-3">
          <p className="pr-8">Remove <strong>{removing?.name}</strong> from Mrs. Sen's safety circle? They will stop receiving alerts.</p>
          <div className="flex gap-2">
            <Button variant="dangerOutline" className="flex-1" onClick={() => { if (removing) removeContact(removing.id); setRemoving(null); }}>Remove</Button>
            <Button variant="outline" onClick={() => setRemoving(null)}>Keep</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
