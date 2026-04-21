import type { CartItemResponse } from "../responsemodel/CartItemResponse";

export interface CartItemViewModel extends CartItemResponse {
  coverImage?: string;
  artistName?: string;
  audioType?: string;
  durationSeconds?: number;
}