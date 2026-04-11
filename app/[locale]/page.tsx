import DarkNavActivator from '@/components/home/DarkNavActivator';
import HomeAmbientBg from '@/components/home/HomeAmbientBg';
import SectionNavigator from '@/components/home/SectionNavigator';
import Hero from '@/components/home/Hero';
import FeaturedWork from '@/components/home/FeaturedWork';
import LocationsMap from '@/components/home/LocationsMap';

export default function HomePage() {
  return (
    <>
      <DarkNavActivator />
      <HomeAmbientBg />
      <SectionNavigator />
      <Hero />
      <FeaturedWork />
      <LocationsMap />
    </>
  );
}
