import React from 'react';
import { HeroSection } from '../components/HeroSection';
import { TravelCard } from '../components/TravelCard';
import { SectionHeading } from '../components/ui/SectionHeading';
import { siteConfig } from '../data/config';
import { trips } from '../data/trips';
import { useTheme } from '../hooks/useTheme';

/**
 * HomePage component featuring a hero section and a grid of recent travel stories.
 */
export const HomePage: React.FC = () => {
  React.useEffect(() => {
    document.title = `${siteConfig.ownerName} · Nature & Travel Portfolio`;
  }, []);

  const { dark } = useTheme();
  
  const heroLightUrl = "https://res.cloudinary.com/df9fnyyzz/image/upload/q_auto/f_auto/v1777778442/hero_light_irbrrs.jpg";
  const heroDarkUrl = "https://res.cloudinary.com/df9fnyyzz/image/upload/q_auto/f_auto/v1777778445/hero_dark_uclacp.jpg";
  
  const heroImageUrl = dark ? heroDarkUrl : heroLightUrl;

  return (
    <div className="flex flex-col w-full">
      <HeroSection
        headline={siteConfig.ownerName}
        subtext={siteConfig.subTagline}
        imageUrl={heroImageUrl}
        ctaLabel="Explore the Journal"
        ctaHref="/about"
      />

      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto w-full">
        <SectionHeading
          title="Recent journeys"
          subtitle="Explore a selection of my latest expeditions through the high mountains, dense forests, and pristine alpine lakes."
          align="left"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 mt-12">
          {trips.map((trip, index) => (
            <TravelCard key={trip.id} trip={trip} index={index} />
          ))}
        </div>
      </section>
    </div>
  );
};
