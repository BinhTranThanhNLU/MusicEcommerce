export interface LibraryItemResponse {
  audioId: number;
  title: string;
  audioType: string;
  artistName: string;
  coverImage: string | null;
  licenseType: string;
  originalFileUrl: string | null;
  watermarkedFileUrl: string | null;
  musicDownloadUrl: string | null;
  certificateDownloadUrl: string | null;
  certificateAvailable: boolean | null;
  duration: number | null;
  purchasedAt: string | null;
  orderId: number;
  orderDetailId: number;
}