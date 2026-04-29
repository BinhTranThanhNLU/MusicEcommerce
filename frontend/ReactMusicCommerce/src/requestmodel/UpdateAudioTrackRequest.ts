export interface UpdateAudioTrackRequest {
  title: string;
  audioType: string;
  description: string;
  lyrics: string;
  duration: number | null;
  originalFileUrl?: string;
  watermarkedFileUrl?: string;
  coverImage?: string;
  status: string;
}