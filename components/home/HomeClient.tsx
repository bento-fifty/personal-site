'use client';

import { useState, useCallback, useEffect } from 'react';
import HookScreen from './HookScreen';
import IssueCover from './IssueCover';
import { useContactCompose } from '@/components/contact/ContactComposeContext';

interface Props {
  locale: 'zh-TW' | 'en-US';
}

export default function HomeClient({ locale }: Props) {
  const [entered, setEntered] = useState(false);
  const { setSuppressed } = useContactCompose();

  useEffect(() => {
    setSuppressed(!entered);
    return () => setSuppressed(false);
  }, [entered, setSuppressed]);

  const handleEnter = useCallback(() => setEntered(true), []);

  return (
    <>
      <IssueCover locale={locale} />
      {!entered && <HookScreen onEnter={handleEnter} />}
    </>
  );
}
