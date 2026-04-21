import axiosClient from "./axiosClient";
import type { CheckoutRequest } from "../requestmodel/CheckoutRequest";
import type { CheckoutResponse } from "../responsemodel/CheckoutResponse";

export const checkoutOrder = async (
  data?: CheckoutRequest,
): Promise<CheckoutResponse> => {
  const response = await axiosClient.post<CheckoutResponse>("/orders/checkout", data);
  return response.data;
};