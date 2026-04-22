export interface LibraryItemResponse {
  audioId: number;
  title: string;
  audioType: string;
  artistName: string;
  coverImage: string | null;
  licenseType: string;
  originalFileUrl: string | null;
  watermarkedFileUrl: string | null;
  duration: number | null;
  purchasedAt: string | null;
  orderId: number;
  orderDetailId: number;
}