import type { AudioTrackDTO } from "./AudioTrackDTO";

export interface AdminAudioTrackPageResponse {
  tracks: AudioTrackDTO[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
}