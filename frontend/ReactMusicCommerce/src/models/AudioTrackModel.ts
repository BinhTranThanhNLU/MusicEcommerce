import type { ArtistModel } from "./ArtistModel";
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

  artist: ArtistModel;
  tags: TrackTagsModel;
}