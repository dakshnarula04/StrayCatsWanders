export interface TripData {
  id: string | number;
  title: string;
  location: string;
  date: string;
  imageUrl: string;
  imageAlt: string;
  tags: string[];
  excerpt: string;
  featured: boolean;
}

export interface TimelineItem {
  id: string | number;
  year: string | number;
  title: string;
  description: string;
  location?: string;
  tags?: string[];
}

export interface SocialLink {
  label: string;
  href: string;
  icon: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export interface SiteConfig {
  ownerName: string;
  tagline: string;
  subTagline: string;
  heroImage: string;
  profilePhoto: string;
  location: string;
  socials: SocialLink[];
}

export interface JournalEntry {
  id: string;
  imageUrl: string;
  imageAlt: string;
  caption: string;       // short poetic line, shown on the polaroid
  location: string;      // e.g. "Kedarkantha, Uttarakhand"
  date: string;          // e.g. "Dec 2023"
  tags: string[];        // e.g. ["mountains", "golden hour"]
  rotation: number;      // degrees, between -4 and 4, gives the tilt
  story?: string;        // optional longer note shown in the lightbox
}
