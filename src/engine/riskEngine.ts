import type { CallSession, DetectedSignal, RiskLevel, SignalCategory, TranscriptLine } from '@/types/models';
import { BASELINE_POINTS, NEGATION_PATTERNS, SIGNALS } from './signals';

export interface EngineResult {
  newSignals: DetectedSignal[];
  score: number;
  level: RiskLevel;
}

export interface EngineSession {
  detectedSignals: DetectedSignal[];
  /** Whether the "unknown number" baseline applies. Defaults to true. */
  baseline?: boolean;
}

/** A single distinct indicator can never lift a call out of LOW. */
export const SINGLE_INDICATOR_CAP = 29;

export function levelFor(score: number): RiskLevel {
  if (score >= 80) return 'CRITICAL';
  if (score >= 60) return 'HIGH';
  if (score >= 30) return 'SUSPICIOUS';
  return 'LOW';
}

/** Total score for a set of detected signals, applying baseline, cap and ceiling. */
export function computeScore(signals: DetectedSignal[], baseline = true): number {
  const distinct = new Set(signals.map((s) => s.category)).size;
  let score = (baseline ? BASELINE_POINTS : 0) + signals.reduce((sum, s) => sum + s.points, 0);
  if (distinct <= 1) score = Math.min(score, SINGLE_INDICATOR_CAP);
  return Math.min(score, 100);
}

const CONNECTORS = new Set(['or', 'and', 'ya', 'aur', 'ba', 'o', 'ki']);
const GUARDED_TERMS = new Set(['otp', 'pin', 'password']);

/** True if a negation phrase sits within 4 words before `index` in the same sentence. */
function isNegated(text: string, index: number): boolean {
  const before = text.slice(0, index);
  const sentence = before.split(/[.!?।]/u).pop() ?? '';
  const words = sentence
    .toLowerCase()
    .split(/[\s,;:]+/u)
    .filter((w) => w && !CONNECTORS.has(w) && !GUARDED_TERMS.has(w.replace(/[^\p{L}\p{N}]/gu, '')));
  const last4 = words.slice(-4).join(' ');
  return NEGATION_PATTERNS.some((re) => re.test(last4));
}

/** Find the first (non-negated) match for each category in `text`. */
function detect(text: string, already: Set<SignalCategory>, atSec: number): DetectedSignal[] {
  const found: DetectedSignal[] = [];
  for (const def of SIGNALS) {
    if (already.has(def.category)) continue;
    let hit: { evidence: string } | null = null;
    for (const pattern of def.patterns) {
      const re = new RegExp(pattern.source, pattern.flags.includes('g') ? pattern.flags : pattern.flags + 'g');
      for (const m of text.matchAll(re)) {
        if (def.negatable && isNegated(text, m.index ?? 0)) continue;
        hit = { evidence: m[0].trim() };
        break;
      }
      if (hit) break;
    }
    if (hit) found.push({ category: def.category, label: def.label, points: def.points, atSec, evidence: hit.evidence });
  }
  return found;
}

/** Analyse one transcript line against the session so far. Only CALLER lines are scored. */
export function analyzeLine(session: EngineSession, line: Pick<TranscriptLine, 'speaker' | 'text' | 'atSec'>): EngineResult {
  const baseline = session.baseline ?? true;
  if (line.speaker !== 'CALLER') {
    const score = computeScore(session.detectedSignals, baseline);
    return { newSignals: [], score, level: levelFor(score) };
  }
  const already = new Set(session.detectedSignals.map((s) => s.category));
  const newSignals = detect(line.text, already, line.atSec);
  const score = computeScore([...session.detectedSignals, ...newSignals], baseline);
  return { newSignals, score, level: levelFor(score) };
}

export interface TextResult extends EngineResult {
  signals: DetectedSignal[];
  distinct: number;
  capped: boolean;
}

/** Score arbitrary text (used by the sandbox). No unknown-number baseline. */
export function scoreText(text: string): TextResult {
  const signals = detect(text, new Set(), 0);
  const distinct = new Set(signals.map((s) => s.category)).size;
  const raw = signals.reduce((sum, s) => sum + s.points, 0);
  const score = computeScore(signals, false);
  return { newSignals: signals, signals, score, level: levelFor(score), distinct, capped: distinct <= 1 && raw > SINGLE_INDICATOR_CAP };
}

export function emptySession(): Pick<CallSession, 'detectedSignals'> {
  return { detectedSignals: [] };
}
