export interface CheckoutResponse {
  orderId: number;
  paymentStatus: string;
  paymentMethod: string;
  gatewayTransactionCode?: string | null;
  totalItems: number;
  totalAmount: number;
  createdAt: string;
  paymentUrl?: string | null;
  message: string;
}
