import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type {
  CallSession, Language, Medication, SafetyEvent, TrustedContact, User, WellbeingCheck, RiskLevel,
} from '@/types/models';
import { MOCK_CONTACTS, MOCK_EVENTS, MOCK_MEDICATIONS, MOCK_USER, MOCK_WELLBEING } from '@/data/mockData';
import {
  callSource, interventionService, notificationService, paymentGuard, riskService,
} from '@/services';
import { levelFor } from '@/engine/riskEngine';
import { BASELINE_POINTS } from '@/engine/signals';
import type { Scenario } from '@/engine/scenarios';
import { DICTIONARY, EN } from '@/i18n/dictionary';

export type Playback = 'idle' | 'playing' | 'paused' | 'done';
export type Mode = 'demo' | 'protect' | null;
export type PaymentAttempt = 'NONE' | 'PAUSED' | 'CONFIRMING' | 'CANCELLED' | 'CONTINUED';
export type PaymentChoice = 'CALL_SON' | 'VERIFY_FAMILY' | 'CONTINUE_ANYWAY' | 'GO_BACK' | 'CONFIRM_CONTINUE';
export type PaymentOutcome = 'NONE' | 'NORMAL' | 'AFTER_WARNING' | 'CALL_SON' | 'VERIFY_FAMILY';

/** Seconds of ringing before a demo call auto-answers. */
export const RING_SEC = 5;
/** Seconds after CRITICAL before the Intervene button is offered, and its countdown length. */
export const INTERVENE_OFFER_DELAY = 3;
export const INTERVENE_COUNTDOWN = 6;
const PAYMENT_AFTER_INTERVENTION = 6;
const PAYMENT_AUTO_CHOICE = 7;
const CONFIRM_AUTO_BACK = 8;
const COMPLETE_DELAY = 3;
const TICK_MS = 100;

interface Marks {
  critical?: number;
  intervened?: number;
  paymentState?: number; // when paymentAttempt last changed (master clock)
  resolved?: number;
}

interface AppState {
  language: Language;
  user: User;
  contacts: TrustedContact[];
  medications: Medication[];
  wellbeing: WellbeingCheck[];
  events: SafetyEvent[];
  protectionOn: boolean;

  mode: Mode;
  hold: boolean;
  scenario: Scenario | null;
  clock: number; // master seconds since start
  ringSec: number;
  callClockSec: number;
  lineIdx: number;
  call: CallSession | null;
  playback: Playback;
  speed: 1 | 2;
  familyAlert: { active: boolean; level: RiskLevel; sentAt: string; callSec: number } | null;
  intervention: 'NONE' | 'ACTIVE' | 'CONNECTED';
  voiceWarning: { lang: Language; text: string; sentAt: string; id: number } | null;
  paymentAttempt: PaymentAttempt;
  paymentOutcome: PaymentOutcome;
  demoStep: number;
  marks: Marks;
  toasts: { id: number; message: string }[];
  /** Countdown seconds shown to the judge, or null when not applicable. */
  countdown: { kind: 'INTERVENE' | 'PAYMENT'; secondsLeft: number } | null;

  setLanguage: (l: Language) => void;
  setProtection: (on: boolean) => void;
  startCall: (scenarioId: 'A' | 'B', mode?: Exclude<Mode, null>, opts?: { skipTo?: number; hold?: boolean }) => void;
  resetPayment: () => void;
  tick: (dtSec: number) => void;
  pause: () => void;
  resume: () => void;
  setSpeed: (s: 1 | 2) => void;
  nextStep: () => void;
  sendIntervention: () => void;
  sendVoiceWarning: (lang: Language) => void;
  attemptPayment: () => void;
  resolvePayment: (choice: PaymentChoice) => void;
  resetDemo: () => void;
  pushToast: (message: string) => void;
  dismissToast: (id: number) => void;

  addContact: (c: Omit<TrustedContact, 'id' | 'priority'>) => void;
  removeContact: (id: string) => void;
  setContactRole: (id: string, role: TrustedContact['role']) => void;
  moveContact: (id: string, dir: -1 | 1) => void;
  addMedication: (m: Pick<Medication, 'name' | 'dosage' | 'time'>) => void;
  setMedicationStatus: (id: string, status: Medication['status']) => void;
  addEvent: (e: Omit<SafetyEvent, 'id' | 'timestamp'>) => void;
  addWellbeing: (speedMps: number) => void;
}

