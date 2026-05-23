export type SearchType =
  | "full-text"
  | "fuzzy"
  | "phrase"
  | "semantic"
  | "advanced"
  | "filter";

export interface AudioTrackAdvancedSearchRequest {
  keyword?: string;
  status?: string;
  genres?: string[];
  moods?: string[];
  themes?: string[];
  minPrice?: number;
  maxPrice?: number;
  page: number;
  size: number;
}

export interface AudioTrackSearchDocument {
  id: string;
  title: string;
  artistName: string;
  audioType?: string;
  description?: string;
  lyrics?: string;
  status?: string;
  genres?: string[];
  moods?: string[];
  themes?: string[];
  pricesVnd?: number[];
  playCount?: number;
  coverImage?: string;
  uploadDate?: string;
}

export interface AudioTrackSearchResponse {
  results: AudioTrackSearchDocument[];
  page: number;
  size: number;
  totalResults: number;
  totalPages: number;
  searchType: SearchType;
  query: string;
}