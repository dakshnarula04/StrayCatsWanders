import React, { useState, useEffect } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { HeroSection } from '../components/HeroSection';
import { TravelCard } from '../components/TravelCard';
import { SectionHeading } from '../components/ui/SectionHeading';
import { AddTripModal } from '../components/AddTripModal';
import { siteConfig } from '../data/config';
import { tripApi } from '../services/tripApi';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../context/AuthContext';
import type { TripData } from '../types';

/**
 * HomePage component featuring a hero section and a grid of recent travel stories.
 * Now dynamically fetches journeys from the API and allows admin management.
 */
export const HomePage: React.FC = () => {
  const { dark } = useTheme();
  const { isAdmin, accessToken } = useAuth();
  
  const [journeys, setJourneys] = useState<TripData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTrip, setEditingTrip] = useState<TripData | null>(null);

  useEffect(() => {
    document.title = `${siteConfig.ownerName} · Nature & Travel Portfolio`;
    fetchJourneys();
  }, []);

  const fetchJourneys = async () => {
    try {
      const data = await tripApi.getAll();
      setJourneys(data);
    } catch (err) {
      console.error('Failed to fetch journeys:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (trip: TripData) => {
    setEditingTrip(trip);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string | number) => {
    if (!accessToken || !window.confirm('Are you sure you want to remove this journey?')) return;
    try {
      await tripApi.delete(id, accessToken);
      setJourneys(prev => prev.filter(j => j.id !== id));
    } catch (err) {
      alert('Failed to remove journey');
    }
  };

  const handleModalSuccess = (trip: TripData) => {
    if (editingTrip) {
      setJourneys(prev => prev.map(j => j.id === trip.id ? trip : j));
    } else {
      setJourneys(prev => [trip, ...prev]);
    }
    setIsModalOpen(false);
    setEditingTrip(null);
  };
  
  const handleOpenAddModal = () => {
    setEditingTrip(null);
    setIsModalOpen(true);
  };
  
  const heroLightUrl = "https://res.cloudinary.com/df9fnyyzz/image/upload/q_auto,f_auto,w_1920,c_limit/v1777889639/00001_oqqo0a.png";
  const heroDarkUrl = "https://res.cloudinary.com/df9fnyyzz/image/upload/q_auto,f_auto,w_1920,c_limit/v1777890165/hero_dark_wpftmv.png";
  const heroImageUrl = dark ? heroDarkUrl : heroLightUrl;

  return (
    <div className="flex flex-col w-full">
      <HeroSection
        headline={siteConfig.ownerName}
        subtext={siteConfig.subTagline}
        imageUrl={heroImageUrl}
        ctaLabel="Explore the Journal"
        ctaHref="/journal"
      />

      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <SectionHeading
            title="Recent journeys"
            subtitle="Explore a selection of my latest expeditions through the high mountains, dense forests, and pristine alpine lakes."
            align="left"
            className="mb-0"
          />
          
          {isAdmin && (
            <button
              onClick={handleOpenAddModal}
              className="flex items-center gap-2 px-5 py-2.5 bg-forest-900 dark:bg-forest-700 text-linen-50 rounded-full font-sans text-sm hover:bg-forest-800 dark:hover:bg-forest-600 transition-all shadow-md active:scale-95"
            >
              <Plus size={18} />
              <span>Add Journey</span>
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-stone-400">
            <Loader2 className="animate-spin" size={32} />
            <p className="font-sans text-sm">loading journeys...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {journeys.map((trip, index) => (
              <TravelCard 
                key={trip.id} 
                trip={trip} 
                index={index} 
                onDelete={isAdmin ? () => handleDelete(trip.id) : undefined}
                onEdit={isAdmin ? () => handleEdit(trip) : undefined}
              />
            ))}
          </div>
        )}
      </section>

      <AddTripModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleModalSuccess}
        trip={editingTrip}
      />
    </div>
  );
};
