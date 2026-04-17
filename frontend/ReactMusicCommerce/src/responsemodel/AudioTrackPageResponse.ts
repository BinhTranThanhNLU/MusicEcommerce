import type { AudioTrackModel } from "../models/AudioTrackModel";

export interface AudioTrackPageResponse {
  tracks: AudioTrackModel[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
}