export type Language = 'en' | 'hi' | 'bn';
export type RiskLevel = 'LOW' | 'SUSPICIOUS' | 'HIGH' | 'CRITICAL';

export type SignalCategory =
  | 'IMPERSONATION' | 'ACCUSATION' | 'THREAT' | 'URGENCY' | 'SECRECY'
  | 'FINANCIAL_REQUEST' | 'PAYMENT_REQUEST' | 'OTP_REQUEST' | 'REMOTE_ACCESS'
  | 'SCREEN_SHARING' | 'PERSONAL_INFORMATION' | 'SUSPICIOUS_LINK';

export interface User { id: string; name: string; age: number; preferredLanguage: Language; phone: string; emergencyContacts: string[]; }

export interface TrustedContact {
  id: string; name: string; relationship: string; phone: string;
  role: 'PRIMARY' | 'SECONDARY' | 'EMERGENCY' | 'OTHER';
  priority: number; availability: 'AVAILABLE' | 'BUSY' | 'OFFLINE';
  notificationPreference: 'APP' | 'SMS' | 'CALL';
}

export interface DetectedSignal { category: SignalCategory; label: string; points: number; atSec: number; evidence: string; }

export interface TranscriptLine { id: string; speaker: 'CALLER' | 'USER'; text: string; atSec: number; }

export interface CallSession {
  id: string; callerName: string; callerNumberMasked: string; startTime: string;
  transcript: TranscriptLine[]; riskScore: number; riskLevel: RiskLevel;
  detectedSignals: DetectedSignal[];
  status: 'RINGING' | 'ACTIVE' | 'INTERVENED' | 'ENDED';
}

export interface SafetyEvent { id: string; type: 'CALL_RISK' | 'INTERVENTION' | 'MEDICINE' | 'WELLBEING' | 'PAYMENT_PAUSED'; timestamp: string; severity: 'INFO' | 'WARN' | 'HIGH' | 'CRITICAL'; description: string; resolved: boolean; }

export interface Medication { id: string; name: string; dosage: string; time: string; slot: 'MORNING' | 'AFTERNOON' | 'EVENING'; status: 'TAKEN' | 'UPCOMING' | 'MISSED'; missedCount7d: number; }

export interface WellbeingCheck { id: string; date: string; speedMps: number; }
