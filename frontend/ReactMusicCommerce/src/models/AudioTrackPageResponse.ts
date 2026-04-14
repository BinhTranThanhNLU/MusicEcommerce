import type { AudioTrackModel } from "./AudioTrackModel";

export interface AudioTrackPageResponse {
  tracks: AudioTrackModel[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
}