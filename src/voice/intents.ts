export type Intent =
  | { type: 'REMIND'; time: string }
  | { type: 'CALL_SON' }
  | { type: 'SAFE' }
  | { type: 'HELP' }
  | { type: 'MEDS' }
  | { type: 'FAMILY' }
  | { type: 'GREET' }
  | { type: 'UNKNOWN' };

const u = 'iu';
const has = (text: string, patterns: RegExp[]) => patterns.some((p) => p.test(text));

const REMIND = [new RegExp('remind|yaad\\s*dila|yaad\\s*dena|याद\\s*दिला|মনে\\s*করিয়ে|মনে\\s*করাও', u)];
const CALL_SON = [new RegExp('\\bcall\\s+(?:my\\s+)?(?:son|arjun)\\b|\\b(?:beta|bete|son)\\s+ko\\s+(?:phone|call|fon)|\\barjun\\s+ko\\b|ছেলেকে\\s*(?:ফোন|কল)|আমার\\s*ছেলে|बेटे\\s*को|बेटा\\s*को|chele(?:ke|r)\\s+(?:phone|fon|call)|ছেলের', u)];
const MEDS = [new RegExp('(?:show|dikhao|dikha|dekhao|open).{0,20}(?:medicine|dawai|dawa|osudh|oshudh|ওষুধ|दवा)|(?:medicine|ওষুধ|दवाइयाँ|दवाई).{0,15}(?:show|dikhao|দেখাও|दिखाओ)|আমার\\s*ওষুধ|मेरी\\s*दवा|my\\s+medicines?', u)];
const FAMILY = [new RegExp('family\\s+circle|who\\s+is\\s+in\\s+my\\s+family|parivar\\s+mein\\s+kaun|poribar(?:e)?\\s+ke|পরিবারে\\s*কে|परिवार\\s*में\\s*कौन', u)];
const SAFE = [new RegExp('\\bam\\s+i\\s+safe\\b|\\bsurakshit\\b|\\bnirapod\\b|\\bnirapad\\b|নিরাপদ|सुरक्षित', u)];
const HELP = [new RegExp('i\\s+need\\s+help|help\\s+me|\\bemergency\\b|mujhe\\s+madad|\\bmadad\\b|\\bsahajyo\\b|\\bbachao\\b|সাহায্য|মদদ|मदद|बचाओ|জরুরি', u)];
const GREET = [new RegExp('amar\\s+sathe\\s+kotha\\s+bolo|আমার\\s*সাথে\\s*কথা\\s*বলো|\\bhello\\b|\\bnamaste\\b|\\bnomoskar\\b|নমস্কার', u)];

/** Extract "8 PM" / "8:30 pm" / "raat 8 baje" as a display time. Defaults to 8:00 PM. */
function extractTime(text: string): string {
  const m = /(\d{1,2})(?::(\d{2}))?\s*(am|pm|baje|bje|টা|बजे)?/iu.exec(text);
  if (!m) return '8:00 PM';
  const hour = Number(m[1]);
  if (hour < 1 || hour > 12) return '8:00 PM';
  const mins = m[2] ?? '00';
  let suffix = (m[3] ?? '').toUpperCase();
  if (suffix !== 'AM' && suffix !== 'PM') suffix = /raat|রাত|रात|evening|sham|shondhya|शाम|সন্ধ্যা|night/iu.test(text) ? 'PM' : /subah|সকাল|सुबह|morning/iu.test(text) ? 'AM' : 'PM';
  return `${hour}:${mins} ${suffix}`;
}

export function parseIntent(raw: string): Intent {
  const text = raw.trim();
  if (!text) return { type: 'UNKNOWN' };
  if (has(text, REMIND)) return { type: 'REMIND', time: extractTime(text) };
  if (has(text, CALL_SON)) return { type: 'CALL_SON' };
  if (has(text, MEDS)) return { type: 'MEDS' };
  if (has(text, FAMILY)) return { type: 'FAMILY' };
  if (has(text, SAFE)) return { type: 'SAFE' };
  if (has(text, HELP)) return { type: 'HELP' };
  if (has(text, GREET)) return { type: 'GREET' };
  return { type: 'UNKNOWN' };
}
