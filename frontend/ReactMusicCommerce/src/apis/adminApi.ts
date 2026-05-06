import axiosClient from "./axiosClient";
import type { AdminUserPageResponse } from "../responsemodel/AdminUserPageResponse";
import type { AdminUserDetailModel } from "../models/AdminUserDetailModel";
import type { AdminUserOrderPageResponse } from "../responsemodel/AdminUserOrderPageResponse";
import type { AdminUserTrackPageResponse } from "../responsemodel/AdminUserTrackPageResponse";

export const getAdminUsers = async (
  page: number,
  size: number,
  keyword?: string,
  role?: string,
  isActive?: boolean | string
): Promise<AdminUserPageResponse> => {
  const params: any = { page, size, role };
  if (keyword) params.keyword = keyword;
  if (isActive !== undefined && isActive !== "all") params.isActive = isActive;

  const response = await axiosClient.get<AdminUserPageResponse>("/admin/users", { params });
  return response.data;
};

export const toggleUserStatus = async (id: number, isActive: boolean): Promise<string> => {
  const response = await axiosClient.put<string>(`/admin/users/${id}/lock`, null, {
    params: { isActive },
  });
  return response.data;
};

export const getAdminUserDetail = async (id: number): Promise<AdminUserDetailModel> => {
  const response = await axiosClient.get<AdminUserDetailModel>(`/admin/users/${id}/detail`);
  return response.data;
};

export const getAdminUserOrders = async (
  id: number,
  page = 0,
  size = 10,
): Promise<AdminUserOrderPageResponse> => {
  const response = await axiosClient.get<AdminUserOrderPageResponse>(
    `/admin/users/${id}/orders`,
    {
      params: { page, size },
    },
  );
  return response.data;
};

export const getAdminUserTracks = async (
  id: number,
  page = 0,
  size = 10,
): Promise<AdminUserTrackPageResponse> => {
  const response = await axiosClient.get<AdminUserTrackPageResponse>(
    `/admin/users/${id}/tracks`,
    {
      params: { page, size },
    },
  );
  return response.data;
};