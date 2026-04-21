export interface CheckoutResponse {
  orderId: number;
  paymentStatus: string;
  paymentMethod: string;
  totalItems: number;
  totalAmount: number;
  createdAt: string;
  message: string;
}
