import axiosClient from "./axiosClient";
import type { LibraryItemResponse } from "../responsemodel/LibraryItemResponse";

export const getUserLibrary = async (): Promise<LibraryItemResponse[]> => {
  const response = await axiosClient.get<LibraryItemResponse[]>("/users/library");
  return response.data;
};