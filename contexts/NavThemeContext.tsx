'use client';

import { createContext, useContext, useState } from 'react';

type NavTheme = 'dark' | 'light';

const NavThemeContext = createContext<{
  theme: NavTheme;
  setTheme: (t: NavTheme) => void;
}>({
  theme: 'light',
  setTheme: () => {},
});

export function NavThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<NavTheme>('light');
  return (
    <NavThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </NavThemeContext.Provider>
  );
}

export function useNavTheme() {
  return useContext(NavThemeContext);
}
