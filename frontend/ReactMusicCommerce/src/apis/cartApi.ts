import axiosClient from "./axiosClient";
import type { AddToCartRequest } from "../requestmodel/AddToCartRequest";
import type { UpdateCartItemLicenseRequest } from "../requestmodel/UpdateCartItemLicenseRequest";
import type { CartItemResponse } from "../responsemodel/CartItemResponse";
import type { CartResponse } from "../responsemodel/CartResponse";

export const addToCart = async (
  data: AddToCartRequest,
): Promise<CartItemResponse> => {
  const response = await axiosClient.post<CartItemResponse>("/cart/items", data);
  return response.data;
};

export const getCart = async (): Promise<CartResponse> => {
  const response = await axiosClient.get<CartResponse>("/cart");
  return response.data;
};

export const removeFromCart = async (cartItemId: number): Promise<string> => {
  const response = await axiosClient.delete<string>(`/cart/items/${cartItemId}`);
  return response.data;
};

export const deleteCart = async (): Promise<string> => {
  const response = await axiosClient.delete<string>("/cart");
  return response.data;
};

export const updateCartItemLicense = async (
  cartItemId: number,
  data: UpdateCartItemLicenseRequest,
): Promise<CartItemResponse> => {
  const response = await axiosClient.put<CartItemResponse>(
    `/cart/items/${cartItemId}/license`,
    data,
  );
  return response.data;
};
