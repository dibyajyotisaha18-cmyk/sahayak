# Sahayak — frontend prototype

**The family-powered live scam shield for elderly Indians.** Detect → Verify → Intervene → Protect.

Runs fully standalone: no API keys, no backend, no network. All scam detection is a deterministic rule engine in TypeScript.

> Prototype simulation — no real calls, payments or banking apps are accessed.

## Setup

```bash
npm install
npm run dev      # http://localhost:5173
npm test         # vitest: risk-engine tests
npm run build    # type-check + production build
```

## Routes

| Route | Page |
|---|---|
| `/` | Landing |
| `/demo` | Guided Demo Mode (parent phone · live analysis · family phone) |
| `/protect` | Live Protection simulator + sentence sandbox |
| `/parent`, `/parent/talk`, `/parent/medicines`, `/parent/family`, `/parent/pay` | Elderly-first screens for Mrs. Sen |
| `/family`, `/family/circle`, `/family/wellbeing` | Family dashboard for Arjun |
| `/architecture`, `/privacy` | Architecture, data models, privacy and limitations |

## Folder structure

```
src/
  app/          router, root layout (MotionConfig, ticker, toasts)
  pages/        Landing, Demo, Protect, Architecture, Privacy, parent/*, family/*
  components/   ui, risk, family, parent, landing, demo, layout
  engine/       riskEngine.ts, signals.ts, scenarios.ts, riskEngine.test.ts   (pure, no React)
  services/     interfaces + mock implementations
  store/        useAppStore.ts (zustand; drives both "devices")
  i18n/         dictionary.ts, useT.ts (EN / हिन्दी / বাংলা)
  voice/        speech.ts (Web Speech wrappers), intents.ts
  data/         mockData.ts
```

## How the risk engine scores

Patterns live as data in `src/engine/signals.ts`.

| Category | Pts | Category | Pts |
|---|---|---|---|
| IMPERSONATION | 15 | PAYMENT_REQUEST | 15 |
| ACCUSATION | 10 | OTP_REQUEST | 25 |
| THREAT | 20 | REMOTE_ACCESS | 25 |
| URGENCY | 10 | SCREEN_SHARING | 20 |
| SECRECY | 20 | PERSONAL_INFORMATION | 10 |
| FINANCIAL_REQUEST | 20 | SUSPICIOUS_LINK | 15 |

Unknown number baseline: **+6**. Rules:

1. Each new **caller** line is matched case-insensitively (Unicode-aware). User lines are never scored.
2. Each category counts **once per call**, recorded with timestamp and evidence.
3. **Single-indicator cap:** one distinct category can never exceed 29 (Low).
4. **Negation guard** (OTP and personal-info only): skipped if "never", "will never", "do not share", "kabhi nahi" appears within 4 words before.
5. Score = baseline + points, capped at 100. Levels: Low 0–29 · Suspicious 30–59 · High 60–79 · Critical 80–100.
6. `analyzeLine(session, line)` and `scoreText(text)` are pure functions.

Scenario A (digital arrest) scores `6 → 21 → 31 → 51 → 71 → 96`; Scenario B (genuine bank reminder) stays at 21. Both are asserted in `riskEngine.test.ts`.

### Add a signal or scenario

- **Signal:** add an entry to `SIGNALS` in `signals.ts` (category, points, label, patterns), add the category to `SignalCategory` in `types/models.ts`, and a checklist line in `WhyRiskyPanel.tsx`.
- **Scenario:** add a `Scenario` object in `scenarios.ts` and register it in `SCENARIOS`; extend the scenario picker in `pages/Protect.tsx`.

## Simulated vs future production

| Simulated today | Production would need |
|---|---|
| Scripted call and transcript | Android/OEM/telecom integration for call audio |
| Rule-based detection | On-device speech recognition, Indic language models |
| In-app "push" to family | Encrypted push/SMS |
| Payment pause on a generic demo screen | Bank / UPI partnerships |

Sahayak here does **not** intercept real calls and does **not** block real banking apps.
`src/services/` defines the seams (`CallSource`, `RiskService`, `NotificationService`, `InterventionService`, `PaymentGuard`, `SpeechService`); only mock implementations exist, so the demo never touches the network.

## Privacy notes

Only `language`, `contacts` and `medications` are persisted (localStorage, wrapped in try/catch). Call and demo state are never persisted. No audio leaves the browser except through the browser's own Web Speech implementation, which may use the browser vendor's speech service depending on the browser.

## 3-minute judge script

1. **Landing** — read the tagline: "Google can warn you. Sahayak brings your family in." Click **Try live demo** (starts automatically).
2. **0:00–0:05** — Parent phone rings from an unknown number. "Protection is already on."
3. **0:05–0:40** — Transcript appears word by word; score climbs 6 → 21 → 31 → 51. Point at the timeline: every jump names its signal and points.
4. **~0:60** — "Don't tell your son" → **HIGH**. Family phone gets the alert; Mrs. Sen gets a calm warning. Say: "Notice it never says the caller is a criminal."
5. **~1:17** — Transfer demand → **CRITICAL (96)**. Click **Intervene** on the family phone (or wait for the countdown).
6. Parent phone shows the protection overlay and Arjun's voice message (try the EN / हिन्दी / বাংলা picker).
7. Payment screen opens → **Transaction paused**. Click **Continue anyway** to show the second confirmation, or let it pick **Call my son**.
8. **Complete screen** — "Detected before the money moved."
9. Bonus: **Try the safe bank call** (stays Low), then type sentences into the sandbox (Hindi and Bengali work). Press `Space` to pause and `→` for next step at any time in Demo mode.
