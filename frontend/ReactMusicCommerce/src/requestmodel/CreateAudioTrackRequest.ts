import type { LicensePriceRequest } from "./LicensePriceRequest";

export interface CreateAudioTrackRequest {
  title: string;
  audioType: string;
  description?: string;
  lyrics?: string;
  authorName: string;
  duration: number;
  genreIds: number[];
  moodIds: number[];
  themeIds?: number[];
  licensePrices: LicensePriceRequest[];
}
