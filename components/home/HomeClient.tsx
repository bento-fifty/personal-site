'use client';

import { useState, useCallback } from 'react';
import HookScreen from './HookScreen';
import IssueCover from './IssueCover';
interface Props {
  locale: 'zh-TW' | 'en-US';
}

export default function HomeClient({ locale }: Props) {
  const [entered, setEntered] = useState(false);
  const handleEnter = useCallback(() => setEntered(true), []);

  return (
    <>
      <IssueCover locale={locale} />
      {!entered && <HookScreen onEnter={handleEnter} />}
    </>
  );
}
