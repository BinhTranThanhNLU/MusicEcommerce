import axiosClient from "./axiosClient";
import type { AdminUserPageResponse } from "../responsemodel/AdminUserPageResponse";
import type { AdminUserDetailModel } from "../models/AdminUserDetailModel";
import type { AdminUserOrderPageResponse } from "../responsemodel/AdminUserOrderPageResponse";
import type { AdminUserTrackPageResponse } from "../responsemodel/AdminUserTrackPageResponse";
import type { AdminOrderPageResponse } from "../responsemodel/AdminOrderPageResponse";
import type { AdminOrderWithDetailsDTO } from "../responsemodel/AdminOrderWithDetailsDTO";
import type { AdminDashboardOverviewDTO } from "../responsemodel/AdminDashboardOverviewDTO";
import type { AdminTopTrackDTO } from "../responsemodel/AdminTopTrackDTO";
import type { AdminReviewDashboardDTO } from "../responsemodel/AdminReviewDashboardDTO";
import type { CopyrightPageResponse } from "../responsemodel/CopyrightPageResponse";
import type { CopyrightInfoDTO } from "../models/CopyrightInfoDTO";
import type { UpdateCopyrightRequest } from "../requestmodel/UpdateCopyrightRequest";
import type { AudioTrackPageResponse } from "../responsemodel/AudioTrackPageResponse";
import type { AudioTrackDTO } from "../responsemodel/AudioTrackDTO";
import type { AdminAudioTrackPageResponse } from "../responsemodel/AdminAudioTrackPageResponse";
import type { ModerateAudioTrackRequest } from "../requestmodel/ModerateAudioTrackRequest";
import type { AdminLicensePageResponse } from "../responsemodel/AdminLicensePageResponse";
import type { AdminLicenseModel } from "../models/AdminLicenseModel";
import type { AudioTrackSearchResponse } from "../models/Search";

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

export const getAdminOrders = async (
  page = 0,
  size = 10,
  paymentStatus?: string,
): Promise<AdminOrderPageResponse> => {
  const params: any = { page, size };
  if (paymentStatus) params.paymentStatus = paymentStatus;

  const response = await axiosClient.get<AdminOrderPageResponse>("/admin/orders", {
    params,
  });
  return response.data;
};

export const getAdminOrderDetail = async (id: number): Promise<AdminOrderWithDetailsDTO> => {
  const response = await axiosClient.get<AdminOrderWithDetailsDTO>(`/admin/orders/${id}`);
  return response.data;
};

export const updateAdminOrderStatus = async (
  id: number,
  status: string,
): Promise<string> => {
  const response = await axiosClient.put<string>(`/admin/orders/${id}/status`, {
    status,
  });
  return response.data;
};

export const getAdminDashboardOverview = async (
  period = "month",
  points = 12,
): Promise<AdminDashboardOverviewDTO> => {
  const response = await axiosClient.get<AdminDashboardOverviewDTO>("/admin/dashboard/overview", {
    params: { period, points },
  });

  return response.data;
};

export const getAdminTopSellingTracks = async (
  limit = 5,
): Promise<AdminTopTrackDTO[]> => {
  const response = await axiosClient.get<AdminTopTrackDTO[]>("/admin/dashboard/top-selling", {
    params: { limit },
  });

  return response.data;
};

export const getAdminReviewDashboard = async (
  period = "month",
  points = 12,
): Promise<AdminReviewDashboardDTO> => {
  const response = await axiosClient.get<AdminReviewDashboardDTO>("/admin/dashboard/overview", {
    params: { period, points },
  });

  return response.data;
};

export const getPendingTracks = async (
  page = 0,
  size = 10,
): Promise<AudioTrackPageResponse> => {
  const response = await axiosClient.get<AudioTrackPageResponse>("/admin/tracks/pending", {
    params: { page, size },
  });

  return response.data;
};

export const getAdminAudioTracks = async (
  page = 0,
  size = 10,
  title?: string,
  audioType?: string,
  status?: string,
): Promise<AdminAudioTrackPageResponse> => {
  const params: Record<string, number | string> = { page, size };

  if (title) {
    params.title = title;
  }

  if (audioType && audioType !== "all") {
    params.audioType = audioType;
  }

  if (status && status !== "all") {
    params.status = status;
  }

  const response = await axiosClient.get<AdminAudioTrackPageResponse>("/admin/audio-tracks", {
    params,
  });

  return response.data;
};

