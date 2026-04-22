import axiosClient from "./axiosClient";
import axios from "axios";
import type { LibraryItemResponse } from "../responsemodel/LibraryItemResponse";

export const getUserLibrary = async (): Promise<LibraryItemResponse[]> => {
  const response = await axiosClient.get<LibraryItemResponse[]>("/users/library");
  return response.data;
};

const decodeFileName = (rawFileName: string) => {
  try {
    return decodeURIComponent(rawFileName.replace(/\+/g, "%20"));
  } catch {
    return rawFileName;
  }
};

const getFileNameFromContentDisposition = (headerValue?: string) => {
  if (!headerValue) {
    return null;
  }

  const utf8Match = headerValue.match(/filename\*=UTF-8''([^;]+)/i);
  if (utf8Match?.[1]) {
    return decodeFileName(utf8Match[1]);
  }

  const asciiMatch = headerValue.match(/filename="?([^";]+)"?/i);
  if (asciiMatch?.[1]) {
    return asciiMatch[1];
  }

  return null;
};

export interface CertificateDownloadResponse {
  blob: Blob;
  fileName: string;
}

const parseErrorBlobMessage = async (errorBlob?: Blob) => {
  if (!errorBlob) {
    return null;
  }

  const raw = (await errorBlob.text()).trim();
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as {
      message?: string;
      error?: string;
      details?: string;
    };
    return parsed.message ?? parsed.error ?? parsed.details ?? raw;
  } catch {
    return raw;
  }
};

export const downloadCertificate = async (
  certificateDownloadUrl: string,
): Promise<CertificateDownloadResponse> => {
  try {
    const response = await axiosClient.get<Blob>(certificateDownloadUrl, {
      responseType: "blob",
    });

    const headerValue = response.headers["content-disposition"] as string | undefined;
    const fileName = getFileNameFromContentDisposition(headerValue) ?? "chung-nhan-ban-quyen.pdf";

    return {
      blob: response.data,
      fileName,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const messageFromBody = await parseErrorBlobMessage(error.response?.data as Blob | undefined);
      const status = error.response?.status;
      const normalizedMessage = messageFromBody
        ? `(${status ?? "ERR"}) ${messageFromBody}`
        : `(${status ?? "ERR"}) Không thể tải giấy chứng nhận từ máy chủ.`;
      throw new Error(normalizedMessage);
    }

    throw new Error("Không thể tải giấy chứng nhận từ máy chủ.");
  }
};