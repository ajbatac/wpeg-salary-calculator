import { useEffect, useState } from 'react';
import { ChevronsUp } from 'lucide-react';

/** Floating back-to-top button. Appears after one viewport of scroll and
 *  inverts with the display mode (black on white / white on black) so it
 *  reads on every palette in both light and dark mode. */
export default function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <button
      type="button"
      onClick={() => {
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
      }}
      aria-label="Back to top"
      aria-hidden={!show}
      tabIndex={show ? 0 : -1}
      className={`fixed bottom-6 right-6 z-40 w-11 h-11 rounded-full flex items-center justify-center
        bg-white text-black border border-black/20 dark:bg-black dark:text-white dark:border-white/30
        shadow-xl transition-all duration-300 print:hidden
        ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}`}
    >
      <ChevronsUp className="w-5 h-5" aria-hidden="true" />
    </button>
  );
}
