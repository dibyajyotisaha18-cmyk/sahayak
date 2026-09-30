import { describe, expect, it } from 'vitest';
import { analyzeLine, levelFor, scoreText } from './riskEngine';
import { SCENARIO_A, SCENARIO_B } from './scenarios';
import type { DetectedSignal } from '@/types/models';

function replay(lines: typeof SCENARIO_A.lines) {
  const signals: DetectedSignal[] = [];
  const scores: number[] = [];
  for (const line of lines) {
    const r = analyzeLine({ detectedSignals: signals }, line);
    signals.push(...r.newSignals);
    if (line.speaker === 'CALLER') scores.push(r.score);
  }
  return { signals, scores };
}

describe('scenario A — digital arrest scam', () => {
  it('produces the score progression 6 → 21 → 31 → 51 → 71 → 96', () => {
    const { scores } = replay(SCENARIO_A.lines);
    expect([6, ...scores]).toEqual([6, 21, 31, 51, 71, 96]);
  });

  it('detects the expected categories in order', () => {
    const { signals } = replay(SCENARIO_A.lines);
    expect(signals.map((s) => s.category)).toEqual([
      'IMPERSONATION', 'ACCUSATION', 'THREAT', 'SECRECY', 'URGENCY', 'PAYMENT_REQUEST',
    ]);
  });

  it('hits the right levels', () => {
    expect([6, 21, 31, 51, 71, 96].map(levelFor)).toEqual(['LOW', 'LOW', 'SUSPICIOUS', 'SUSPICIOUS', 'HIGH', 'CRITICAL']);
  });
});

describe('scenario B — genuine bank reminder', () => {
  it('stays LOW at 21 (impersonation once, OTP negated, single-indicator cap)', () => {
    const { signals, scores } = replay(SCENARIO_B.lines);
    expect(scores.at(-1)).toBe(21);
    expect(signals.map((s) => s.category)).toEqual(['IMPERSONATION']);
    expect(levelFor(scores.at(-1)!)).toBe('LOW');
  });
});

describe('rules', () => {
  it('counts each category once per call', () => {
    const signals: DetectedSignal[] = [];
    const a = analyzeLine({ detectedSignals: signals }, { speaker: 'CALLER', atSec: 1, text: 'arrest warrant, jail' });
    signals.push(...a.newSignals);
    const b = analyzeLine({ detectedSignals: signals }, { speaker: 'CALLER', atSec: 2, text: 'you will be arrested' });
    expect(a.newSignals).toHaveLength(1);
    expect(b.newSignals).toHaveLength(0);
  });

  it('caps a single indicator at 29 even for a heavy category', () => {
    const r = scoreText('Please tell me the OTP now');
    expect(r.signals.map((s) => s.category)).toContain('OTP_REQUEST');
    expect(r.score).toBeLessThanOrEqual(29);
    expect(r.level).toBe('LOW');
  });

  it('does not score USER lines', () => {
    const r = analyzeLine({ detectedSignals: [] }, { speaker: 'USER', atSec: 3, text: 'arrest warrant OTP' });
    expect(r.newSignals).toHaveLength(0);
  });

  it('negation guard applies to OTP and personal info', () => {
    expect(scoreText('We will never ask for your OTP').signals).toHaveLength(0);
    expect(scoreText('Do not share your PIN with anyone').signals).toHaveLength(0);
    expect(scoreText('Tell me your OTP').signals.map((s) => s.category)).toEqual(['OTP_REQUEST']);
  });

  it('matches Hindi, Bengali and Hinglish patterns', () => {
    expect(scoreText('आपको गिरफ्तार किया जाएगा').signals[0].category).toBe('THREAT');
    expect(scoreText('কাউকে বলবেন না').signals[0].category).toBe('SECRECY');
    expect(scoreText('abhi turant paise bhejo').signals.map((s) => s.category).sort()).toEqual(['PAYMENT_REQUEST', 'URGENCY']);
  });

  it('ranks a multi-signal message as CRITICAL', () => {
    const r = scoreText('Install AnyDesk, share your screen and tell me the OTP immediately. Do not tell anyone.');
    expect(r.level).toBe('CRITICAL');
    expect(r.score).toBeLessThanOrEqual(100);
  });
});
