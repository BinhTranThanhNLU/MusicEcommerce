export interface AdminOrderDTO {
  orderId: number;
  userId: number;
  customerName: string;
  customerEmail: string;
  totalAmount: number;
  paymentStatus: string;
  paymentMethod: string;
  gatewayTransactionCode: string | null;
  createdAt: string;
  totalItems: number;
}
