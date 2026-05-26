export interface AdminLicenseModel {
  orderDetailId: number;
  orderId: number | null;
  audioId: number | null;
  trackName: string | null;
  artistName: string | null;
  customerName: string | null;
  customerEmail: string | null;
  coverImage: string | null;
  watermarkId: string | null;
  licenseType: string | null;
  price: number | null;
  licenseStatus: string | null;
  paymentStatus: string | null;
  issuedAt: string | null;
  expiredAt: string | null;
}