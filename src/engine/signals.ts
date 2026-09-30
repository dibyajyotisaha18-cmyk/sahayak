import type { SignalCategory } from '@/types/models';

export interface SignalDef {
  category: SignalCategory;
  points: number;
  label: string;
  /** Multilingual patterns (EN / Hinglish / Hindi / Bengali). Data, not logic. */
  patterns: RegExp[];
  /** Apply the negation guard for this category. */
  negatable?: boolean;
}

/** Baseline added when a call from an unknown number starts. */
export const BASELINE_POINTS = 6;
export const BASELINE_LABEL = 'Unknown number, not in contacts';

/** Words that, appearing within 4 words before a match, negate it (negatable categories only). */
export const NEGATION_PATTERNS: RegExp[] = [
  /\bnever\b/iu,
  /\bwill never\b/iu,
  /\bdo not share\b/iu,
  /\bdon'?t share\b/iu,
  /\bkabhi nahi\b/iu,
  /\bkabhi nahin\b/iu,
];

export const SIGNALS: SignalDef[] = [
  {
    category: 'IMPERSONATION', points: 15, label: 'Authority impersonation',
    patterns: [
      /\b(?:calling|speaking|call(?:ing)? you)\s+from\s+(?:the\s+)?(?:central bureau|cbi|police|customs|rbi|reserve bank|income tax|trai|cyber\s*cell|narcotics|bank|enforcement directorate)/iu,
      /\bthis is (?:a|an)?\s*(?:reminder\s+from\s+)?(?:your\s+)?bank\b/iu,
      /\breminder from your bank\b/iu,
      /\b(?:cbi|police|customs|cyber cell|ncb)\s+(?:officer|inspector|department)\b/iu,
      /सीबीआई|पुलिस\s*(?:से|विभाग)|साइबर\s*सेल/u,
      /পুলিশ\s*থেকে|সিবিআই/u,
    ],
  },
  {
    category: 'ACCUSATION', points: 10, label: 'Financial crime accusation',
    patterns: [
      /\bmoney\s+laundering\b/iu, /\billegal\s+parcel\b/iu, /\bdrugs?\s+in\s+your\s+parcel\b/iu,
      /\bcase\s+(?:has\s+been\s+)?registered\b/iu,
      /मनी\s*लॉन्ड्रिंग/u, /মানি\s*লন্ডারিং/u,
    ],
  },
  {
    category: 'THREAT', points: 20, label: 'Arrest / legal threat',
    patterns: [
      /\barrest(?:ed)?\b/iu, /\bwarrant\b/iu, /\bjail\b/iu, /\bgiraftar\b/iu, /\bgrefter\b/iu,
      /गिरफ्तार/u, /গ্রেফতার|গ্রেপ্তার/u,
    ],
  },
  {
    category: 'URGENCY', points: 10, label: 'Pressure to act now',
    patterns: [
      /\bimmediately\b/iu, /\bright\s+now\b/iu, /\bwithin\s+(?:\d+|one|an)\s+hours?\b/iu,
      /\babhi\s+turant\b/iu, /\bturant\b/iu, /\bekhuni\b/iu,
      /तुरंत/u, /এখনই/u,
    ],
  },
  {
    category: 'SECRECY', points: 20, label: 'Isolation / secrecy',
    patterns: [
      /\bdo(?:\s+not|n'?t)\s+tell\s+(?:your\s+)?(?:son|daughter|anyone|family|any\s*one|others?)\b/iu,
      /\bkeep\s+this\s+(?:call\s+)?confidential\b/iu,
      /\bkisi\s+ko\s+mat\s+batana\b/iu, /\bkauke\s+bolben\s+na\b/iu,
      /किसी\s*को\s*मत\s*बताना/u, /কাউকে\s*বলবেন\s*না/u,
    ],
  },
  {
    category: 'FINANCIAL_REQUEST', points: 20, label: 'Asks for financial details',
    patterns: [/\baccount\s+number\b/iu, /\bcard\s+number\b/iu, /\bcvv\b/iu, /\b(?:your|bank)\s+balance\b/iu, /\bkyc\s+update\b/iu],
  },
  {
    category: 'PAYMENT_REQUEST', points: 15, label: 'Asks to move money',
    patterns: [
      /\btransfer\b/iu, /\bsend\s+(?:₹|rs\.?|rupees|\d)/iu, /\bpay\s+now\b/iu, /\bupi\b/iu,
      /\bbitcoin\b/iu, /\bcrypto\b/iu, /\bgift\s*cards?\b/iu, /\bpaise\s+bhejo\b/iu, /\btaka\s+pathan\b/iu, /पैसे\s*भेज/u, /টাকা\s*পাঠা/u,
    ],
  },
  {
    category: 'OTP_REQUEST', points: 25, label: 'Asks for OTP / PIN', negatable: true,
    patterns: [/\botp\b/iu, /\bpin\b/iu, /\bpassword\b/iu],
  },
  {
    category: 'REMOTE_ACCESS', points: 25, label: 'Asks to install remote-access app',
    patterns: [/\banydesk\b/iu, /\bteamviewer\b/iu, /\bquick\s*support\b/iu, /\binstall\s+(?:this|the)\s+app\b/iu],
  },
  {
    category: 'SCREEN_SHARING', points: 20, label: 'Asks to share screen',
    patterns: [/\bshare\s+your\s+screen\b/iu, /\bscreen\s*share\b/iu],
  },
  {
    category: 'PERSONAL_INFORMATION', points: 10, label: 'Asks for personal ID details', negatable: true,
    patterns: [/\b(?:tell|give|share|send|confirm|provide)\b[^.?!]{0,30}\b(?:aadhaar|aadhar)\s+number\b/iu, /\bpan\s+number\b/iu, /\bdate\s+of\s+birth\b/iu],
  },
  {
    category: 'SUSPICIOUS_LINK', points: 15, label: 'Sends a link',
    patterns: [/\bclick\s+(?:on\s+)?the\s+link\b/iu, /\bbit\.ly\b/iu, /https?:\/\//iu],
  },
];

export const SIGNAL_BY_CATEGORY = Object.fromEntries(SIGNALS.map((s) => [s.category, s])) as Record<SignalCategory, SignalDef>;
