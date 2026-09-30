import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, Send, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { EmergencySheet } from '@/components/parent/EmergencySheet';
import { SimulatedCall } from '@/components/parent/SimulatedCall';
import { useT } from '@/i18n/useT';
import { useAppStore } from '@/store/useAppStore';
import { parseIntent } from '@/voice/intents';
import { listen, recognitionSupported, speak, stopSpeaking, type Recognizer } from '@/voice/speech';
import { clockTime } from '@/lib/time';
import { cn } from '@/lib/cn';

interface Msg { id: number; who: 'bot' | 'me'; text: string }

export default function ParentTalk() {
  const { t, lang } = useT();
  const navigate = useNavigate();
  const { medications, addMedication, contacts, call, events, protectionOn } = useAppStore();
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [listening, setListening] = useState(false);
  const [notice, setNotice] = useState<string | null>(recognitionSupported() ? null : t('micUnavailable'));
  const [input, setInput] = useState('');
  const [sos, setSos] = useState(false);
  const [callSon, setCallSon] = useState(false);
  const rec = useRef<Recognizer | null>(null);
  const idRef = useRef(0);
  const end = useRef<HTMLDivElement>(null);

  useEffect(() => { end.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }); }, [msgs.length]);
  useEffect(() => () => { rec.current?.stop(); stopSpeaking(); }, []);

  const say = (text: string) => {
    setMsgs((m) => [...m, { id: ++idRef.current, who: 'bot', text }]);
    void speak(text, lang);
  };

  const handle = (raw: string) => {
    const text = raw.trim();
    if (!text) return;
    setMsgs((m) => [...m, { id: ++idRef.current, who: 'me', text }]);
    const intent = parseIntent(text);
    switch (intent.type) {
      case 'REMIND':
        if (!medications.some((m) => m.time.toUpperCase() === intent.time)) addMedication({ name: 'Medicine reminder', dosage: 'As prescribed', time: intent.time });
        say(t('replyReminder', { time: intent.time }));
        break;
      case 'CALL_SON': say(t('replyCallSon')); setCallSon(true); break;
      case 'SAFE': {
        const risky = call && (call.riskLevel === 'HIGH' || call.riskLevel === 'CRITICAL');
        if (!protectionOn) say(t('protectionOff'));
        else if (risky) say(t('gentleWarning'));
        else say(events.length ? t('replySafeLast', { event: events[0].description + ' (' + clockTime(events[0].timestamp) + ')' }) : t('replySafeOk'));
        break;
      }
      case 'HELP': say(t('replyHelp')); setSos(true); break;
      case 'MEDS': say(t('replyMeds')); setTimeout(() => navigate('/parent/medicines'), 900); break;
      case 'FAMILY': say(t('replyFamily', { names: contacts.map((c) => `${c.name} (${c.relationship})`).join(', ') })); break;
      case 'GREET': say(t('helloMsg')); break;
      default: say(t('notCaught'));
    }
  };

  const onMic = () => {
    if (listening) { rec.current?.stop(); return; }
    if (msgs.length === 0) say(t('helloMsg'));
    if (!recognitionSupported()) { setNotice(t('micUnavailable')); return; }
    setNotice(null);
    const r = listen(lang, {
      onResult: handle,
      onError: (e) => { setListening(false); setNotice(e === 'not-allowed' || e === 'service-not-allowed' ? t('micDenied') : t('micUnavailable')); },
      onEnd: () => setListening(false),
    });
    if (r) { rec.current = r; setListening(true); }
  };

  const chips = [t('cmdRemind'), t('cmdCallSon'), t('cmdSafe'), t('cmdHelp'), t('cmdMeds'), t('cmdFamily')];

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-4">
      <h1 className="text-[36px] font-extrabold leading-tight">{t('talk')}</h1>

      <div className="flex flex-col items-center gap-3">
        <button
          type="button" onClick={onMic} aria-pressed={listening}
          className={cn(
            'relative grid h-40 w-40 place-items-center rounded-full text-white shadow-card transition-colors duration-150',
            'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-600/40 active:scale-[0.98]',
            listening ? 'bg-navy-900' : 'bg-teal-600',
          )}
        >
          {listening && <span className="pulse-ring absolute inset-0 rounded-full bg-teal-600/40" aria-hidden />}
          <span className="relative flex flex-col items-center gap-1 text-[20px] font-bold"><Mic size={54} aria-hidden />{listening ? t('listening') : t('tapToSpeak')}</span>
        </button>
        {notice && <p role="status" className="rounded-xl bg-warn-bg px-4 py-3 text-lg font-medium text-warn">{notice}</p>}
      </div>

      <div className="space-y-3" role="log" aria-live="polite">
        {msgs.map((m) => (
          <div key={m.id} className={cn('flex', m.who === 'me' ? 'justify-end' : 'justify-start')}>
            <p className={cn('max-w-[92%] rounded-3xl px-5 py-3.5 text-[22px] leading-snug', m.who === 'me' ? 'rounded-br-md bg-navy-900 text-white' : 'rounded-bl-md border border-line bg-white')}>
              {m.who === 'bot' && <Volume2 size={18} className="mr-2 inline text-teal-600" aria-hidden />}{m.text}
            </p>
          </div>
        ))}
        <div ref={end} />
      </div>

      <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); handle(input); setInput(''); }}>
        <label className="sr-only" htmlFor="talk-input">{t('orType')}</label>
        <input
          id="talk-input" value={input} onChange={(e) => setInput(e.target.value)} placeholder={t('orType')}
          className="h-16 min-w-0 flex-1 rounded-2xl border-2 border-line bg-white px-4 text-[22px] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-600/40"
        />
        <Button size="xl" type="submit" className="!min-h-16 !px-5" aria-label={t('send')}><Send size={26} aria-hidden /><span className="hidden sm:inline">{t('send')}</span></Button>
      </form>

      <section aria-label={t('tryCommand')}>
        <h2 className="mb-2 text-lg font-bold text-slate-600">{t('tryCommand')}</h2>
        <ul className="flex flex-wrap gap-2">
          {chips.map((c) => (
            <li key={c}><button type="button" onClick={() => handle(c)} className="min-h-[56px] rounded-2xl border-2 border-line bg-white px-4 text-left text-lg font-semibold hover:border-navy-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-600/40">{c}</button></li>
          ))}
          {['Ma, amar sathe kotha bolo', 'mujhe madad chahiye'].map((c) => (
            <li key={c}><button type="button" onClick={() => handle(c)} className="min-h-[56px] rounded-2xl border-2 border-dashed border-line bg-white px-4 text-left text-lg font-semibold text-slate-600 hover:border-navy-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-600/40">{c}</button></li>
          ))}
        </ul>
      </section>
      <EmergencySheet open={sos} onClose={() => setSos(false)} />
      <SimulatedCall open={callSon} onClose={() => setCallSon(false)} note={t('emergencyDemo')} />
    </div>
  );
}
