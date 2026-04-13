'use client';

import { useState, useCallback } from 'react';
import UniverseCanvas from '@/components/shared/UniverseCanvas';
import HookScreen from '@/components/home/HookScreen';
import Hero from '@/components/home/Hero';
import DescentTransition from '@/components/home/DescentTransition';
import ActiveSystemsToolbelt from '@/components/home/ActiveSystemsToolbelt';
import FeaturedOpsRolodex from '@/components/home/FeaturedOpsRolodex';
import CaseShowcase3D from '@/components/home/CaseShowcase3D';

export default function HomePage() {
  const [entered, setEntered] = useState(false);

  const handleEnter = useCallback(() => {
    setEntered(true);
  }, []);

  return (
    <>
      <UniverseCanvas phase="ambient" />

      {/* Hero always mounted underneath so clip-path reveal shows it */}
      <Hero />

      {/* Below-fold content only after entering */}
      {entered && (
        <>
          <DescentTransition />
          <div style={{ background: 'transparent' }}>
            <ActiveSystemsToolbelt />
            <FeaturedOpsRolodex />
            <CaseShowcase3D />
          </div>
        </>
      )}

      {/* Hook screen on top — clips away to reveal Hero */}
      {!entered && <HookScreen onEnter={handleEnter} />}
    </>
  );
}
