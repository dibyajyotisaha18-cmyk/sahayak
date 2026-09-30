import { useCallback } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { DICTIONARY, EN, type DictKey } from './dictionary';

export type TFn = (key: DictKey, vars?: Record<string, string | number>) => string;

export function useT() {
  const lang = useAppStore((s) => s.language);
  const t: TFn = useCallback(
    (key, vars) => {
      let s = DICTIONARY[lang][key] ?? EN[key];
      if (vars) for (const [k, v] of Object.entries(vars)) s = s.replace(`{${k}}`, String(v));
      return s;
    },
    [lang],
  );
  return { t, lang };
}

/** Localised label for a risk level. */
export const LEVEL_KEY = { LOW: 'low', SUSPICIOUS: 'suspicious', HIGH: 'high', CRITICAL: 'critical' } as const;
