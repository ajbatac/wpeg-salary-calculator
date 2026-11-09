import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

/** Saved theme wins; otherwise fall back to the OS preference. */
function readInitialTheme(): boolean {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) return savedTheme === 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export default function DarkModeToggle() {
  const [isDark, setIsDark] = useState(readInitialTheme);

  // Keep the document class in sync with the state (covers first paint too).
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark((previous) => {
      const next = !previous;
      localStorage.setItem('theme', next ? 'dark' : 'light');
      return next;
    });
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="p-3 rounded-[var(--radius)] theme-surface border border-border hover:scale-110 transition-all duration-300 hover:shadow-lg"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {isDark ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5 text-primary" />}
    </button>
  );
}
