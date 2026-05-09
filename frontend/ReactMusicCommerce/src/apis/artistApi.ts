import type { ArtistDashboardSummaryModel } from "../models/ArtistDashboardSummaryModel";
import type { ArtistLicenseStatsModel } from "../models/ArtistLicenseStatsModel";
import type { ArtistModel } from "../models/ArtistModel";
import type { ArtistRevenueSummaryModel } from "../models/ArtistRevenueSummaryModel";
import type { ArtistLicensePageResponse } from "../responsemodel/ArtistLicensePageResponse";
import type { AudioTrackPageResponse } from "../responsemodel/AudioTrackPageResponse";
import type { TransactionPageResponse } from "../responsemodel/TransactionPageResponse";
import axiosClient from "./axiosClient";

export const getAllArtists = async (): Promise<ArtistModel[]> => {
  const response = await axiosClient.get("/artists");
  return response.data;
};

// Lấy dữ liệu Dashboard tổng quan
export const getDashboardSummary = async (): Promise<ArtistDashboardSummaryModel> => {
  const response = await axiosClient.get("/artists/me/dashboard/summary");
  return response.data;
};

// Lấy danh sách track của nghệ sĩ đang đăng nhập (Artist Dashboard)
export const getMyTracks = async (
  page: number = 0,
  size: number = 10,
  keyword?: string,
  genreName?: string,
  status: string = "all"
): Promise<AudioTrackPageResponse> => {
  const response = await axiosClient.get("/artists/me/tracks", {
    params: { 
      page, 
      size, 
      keyword: keyword || undefined, 
      genreName: genreName === "all" ? undefined : genreName, 
      status 
    },
  });
  return response.data;
};

// Lấy danh sách giấy phép của nghệ sĩ (có phân trang và lọc)
export const getMyLicenses = async (
  page: number = 0,
  size: number = 10,
  search?: string,
  licenseType?: string,
  status?: string
): Promise<ArtistLicensePageResponse> => {
  const response = await axiosClient.get("/artists/me/licenses", {
    params: { page, size, search, licenseType, status },
  });
  return response.data;
};

// Lấy thống kê giấy phép
export const getMyLicenseStats = async (): Promise<ArtistLicenseStatsModel> => {
  const response = await axiosClient.get("/artists/me/licenses/stats");
  return response.data;
};

// Tải chứng chỉ PDF cho nghệ sĩ
export const downloadCertificateForArtist = async (orderDetailId: number): Promise<void> => {
  const response = await axiosClient.get(
    `/artists/me/licenses/${orderDetailId}/certificate`,
    {
      responseType: 'blob', // Quan trọng: Yêu cầu Axios trả về dạng blob cho file
    }
  );

  // Xử lý tạo link và tự động click để tải file
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  
  // Lấy tên file từ header (nếu backend có gửi) hoặc tự đặt tên
  const contentDisposition = response.headers['content-disposition'];
  let fileName = 'ArtistCopy-Certificate.pdf';
  if (contentDisposition) {
    const fileNameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
    if (fileNameMatch && fileNameMatch.length === 2) {
      fileName = fileNameMatch[1];
    }
  }
  
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

// Lấy tổng quan doanh thu của nghệ sĩ
export const getMyRevenueSummary = async (): Promise<ArtistRevenueSummaryModel> => {
  const response = await axiosClient.get("/artists/me/revenue/summary");
  return response.data;
};

// Lấy lịch sử giao dịch có phân trang
export const getMyTransactions = async (
  page: number = 0,
  size: number = 5 // Lấy 5 dòng 1 trang cho vừa vặn layout
): Promise<TransactionPageResponse> => {
  const response = await axiosClient.get("/artists/me/transactions", {
    params: { page, size },
  });
  return response.data;
};

