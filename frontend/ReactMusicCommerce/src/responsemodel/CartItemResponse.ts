export interface CartItemResponse {
  cartId: number;
  cartItemId: number;
  audioId: number;
  audioTitle: string;
  licenseId: number;
  licenseType: string;
  licenseDescription: string;
  price: number;
  alreadyInCart: boolean;
}