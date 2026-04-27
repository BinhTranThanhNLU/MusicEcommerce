import type { ArtistModel } from "./ArtistModel";
import type { AudioTrackLicenseModel } from "./AudioTrackLicenseModel";
import type { TrackTagsModel } from "./TrackTagsModel";

export interface AudioTrackModel {
  id: number;
  title: string;
  audioType: string;
  duration: number;
  coverImage: string;
  originalFileUrl?: string | null;
  watermarkedFileUrl: string;
  playCount: number;
  startingPrice: number;
  averageRating: number | null;
  reviewCount: number | null;
  uploadDate: string | null;
  lyrics?: string | null;
  status?: string | null;

  artist: ArtistModel;
  tags: TrackTagsModel;

  licenses: AudioTrackLicenseModel[];

  description: string;
}