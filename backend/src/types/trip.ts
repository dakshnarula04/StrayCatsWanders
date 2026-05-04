export interface TripRow {
  id: string;
  title: string;
  location: string;
  date: string;
  image_url: string;
  image_alt: string;
  tags: string[];
  excerpt: string;
  featured: boolean;
  created_at: Date;
}

export interface CreateTripDTO {
  title: string;
  location: string;
  date: string;
  image_url: string;
  image_alt?: string;
  tags: string[];
  excerpt: string;
  featured: boolean;
}

export interface UpdateTripDTO {
  title?: string;
  location?: string;
  date?: string;
  tags?: string[];
  excerpt?: string;
  featured?: boolean;
}
