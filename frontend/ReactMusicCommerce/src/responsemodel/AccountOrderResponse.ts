export interface AccountOrderItemResponse {
  orderDetailId: number;
  audioId: number;
  title: string;
  audioType: string;
  artistName: string;
  coverImage: string | null;
  licenseType: string;
  price: number;
  duration: number | null;
  musicDownloadUrl: string | null;
  certificateDownloadUrl: string | null;
  reviewId: number | null;
  reviewRating: number | null;
  reviewComment: string | null;
  reviewSubmitted: boolean | null;
}

export interface AccountOrderResponse {
  orderId: number;
  paymentStatus: string;
  paymentMethod: string;
  gatewayTransactionCode: string | null;
  totalAmount: number;
  createdAt: string;
  totalItems: number;
  items: AccountOrderItemResponse[];
}