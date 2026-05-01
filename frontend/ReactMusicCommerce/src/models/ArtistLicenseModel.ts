export interface ArtistLicenseModel {
  orderDetailId: number;
  watermarkId: string;
  customerName: string;
  customerEmail: string;
  audioId: number;
  trackName: string;
  coverImage: string;
  licenseType: string;
  price: number;
  licenseStatus: string;
  issuedAt: string; // hoặc Date
  expiredAt: string | null; // hoặc Date | null
}