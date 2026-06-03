import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const ThemeContext = createContext(null);

function readSavedTheme() {
  try {
    return localStorage.getItem('studenova_theme') || 'light';
  } catch {
    return 'light';
  }
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(readSavedTheme);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    try {
      localStorage.setItem('studenova_theme', theme);
    } catch {
      // Ignore storage failures so the app can still render.
    }
  }, [theme]);

  const value = useMemo(() => ({ theme, toggleTheme: () => setTheme((current) => (current === 'dark' ? 'light' : 'dark')) }), [theme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
