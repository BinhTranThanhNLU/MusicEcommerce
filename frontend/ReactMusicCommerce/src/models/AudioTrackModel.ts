import type { ArtistModel } from "./ArtistModel";
import type { AudioTrackLicenseModel } from "./AudioTrackLicenseModel";
import type { TrackTagsModel } from "./TrackTagsModel";

export interface AudioTrackModel {
  id: number;
  title: string;
  audioType: string;
  duration: number;
  coverImage: string;
  watermarkedFileUrl: string;
  playCount: number;
  startingPrice: number;
  uploadDate: string | null;

  artist: ArtistModel;
  tags: TrackTagsModel;

  licenses: AudioTrackLicenseModel[];

  description: string;
}