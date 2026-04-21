import type { CartItemDetailResponse } from "./CartItemDetailResponse";

export interface CartResponse {
  cartId: number;
  userId: number;
  items: CartItemDetailResponse[];
  totalPrice: number;
  totalItems: number;
}