export const softDeleteAdminAudioTrack = async (id: number): Promise<string> => {
  const response = await axiosClient.delete<string>(`/admin/audio-tracks/${id}`);
  return response.data;
};

export const restoreAdminAudioTrack = async (id: number): Promise<string> => {
  const response = await axiosClient.put<string>(`/admin/audio-tracks/${id}/restore`);
  return response.data;
};

export const getAdminAudioTrackDetail = async (id: number): Promise<AudioTrackDTO> => {
  const response = await axiosClient.get<AudioTrackDTO>(`/admin/audio-tracks/${id}`);
  return response.data;
};

export const getTrackModerationDetail = async (id: number): Promise<AudioTrackDTO> => {
  const response = await axiosClient.get<AudioTrackDTO>(`/admin/tracks/${id}`);
  return response.data;
};

export const approveTrack = async (id: number): Promise<AudioTrackDTO> => {
  const response = await axiosClient.put<AudioTrackDTO>(`/admin/tracks/${id}/approve`);
  return response.data;
};

export const rejectTrack = async (
  id: number,
  request: ModerateAudioTrackRequest,
): Promise<AudioTrackDTO> => {
  const response = await axiosClient.put<AudioTrackDTO>(`/admin/tracks/${id}/reject`, request);
  return response.data;
};

export const requestTrackRevision = async (
  id: number,
  request: ModerateAudioTrackRequest,
): Promise<AudioTrackDTO> => {
  const response = await axiosClient.put<AudioTrackDTO>(`/admin/tracks/${id}/need-revision`, request);
  return response.data;
};

export const checkCopyright = async (
  id: number,
): Promise<AudioTrackSearchResponse> => {
  const response = await axiosClient.get<AudioTrackSearchResponse>(`/admin/tracks/${id}/copyright-check`);
  return response.data;
};

export const getAdminCopyrights = async (
  page = 0,
  size = 10,
  audioId?: number,
  ownerName?: string,
): Promise<CopyrightPageResponse> => {
  const params: Record<string, number | string> = { page, size };

  if (audioId !== undefined && audioId !== null) {
    params.audioId = audioId;
  }

  if (ownerName) {
    params.ownerName = ownerName;
  }

  const response = await axiosClient.get<CopyrightPageResponse>("/admin/copyrights", {
    params,
  });

  return response.data;
};

export const getAdminCopyrightDetail = async (
  id: number,
): Promise<CopyrightInfoDTO> => {
  const response = await axiosClient.get<CopyrightInfoDTO>(`/admin/copyrights/${id}`);
  return response.data;
};

export const updateAdminCopyright = async (
  id: number,
  request: UpdateCopyrightRequest,
): Promise<CopyrightInfoDTO> => {
  const response = await axiosClient.put<CopyrightInfoDTO>(
    `/admin/copyrights/${id}`,
    request,
  );

  return response.data;
};

export const getAdminLicenses = async (
  page = 0,
  size = 10,
  search?: string,
  licenseType?: string,
  status?: string,
): Promise<AdminLicensePageResponse> => {
  const params: Record<string, number | string> = { page, size };

  if (search) {
    params.search = search;
  }

  if (licenseType && licenseType !== "all") {
    params.licenseType = licenseType;
  }

  if (status && status !== "all") {
    params.status = status;
  }

  const response = await axiosClient.get<AdminLicensePageResponse>("/admin/licenses", {
    params,
  });

  return response.data;
};

export const getAdminLicenseDetail = async (orderDetailId: number): Promise<AdminLicenseModel> => {
  const response = await axiosClient.get<AdminLicenseModel>(`/admin/licenses/${orderDetailId}`);
  return response.data;
};

export const revokeAdminLicense = async (orderDetailId: number): Promise<string> => {
  const response = await axiosClient.put<string>(`/admin/licenses/${orderDetailId}/revoke`);
  return response.data;
};