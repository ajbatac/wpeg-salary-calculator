import { useCallback, useSyncExternalStore } from 'react';
import { getColorThemeId, setColorTheme, subscribeColorTheme } from '@/react-app/lib/colorTheme';

export function useColorTheme(): { themeId: string | null; setColorTheme: (id: string | null) => void } {
  const themeId = useSyncExternalStore(subscribeColorTheme, getColorThemeId, () => null);
  const select = useCallback((id: string | null) => setColorTheme(id), []);
  return { themeId, setColorTheme: select };
}
