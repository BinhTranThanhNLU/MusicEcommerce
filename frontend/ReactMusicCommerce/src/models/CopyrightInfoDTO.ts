export interface CopyrightInfoDTO {
  id: number;
  audioId: number;
  audioTitle: string;
  artistId: number;
  artistName: string;
  ownerName: string;
  isrcCode: string;
  certificateFileUrl: string | null;
  registeredAt: string;
}