const safeStorage = {
  getItem: (k: string) => { try { return localStorage.getItem(k); } catch { return null; } },
  setItem: (k: string, v: string) => { try { localStorage.setItem(k, v); } catch { /* storage unavailable */ } },
  removeItem: (k: string) => { try { localStorage.removeItem(k); } catch { /* storage unavailable */ } },
};

let uid = 0;
const nextId = (p: string) => `${p}-${Date.now().toString(36)}-${++uid}`;

const idleCallState = {
  mode: null as Mode,
  hold: false,
  scenario: null as Scenario | null,
  clock: 0,
  ringSec: 0,
  callClockSec: 0,
  lineIdx: 0,
  call: null as CallSession | null,
  playback: 'idle' as Playback,
  familyAlert: null as AppState['familyAlert'],
  intervention: 'NONE' as AppState['intervention'],
  voiceWarning: null as AppState['voiceWarning'],
  paymentAttempt: 'NONE' as PaymentAttempt,
  paymentOutcome: 'NONE' as PaymentOutcome,
  demoStep: 1,
  marks: {} as Marks,
  countdown: null as AppState['countdown'],
};

function voiceWarningText(lang: Language): string {
  return DICTIONARY[lang].voiceWarnMsg ?? EN.voiceWarnMsg;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      language: 'en',
      user: MOCK_USER,
      contacts: MOCK_CONTACTS,
      medications: MOCK_MEDICATIONS,
      wellbeing: MOCK_WELLBEING,
      events: MOCK_EVENTS,
      protectionOn: true,
      ...idleCallState,
      speed: 1,
      toasts: [],

      setLanguage: (language) => {
        set({ language });
        try { document.documentElement.lang = language; } catch { /* no DOM */ }
      },
      setProtection: (protectionOn) => set({ protectionOn }),

      startCall: (scenarioId, mode = 'protect', opts) => {
        const scenario = callSource.load(scenarioId);
        const ringSec = mode === 'demo' ? RING_SEC : 0;
        const call: CallSession = {
          id: nextId('call'),
          callerName: scenario.callerName,
          callerNumberMasked: scenario.callerNumberMasked,
          startTime: new Date().toISOString(),
          transcript: [],
          riskScore: 0,
          riskLevel: 'LOW',
          detectedSignals: [],
          status: ringSec > 0 ? 'RINGING' : 'ACTIVE',
        };
        // Reset any previous run's side effects (events created by earlier demo runs are kept in the log).
        set({
          ...idleCallState,
          events: MOCK_EVENTS,
          mode,
          scenario,
          ringSec,
          clock: 0,
          callClockSec: -ringSec,
          call: ringSec > 0 ? call : { ...call, riskScore: BASELINE_POINTS },
          playback: 'playing',
          demoStep: 1,
          hold: !!opts?.hold,
        });
        if (opts?.skipTo) get().tick(opts.skipTo);
      },

      resetPayment: () => set({ paymentAttempt: 'NONE', paymentOutcome: 'NONE' }),

      tick: (dtSec) => {
        const s = get();
        if (s.playback !== 'playing' || !s.call || !s.scenario) return;
        const dt = dtSec * s.speed;
        const clock = s.clock + dt;
        const callClockSec = clock - s.ringSec;
        let call = s.call;
        const patch: Partial<AppState> = { clock, callClockSec };

        // ringing → active (auto-answer)
        if (call.status === 'RINGING' && callClockSec >= 0) {
          call = { ...call, status: 'ACTIVE', riskScore: BASELINE_POINTS };
        }

        // process scripted lines that are now due
        let lineIdx = s.lineIdx;
        let familyAlert = s.familyAlert;
        let marks = s.marks;
        let events = s.events;
        const toasts = s.toasts;
        let newToast: string | null = null;
        while (call.status !== 'RINGING' && lineIdx < s.scenario.lines.length && s.scenario.lines[lineIdx].atSec <= callClockSec) {
          const src = s.scenario.lines[lineIdx];
          lineIdx++;
          const line = { id: nextId('line'), speaker: src.speaker, text: src.text, atSec: src.atSec };
          const result = riskService.analyze(call, line);
          const prevLevel = call.riskLevel;
          call = {
            ...call,
            transcript: [...call.transcript, line],
            detectedSignals: [...call.detectedSignals, ...result.newSignals],
            riskScore: result.score,
            riskLevel: result.level,
          };
          if (result.level !== prevLevel) {
            const rank = { LOW: 0, SUSPICIOUS: 1, HIGH: 2, CRITICAL: 3 } as const;
            if (rank[result.level] >= 2 && !familyAlert) {
              const { sentAt } = notificationService.notifyFamily(result.level, call.detectedSignals);
              familyAlert = { active: true, level: result.level, sentAt, callSec: src.atSec };
              events = [{
                id: nextId('ev'), type: 'CALL_RISK', timestamp: sentAt, severity: 'HIGH', resolved: false,
                description: `High-risk call detected · Risk ${result.score} · Family alerted`,
              }, ...events];
              newToast = 'High-risk call detected — Mrs. Sen is on the phone';
            } else if (result.level === 'CRITICAL' && familyAlert) {
              familyAlert = { ...familyAlert, level: 'CRITICAL' };
              events = events.map((e, i) => (i === 0 && e.type === 'CALL_RISK' && !e.resolved
                ? { ...e, severity: 'CRITICAL' as const, description: `Critical-risk call · Risk ${result.score} · Awaiting intervention` }
                : e));
              if (marks.critical === undefined) marks = { ...marks, critical: clock };
            }
          }
          if (result.level === 'CRITICAL' && marks.critical === undefined) marks = { ...marks, critical: clock };
        }

        // call end
        if (call.status !== 'RINGING' && callClockSec >= s.scenario.durationSec && s.mode === 'protect' && !s.hold) {
          call = { ...call, status: call.status === 'INTERVENED' ? 'INTERVENED' : 'ENDED' };
          patch.playback = 'done';
        }

        patch.call = call;
        patch.lineIdx = lineIdx;
        patch.familyAlert = familyAlert;
        patch.events = events;
        patch.marks = marks;
        if (newToast) patch.toasts = [...toasts, { id: ++uid, message: newToast }];

        // ---- demo orchestration (post-call steps) ----
        let countdown: AppState['countdown'] = null;
        if (s.mode === 'demo') {
          const critical = marks.critical;
          if (critical !== undefined && s.intervention === 'NONE') {
            const start = critical + INTERVENE_OFFER_DELAY;
            const fire = start + INTERVENE_COUNTDOWN;
            if (clock >= start) countdown = { kind: 'INTERVENE', secondsLeft: Math.max(0, Math.ceil(fire - clock)) };
            if (clock >= fire) {
              set(patch);
              get().sendIntervention();
              return finishTick(get, set);
            }
          }
          if (s.intervention === 'ACTIVE' && marks.intervened !== undefined && clock - marks.intervened >= 3) {
            patch.intervention = 'CONNECTED';
          }
          if (s.intervention !== 'NONE' && marks.intervened !== undefined) {
            if (s.paymentAttempt === 'NONE' && clock - marks.intervened >= PAYMENT_AFTER_INTERVENTION) {
              set(patch);
              get().attemptPayment();
              return finishTick(get, set);
            }
            if (s.paymentAttempt === 'PAUSED' && marks.paymentState !== undefined) {
              const left = Math.ceil(marks.paymentState + PAYMENT_AUTO_CHOICE - clock);
              countdown = { kind: 'PAYMENT', secondsLeft: Math.max(0, left) };
              if (left <= 0) {
                set(patch);
                get().resolvePayment('CALL_SON');
                return finishTick(get, set);
              }
            }
            if (s.paymentAttempt === 'CONFIRMING' && marks.paymentState !== undefined && clock - marks.paymentState >= CONFIRM_AUTO_BACK) {
              set(patch);
              get().resolvePayment('GO_BACK');
              return finishTick(get, set);
            }
            if ((s.paymentAttempt === 'CANCELLED' || s.paymentAttempt === 'CONTINUED') && marks.resolved !== undefined && clock - marks.resolved >= COMPLETE_DELAY) {
              patch.demoStep = 9;
              patch.playback = 'done';
            }
          }
        }
        patch.countdown = countdown;
        set(patch);
        finishTick(get, set);
      },

      pause: () => { if (get().playback === 'playing') set({ playback: 'paused' }); },
      resume: () => { if (get().playback === 'paused') set({ playback: 'playing' }); },
      setSpeed: (speed) => set({ speed }),

      /** Skip ahead to the next demo step boundary. */
      nextStep: () => {
        const s = get();
        if (s.mode !== 'demo' || !s.call || !s.scenario) return;
        if (s.playback === 'done') return;
        const targets = [
          0, // answer
          ...s.scenario.lines.filter((l) => l.speaker === 'CALLER').map((l) => l.atSec),
        ];
        const nextCall = targets.find((t) => t > s.callClockSec + 0.05);
        if (nextCall !== undefined && s.intervention === 'NONE') {
          const wasPaused = s.playback === 'paused';
          if (wasPaused) set({ playback: 'playing' });
          get().tick((nextCall - s.callClockSec + 0.01) / s.speed);
          if (wasPaused) set({ playback: 'paused' });
          return;
        }
        if (s.intervention === 'NONE') { get().sendIntervention(); return; }
        if (s.paymentAttempt === 'NONE') { get().attemptPayment(); return; }
        if (s.paymentAttempt === 'PAUSED') { get().resolvePayment('CALL_SON'); return; }
        if (s.paymentAttempt === 'CONFIRMING') { get().resolvePayment('GO_BACK'); return; }
        set({ demoStep: 9, playback: 'done' });
      },

      sendIntervention: () => {
        const s = get();
        if (!s.call || s.intervention !== 'NONE') return;
        interventionService.activate();
        set({
          intervention: 'ACTIVE',
          call: { ...s.call, status: 'INTERVENED' },
          marks: { ...s.marks, intervened: s.clock },
          countdown: null,
          events: [{
            id: nextId('ev'), type: 'INTERVENTION', timestamp: new Date().toISOString(), severity: 'HIGH', resolved: false,
            description: 'Arjun Sen activated intervention — connecting to Mrs. Sen',
          }, ...s.events],
        });
        get().sendVoiceWarning(s.language);
      },

      sendVoiceWarning: (lang) => {
        set((s) => ({
          voiceWarning: { lang, text: voiceWarningText(lang), sentAt: new Date().toISOString(), id: (s.voiceWarning?.id ?? 0) + 1 },
        }));
      },

      attemptPayment: () => {
        const s = get();
        if (s.paymentAttempt !== 'NONE') return;
        if (paymentGuard.shouldPause(s.call)) {
          set({
            paymentAttempt: 'PAUSED',
            marks: { ...s.marks, paymentState: s.clock },
            demoStep: Math.max(s.demoStep, 8),
            events: [{
              id: nextId('ev'), type: 'PAYMENT_PAUSED', timestamp: new Date().toISOString(), severity: 'CRITICAL', resolved: false,
              description: 'Payment of ₹2,00,000 paused during high-risk call (simulated)',
            }, ...s.events],
          });
        } else {
          set({ paymentAttempt: 'CONTINUED', paymentOutcome: 'NORMAL', marks: { ...s.marks, resolved: s.clock } });
        }
      },

      resolvePayment: (choice) => {
        const s = get();
        const stamp = { paymentState: s.clock };
        const closeEvent = (description: string, resolved: boolean, severity: SafetyEvent['severity']) => [
          { id: nextId('ev'), type: 'PAYMENT_PAUSED' as const, timestamp: new Date().toISOString(), severity, resolved, description },
          ...s.events,
        ];
        switch (choice) {
          case 'CALL_SON':
          case 'VERIFY_FAMILY':
            set({
              paymentAttempt: 'CANCELLED', paymentOutcome: choice, marks: { ...s.marks, ...stamp, resolved: s.clock },
              events: closeEvent(choice === 'CALL_SON' ? 'Mrs. Sen chose to call her son — payment not sent' : 'Mrs. Sen chose to verify with family — payment not sent', true, 'INFO'),
              countdown: null,
            });
            break;
          case 'CONTINUE_ANYWAY':
            set({ paymentAttempt: 'CONFIRMING', marks: { ...s.marks, ...stamp } });
            break;
          case 'GO_BACK':
            set({ paymentAttempt: 'PAUSED', marks: { ...s.marks, ...stamp } });
            break;
          case 'CONFIRM_CONTINUE':
            set({
              paymentAttempt: 'CONTINUED', paymentOutcome: 'AFTER_WARNING', marks: { ...s.marks, ...stamp, resolved: s.clock },
              events: closeEvent('Demo payment recorded — user continued after warning', true, 'WARN'),
              countdown: null,
            });
            break;
        }
      },

      resetDemo: () => {
        set({ ...idleCallState, speed: get().speed, toasts: [] });
        // Drop events created by previous demo runs so a restart is truly clean.
        set({ events: MOCK_EVENTS });
      },

      pushToast: (message) => set((s) => ({ toasts: [...s.toasts, { id: ++uid, message }] })),
      dismissToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),

      addContact: (c) => set((s) => {
        const added: TrustedContact = { ...c, id: nextId('c'), priority: s.contacts.length + 1 };
        const rest = c.role === 'PRIMARY'
          ? s.contacts.map((x) => (x.role === 'PRIMARY' ? { ...x, role: 'SECONDARY' as const } : x))
          : s.contacts;
        return { contacts: [...rest, added] };
      }),
      removeContact: (id) => set((s) => ({
        contacts: s.contacts.filter((c) => c.id !== id).map((c, i) => ({ ...c, priority: i + 1 })),
      })),
      setContactRole: (id, role) => set((s) => ({
        contacts: s.contacts.map((c) => {
          if (c.id === id) return { ...c, role };
          if (role === 'PRIMARY' && c.role === 'PRIMARY') return { ...c, role: 'SECONDARY' as const };
          return c;
        }),
      })),
      moveContact: (id, dir) => set((s) => {
        const list = [...s.contacts].sort((a, b) => a.priority - b.priority);
        const i = list.findIndex((c) => c.id === id);
        const j = i + dir;
        if (i < 0 || j < 0 || j >= list.length) return s;
        [list[i], list[j]] = [list[j], list[i]];
        return { contacts: list.map((c, k) => ({ ...c, priority: k + 1 })) };
      }),
      addMedication: (m) => set((s) => {
        const hourMatch = /(\d{1,2})(?::\d{2})?\s*(AM|PM)/i.exec(m.time);
        let slot: Medication['slot'] = 'MORNING';
        if (hourMatch) {
          let h = Number(hourMatch[1]) % 12;
          if (hourMatch[2].toUpperCase() === 'PM') h += 12;
          slot = h < 12 ? 'MORNING' : h < 17 ? 'AFTERNOON' : 'EVENING';
        }
        return { medications: [...s.medications, { ...m, id: nextId('m'), slot, status: 'UPCOMING', missedCount7d: 0 }] };
      }),
      setMedicationStatus: (id, status) => set((s) => ({
        medications: s.medications.map((m) => (m.id === id
          ? { ...m, status, missedCount7d: status === 'MISSED' ? m.missedCount7d + 1 : m.missedCount7d }
          : m)),
        events: status === 'TAKEN'
          ? [{
            id: nextId('ev'), type: 'MEDICINE', severity: 'INFO', resolved: true, timestamp: new Date().toISOString(),
            description: `${s.medications.find((m) => m.id === id)?.name ?? 'Medicine'} taken`,
          }, ...s.events]
          : s.events,
      })),
      addEvent: (e) => set((s) => ({ events: [{ ...e, id: nextId('ev'), timestamp: new Date().toISOString() }, ...s.events] })),
      addWellbeing: (speedMps) => set((s) => ({
        wellbeing: [...s.wellbeing, { id: nextId('w'), date: `Day ${s.wellbeing.length + 1}`, speedMps }].slice(-8),
      })),
    }),
    {
      name: 'sahayak-prefs',
      storage: createJSONStorage(() => safeStorage),
      partialize: (s) => ({ language: s.language, contacts: s.contacts, medications: s.medications }),
    },
  ),
);

