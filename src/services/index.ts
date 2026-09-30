import type { CallSession, DetectedSignal, Language, RiskLevel, SafetyEvent, TranscriptLine } from '@/types/models';
import { analyzeLine, type EngineResult } from '@/engine/riskEngine';
import { SCENARIOS, type Scenario } from '@/engine/scenarios';
import { speak } from '@/voice/speech';

/**
 * Service boundaries. Each has a mock implementation used by default so the demo
 * never depends on the network. A real backend (set VITE_API_BASE_URL) would
 * provide alternative implementations of these same interfaces.
 */

/** Where call audio/transcript comes from. Now: scripted scenarios. Future: on-device / telecom stream. */
export interface CallSource {
  load(scenarioId: 'A' | 'B'): Scenario;
}

/** Scores transcript lines. Now: local rule engine. Future: server / Indic model. */
export interface RiskService {
  analyze(session: Pick<CallSession, 'detectedSignals'>, line: Pick<TranscriptLine, 'speaker' | 'text' | 'atSec'>): EngineResult;
}

/** Delivers alerts to trusted contacts. Now: in-app simulated push. Future: encrypted push/SMS. */
export interface NotificationService {
  notifyFamily(level: RiskLevel, signals: DetectedSignal[]): { sentAt: string };
}

/** Trusted-contact intervention. Now: simulated workflow. Future: telecom-level integration. */
export interface InterventionService {
  activate(): { connectAfterSec: number };
}

/** Decides whether a payment attempt should be paused. */
export interface PaymentGuard {
  shouldPause(call: CallSession | null): boolean;
}

/** Speech output. */
export interface SpeechService {
  speak(text: string, lang: Language): Promise<boolean>;
}

export const callSource: CallSource = { load: (id) => SCENARIOS[id] };
export const riskService: RiskService = { analyze: analyzeLine };
export const notificationService: NotificationService = { notifyFamily: () => ({ sentAt: new Date().toISOString() }) };
export const interventionService: InterventionService = { activate: () => ({ connectAfterSec: 3 }) };
export const paymentGuard: PaymentGuard = {
  shouldPause: (call) => !!call && call.status !== 'ENDED' && (call.riskLevel === 'HIGH' || call.riskLevel === 'CRITICAL'),
};
export const speechService: SpeechService = { speak };

export type { SafetyEvent };
