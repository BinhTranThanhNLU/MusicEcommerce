import type { AudioTrackModel } from "../models/AudioTrackModel";

export interface AdminUserTrackPageResponse {
  tracks: AudioTrackModel[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
}