function finishTick(_get: () => AppState, _set: (p: Partial<AppState>) => void) {
  // Step derivation happens here so it is monotonic and driven only by state.
  const s = _get();
  if (s.mode !== 'demo' || !s.call) return;
  let step = 1;
  if (s.callClockSec >= 0) step = 2;
  if (s.call.riskScore > BASELINE_POINTS) step = 3;
  if (levelFor(s.call.riskScore) !== 'LOW') step = 4;
  if (s.familyAlert) step = 5;
  if (s.call.riskLevel === 'CRITICAL') step = 6;
  if (s.intervention !== 'NONE' || (s.marks.critical !== undefined && s.clock - s.marks.critical >= INTERVENE_OFFER_DELAY)) step = 7;
  if (s.paymentAttempt !== 'NONE') step = 8;
  step = Math.max(step, s.demoStep);
  if (step !== s.demoStep) _set({ demoStep: step });
}

/** Single shared interval; safe under React StrictMode because it is module-level and idempotent. */
let timer: ReturnType<typeof setInterval> | null = null;
export function ensureTicker() {
  if (timer) return;
  timer = setInterval(() => useAppStore.getState().tick(TICK_MS / 1000), TICK_MS);
}
export function stopTicker() {
  if (timer) clearInterval(timer);
  timer = null;
}
