import { useEffect, useState } from 'react';

export function useMedia(query: string): boolean {
  const [matches, setMatches] = useState(() => (typeof window === 'undefined' ? false : window.matchMedia(query).matches));
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setMatches(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, [query]);
  return matches;
}

export type Layout = 'three' | 'two' | 'one';
export function useLayout(): Layout {
  const xl = useMedia('(min-width: 1280px)');
  const md = useMedia('(min-width: 768px)');
  return xl ? 'three' : md ? 'two' : 'one';
}
