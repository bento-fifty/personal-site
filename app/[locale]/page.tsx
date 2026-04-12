'use client';

import { useState, useCallback } from 'react';
import UniverseCanvas, { type UniversePhase } from '@/components/shared/UniverseCanvas';
import LoadingOverlay from '@/components/home/LoadingOverlay';
import Hero from '@/components/home/Hero';
import DescentTransition from '@/components/home/DescentTransition';
import ActiveSystemsToolbelt from '@/components/home/ActiveSystemsToolbelt';
import FeaturedOpsRolodex from '@/components/home/FeaturedOpsRolodex';
import CaseShowcase3D from '@/components/home/CaseShowcase3D';

export default function HomePage() {
  const [universePhase, setUniversePhase] = useState<UniversePhase>('loading');
  const [loadingDone, setLoadingDone] = useState(false);

  const handlePhaseChange = useCallback((phase: UniversePhase) => {
    setUniversePhase(phase);
  }, []);

  const handleLoadComplete = useCallback(() => {
    setLoadingDone(true);
  }, []);

  return (
    <>
      <UniverseCanvas phase={universePhase} />
      <LoadingOverlay onPhaseChange={handlePhaseChange} onComplete={handleLoadComplete} />

      {loadingDone && (
        <>
          <Hero />
          <DescentTransition />
          <div className="bg-[#0C0C0E]">
            <ActiveSystemsToolbelt />
            <FeaturedOpsRolodex />
            <CaseShowcase3D />
          </div>
        </>
      )}
    </>
  );
}
