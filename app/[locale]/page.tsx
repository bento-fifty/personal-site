import DarkNavActivator from '@/components/home/DarkNavActivator';
import HomeAmbientBg from '@/components/home/HomeAmbientBg';
import SectionNavigator from '@/components/home/SectionNavigator';
import ScrollSnapController from '@/components/home/ScrollSnapController';
import Hero from '@/components/home/Hero';
import ActiveSystemsToolbelt from '@/components/home/ActiveSystemsToolbelt';
import MissionLogTerminal from '@/components/home/MissionLogTerminal';
import FeaturedOpsRolodex from '@/components/home/FeaturedOpsRolodex';
import CaseShowcase3D from '@/components/home/CaseShowcase3D';
import LocationsMap from '@/components/home/LocationsMap';
import BookingWizardConsole from '@/components/home/BookingWizardConsole';

export default function HomePage() {
  return (
    <>
      <DarkNavActivator />
      <HomeAmbientBg />
      <SectionNavigator />
      <ScrollSnapController />
      <Hero />
      <ActiveSystemsToolbelt />
      <MissionLogTerminal />
      <FeaturedOpsRolodex />
      <CaseShowcase3D />
      <LocationsMap />
      <BookingWizardConsole />
    </>
  );
}
