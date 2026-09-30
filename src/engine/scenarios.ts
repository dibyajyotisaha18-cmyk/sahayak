export interface ScenarioLine { speaker: 'CALLER' | 'USER'; text: string; atSec: number; }
export interface Scenario {
  id: 'A' | 'B';
  title: string;
  callerName: string;
  callerNumberMasked: string;
  durationSec: number;
  note?: string;
  lines: ScenarioLine[];
}

export const SCENARIO_A: Scenario = {
  id: 'A',
  title: 'Digital arrest scam',
  callerName: 'CBI Officer',
  callerNumberMasked: '+91 ••••• ••742',
  durationSec: 76,
  lines: [
    { speaker: 'CALLER', atSec: 12, text: 'Hello Mrs. Sen, I am calling from the Central Bureau of Investigation.' },
    { speaker: 'USER', atSec: 20, text: 'Yes? What is this about?' },
    { speaker: 'CALLER', atSec: 28, text: 'Your Aadhaar has been linked to a money laundering case.' },
    { speaker: 'USER', atSec: 35, text: "Money laundering? I don't understand…" },
    { speaker: 'CALLER', atSec: 41, text: 'There is an arrest warrant against you.' },
    { speaker: 'USER', atSec: 48, text: 'Arrest? But I have done nothing wrong.' },
    { speaker: 'CALLER', atSec: 55, text: 'Do not tell your son or anyone else about this.' },
    { speaker: 'USER', atSec: 63, text: 'Please… what should I do?' },
    { speaker: 'CALLER', atSec: 72, text: 'You need to transfer ₹2,00,000 immediately to verify your account.' },
  ],
};

export const SCENARIO_B: Scenario = {
  id: 'B',
  title: 'Genuine bank reminder',
  callerName: 'Bank Reminder',
  callerNumberMasked: '+91 ••••• ••118',
  durationSec: 30,
  note: 'Mentions a bank, but no pressure, secrecy or payment request — stays low.',
  lines: [
    { speaker: 'CALLER', atSec: 6, text: 'Hello, this is a reminder from your bank. Your credit card bill is due on the 5th. Please note, we will never ask for your OTP or PIN.' },
    { speaker: 'USER', atSec: 18, text: 'Thank you, I will pay it this week.' },
  ],
};

export const SCENARIOS = { A: SCENARIO_A, B: SCENARIO_B } as const;
