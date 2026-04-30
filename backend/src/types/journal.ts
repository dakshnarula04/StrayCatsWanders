export interface JournalEntryRow {
  id: string;
  caption: string;
  location: string;
  date_label: string;
  story: string | null;
  tags: string[];
  rotation: number;
  image_url: string;
  image_alt: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateJournalEntryDTO {
  caption: string;
  location: string;
  date_label: string;
  story?: string;
  tags: string[];
  rotation: number;
  image_url: string;
  image_alt: string;
}

export interface UpdateJournalEntryDTO {
  caption?: string;
  location?: string;
  date_label?: string;
  story?: string;
  tags?: string[];
}

export interface JournalListResponse {
  entries: JournalEntryRow[];
  total: number;
  page: number;
  limit: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
