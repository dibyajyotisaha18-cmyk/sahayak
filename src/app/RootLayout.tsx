import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { MotionConfig, motion } from 'motion/react';
import { Toaster } from '@/components/ui/Toast';
import { ensureTicker, useAppStore } from '@/store/useAppStore';

export function RootLayout() {
  const { pathname, hash } = useLocation();
  const language = useAppStore((s) => s.language);

  useEffect(() => { ensureTicker(); }, []);
  useEffect(() => { document.documentElement.lang = language; }, [language]);
  useEffect(() => {
    if (hash) requestAnimationFrame(() => document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth' }));
    else window.scrollTo(0, 0);
  }, [pathname, hash]);

  return (
    <MotionConfig reducedMotion="user">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[80] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:font-semibold focus:shadow-modal">Skip to content</a>
      <motion.div key={pathname} id="main-content" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}>
        <Outlet />
      </motion.div>
      <Toaster />
    </MotionConfig>
  );
}
