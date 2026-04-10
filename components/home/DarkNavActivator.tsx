'use client';

import { useEffect } from 'react';
import { useNavTheme } from '@/contexts/NavThemeContext';

export default function DarkNavActivator() {
  const { setTheme } = useNavTheme();
  useEffect(() => {
    setTheme('dark');
    return () => setTheme('light');
  }, [setTheme]);
  return null;
}
