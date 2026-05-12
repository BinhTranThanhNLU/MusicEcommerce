import type { AudioTrackModel } from "../../models/AudioTrackModel";

export type ModerationMode = "reject" | "revision";

export type PendingTrackListItem = AudioTrackModel & {
  authorName?: string;
  status?: string | null;
  moderationDecision?: string | null;
  rejectionReason?: string | null;
  revisionPoints?: string[] | null;
  moderatedAt?: string | null;
  moderatedBy?: string | null;
};

export const formatDateTime = (value?: string | null) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

export const formatDuration = (seconds?: number | null) => {
  if (!seconds || seconds < 0) {
    return "-";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
};

export const parseRevisionPoints = (value: string) => {
  return value
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
};

export const getStatusMeta = (status?: string | null) => {
  const normalized = (status || "PENDING").toUpperCase();

  if (normalized.includes("APPROV")) {
    return {
      className: "bg-success bg-opacity-10 text-success border border-success-subtle",
      label: "Đã duyệt",
    };
  }

  if (normalized.includes("REJECT")) {
    return {
      className: "bg-danger bg-opacity-10 text-danger border border-danger-subtle",
      label: "Đã từ chối",
    };
  }

  if (normalized.includes("NEED REVISION")) {
    return {
      className: "bg-warning bg-opacity-10 text-warning border border-warning-subtle",
      label: "Yêu cầu chỉnh sửa",
    };
  }

  return {
    className: "bg-warning bg-opacity-10 text-warning border border-warning-subtle",
    label: "Chờ duyệt",
  };
};