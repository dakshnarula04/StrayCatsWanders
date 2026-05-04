import React from 'react';
import { MapPin } from 'lucide-react';
import { siteConfig } from '../data/config';
import { timeline } from '../data/timeline';
import { Tag } from '../components/ui/Tag';
import { SectionHeading } from '../components/ui/SectionHeading';
import { Timeline } from '../components/Timeline';

/**
 * AboutPage component featuring a personal profile, skills, and a journey timeline.
 */
export const AboutPage: React.FC = () => {
  React.useEffect(() => {
    document.title = `About · ${siteConfig.ownerName}`;
  }, []);

  const skills = ["Hiking", "Photography", "Storytelling", "Mountains", "Solo Travel"];

  return (
    <div className="flex flex-col w-full">
      {/* Profile Section */}
      <section className="max-w-3xl mx-auto px-6 pt-32 pb-12">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-10">
          {/* Profile Photo */}
          <div className="flex-shrink-0">
            <img
              src="https://res.cloudinary.com/df9fnyyzz/image/upload/q_auto,f_auto,w_600,c_fill,g_auto/v1777889719/WhatsApp_Image_2026-04-27_at_21.25.28_xi1f4h.jpg" // Optimized profile photo
              alt={`Portrait of ${siteConfig.ownerName} outdoors`}
              className="w-40 h-40 md:w-48 md:h-48 rounded-2xl object-cover border-4 border-forest-300 dark:border-forest-800 shadow-xl"
            />
          </div>

          {/* Text Block */}
          <div className="flex flex-col text-center md:text-left">
            <h1 className="font-serif text-4xl md:text-5xl text-forest-900 dark:text-linen-50 leading-tight">
              I'm {siteConfig.ownerName.split(' ')[0]} (Daksh)
            </h1>

            <div className="flex items-center justify-center md:justify-start gap-1.5 text-stone-500 dark:text-stone-400 text-sm mt-2 font-medium">
              <MapPin size={14} className="text-forest-500" />
              <span>{siteConfig.location}</span>
            </div>

            <p className="mt-6 text-stone-600 dark:text-stone-300 leading-relaxed text-base md:text-lg">
              {siteConfig.subTagline} Hi, I’m Daksh Narula, a 22-year-old BCA graduate who enjoys meeting new people, trying new things, and learning through real-life experiences.<br></br>I’m passionate about teaching computer applications in a simple, practical way that’s easy to understand.
              <br></br>Along with my technical background, I also have a creative side—I enjoy drawing and painting as a way to express ideas and perspectives. I love being part of a team and aim to bring a positive, energetic vibe into everything I do.
            </p>

            {/* Skills Pills */}
            <div className="mt-8 flex flex-wrap justify-center md:justify-start gap-2">
              {skills.map((skill) => (
                <Tag key={skill} label={skill} color="forest" className="px-4 py-1 text-sm" />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div
        className="border-t border-forest-200 dark:border-forest-800 max-w-3xl mx-auto my-12 w-full opacity-50"
        aria-hidden="true"
      />

      {/* Timeline Section */}
      <section className="max-w-3xl mx-auto px-6 pb-24 w-full">
        <SectionHeading
          title="The journey so far"
          subtitle="Milestones and memories from my years on the trail."
          align="left"
          className="mb-12"
        />

        <Timeline items={timeline} />
      </section>
    </div>
  );
};
