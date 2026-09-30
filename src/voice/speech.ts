import type { Language } from '@/types/models';

export const BCP47: Record<Language, string> = { en: 'en-IN', hi: 'hi-IN', bn: 'bn-IN' };

type RecognitionCtor = new () => SpeechRecognitionLike;
interface SpeechRecognitionLike {
  lang: string; continuous: boolean; interimResults: boolean;
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
  start(): void; stop(): void; abort(): void;
}

function recognitionCtor(): RecognitionCtor | null {
  if (typeof window === 'undefined') return null;
  const w = window as unknown as { SpeechRecognition?: RecognitionCtor; webkitSpeechRecognition?: RecognitionCtor };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export const recognitionSupported = () => recognitionCtor() !== null;
export const synthesisSupported = () => typeof window !== 'undefined' && 'speechSynthesis' in window;

export interface Recognizer { stop(): void }

export function listen(
  lang: Language,
  handlers: { onResult: (text: string) => void; onError: (error: string) => void; onEnd: () => void },
): Recognizer | null {
  const Ctor = recognitionCtor();
  if (!Ctor) return null;
  const rec = new Ctor();
  rec.lang = BCP47[lang];
  rec.continuous = false;
  rec.interimResults = false;
  rec.onresult = (e) => handlers.onResult(e.results[0][0].transcript);
  rec.onerror = (e) => handlers.onError(e.error);
  rec.onend = handlers.onEnd;
  try {
    rec.start();
  } catch {
    handlers.onError('start-failed');
    return null;
  }
  return { stop: () => { try { rec.stop(); } catch { /* already stopped */ } } };
}

function voicesReady(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    const synth = window.speechSynthesis;
    const now = synth.getVoices();
    if (now.length) return resolve(now);
    const timer = setTimeout(() => resolve(synth.getVoices()), 600);
    synth.addEventListener('voiceschanged', () => { clearTimeout(timer); resolve(synth.getVoices()); }, { once: true });
  });
}

/** Speak `text`. Resolves true if a matching voice spoke it, false if no voice exists for that language. */
export async function speak(text: string, lang: Language): Promise<boolean> {
  if (!synthesisSupported()) return false;
  const voices = await voicesReady();
  const prefix = lang;
  const voice = voices.find((v) => v.lang.toLowerCase().replace('_', '-').startsWith(prefix));
  if (!voice) return false;
  const synth = window.speechSynthesis;
  synth.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.voice = voice;
  u.lang = voice.lang;
  u.rate = 0.92;
  synth.speak(u);
  return true;
}

export function stopSpeaking() {
  if (synthesisSupported()) window.speechSynthesis.cancel();
}
