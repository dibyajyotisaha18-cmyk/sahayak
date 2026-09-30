import type { Medication, SafetyEvent, TrustedContact, User, WellbeingCheck } from '@/types/models';

export const MOCK_USER: User = {
  id: 'u-ananya',
  name: 'Mrs. Ananya Sen',
  age: 68,
  preferredLanguage: 'bn',
  phone: '+91 ••••• ••310',
  emergencyContacts: ['c-arjun', 'c-mehta'],
};

export const FAMILY_MEMBER = { name: 'Arjun Sen', relationship: 'Son' };

export const MOCK_CONTACTS: TrustedContact[] = [
  { id: 'c-arjun', name: 'Arjun Sen', relationship: 'Son', phone: '+91 ••••• ••204', role: 'PRIMARY', priority: 1, availability: 'AVAILABLE', notificationPreference: 'APP' },
  { id: 'c-priya', name: 'Priya Sen', relationship: 'Daughter', phone: '+91 ••••• ••556', role: 'SECONDARY', priority: 2, availability: 'AVAILABLE', notificationPreference: 'SMS' },
  { id: 'c-mehta', name: 'Dr. Mehta', relationship: 'Family doctor', phone: '+91 ••••• ••871', role: 'EMERGENCY', priority: 3, availability: 'BUSY', notificationPreference: 'CALL' },
];

export const MOCK_MEDICATIONS: Medication[] = [
  { id: 'm-amlodipine', name: 'Amlodipine', dosage: '5 mg', time: '8:00 AM', slot: 'MORNING', status: 'TAKEN', missedCount7d: 0 },
  { id: 'm-vitd', name: 'Vitamin D', dosage: '1 tablet', time: '1:00 PM', slot: 'AFTERNOON', status: 'TAKEN', missedCount7d: 0 },
  { id: 'm-metformin', name: 'Metformin', dosage: '500 mg', time: '8:00 PM', slot: 'EVENING', status: 'UPCOMING', missedCount7d: 1 },
];

function at(hours: number, minutes: number, daysAgo = 0): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(hours, minutes, 0, 0);
  return d.toISOString();
}

export const MOCK_EVENTS: SafetyEvent[] = [
  { id: 'e1', type: 'CALL_RISK', timestamp: at(9, 42), severity: 'CRITICAL', description: 'Suspicious call detected · Risk 96 · Intervention completed', resolved: true },
  { id: 'e2', type: 'MEDICINE', timestamp: at(8, 0), severity: 'INFO', description: 'Morning medicine taken', resolved: true },
  { id: 'e3', type: 'WELLBEING', timestamp: at(18, 30, 1), severity: 'INFO', description: 'Daily wellbeing check completed', resolved: true },
];

export const MOCK_WELLBEING: WellbeingCheck[] = [
  { id: 'w1', date: 'Day 1', speedMps: 0.93 },
  { id: 'w2', date: 'Day 2', speedMps: 0.91 },
  { id: 'w3', date: 'Day 3', speedMps: 0.92 },
  { id: 'w4', date: 'Day 4', speedMps: 0.9 },
  { id: 'w5', date: 'Day 5', speedMps: 0.89 },
  { id: 'w6', date: 'Day 6', speedMps: 0.88 },
  { id: 'w7', date: 'Day 7', speedMps: 0.87 },
  { id: 'w8', date: 'Day 8', speedMps: 0.82 },
];
