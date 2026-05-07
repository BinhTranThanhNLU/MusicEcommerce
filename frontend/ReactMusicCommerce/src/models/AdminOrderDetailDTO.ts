export interface AdminOrderDetailDTO {
  orderDetailId: number;
  audioId: number;
  trackTitle: string;
  artistName: string;
  coverImage: string | null;
  licenseType: string;
  price: number;
  duration: number | null;
  watermarkId: string | null;
  expiredAt: string | null;
  licenseStatus: string;
}
