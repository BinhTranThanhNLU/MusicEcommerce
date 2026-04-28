import type { ArtistModel } from "../models/ArtistModel";
import type { AudioTrackLicenseModel } from "../models/AudioTrackLicenseModel";
import type { TrackTagsModel } from "../models/TrackTagsModel";

export interface AudioTrackDTO {
  id: number;
  title: string;
  audioType: string;
  duration: number;
  coverImage: string;
  watermarkedFileUrl: string;
  playCount: number;
  startingPrice: number;
  averageRating: number | null;
  reviewCount: number | null;
  uploadDate: string | null;
  authorName: string;
  artist: ArtistModel;
  tags: TrackTagsModel;
  licenses: AudioTrackLicenseModel[];
  description: string;
}
