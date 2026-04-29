export const FALLBACK_COVER_IMAGE = "/assets/img/product/product-1.webp";

export const resolveMediaUrl = (path: string | null | undefined) => {
  if (!path) return FALLBACK_COVER_IMAGE;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  if (path.startsWith("/")) return `http://localhost:8080${path}`;
  return `http://localhost:8080/${path}`;
};

export const formatDuration = (seconds?: number | null) => {
  if (!seconds || seconds <= 0) return "--:--";
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
};

export const formatCurrency = (value?: number | null) => {
  if (typeof value !== "number") return "Chưa thiết lập";
  return `${new Intl.NumberFormat("vi-VN").format(value)}₫`;
};

export const formatDateTime = (value?: string | null) => {
  if (!value) return "Không xác định";
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
};

export const getStatusTone = (status?: string | null) => {
  const normalized = status?.trim().toLowerCase();
  if (!normalized) return "secondary";
  if (["approved", "published", "active"].includes(normalized))
    return "success";
  if (["rejected", "inactive"].includes(normalized)) return "danger";
  if (["revision", "pending review"].includes(normalized)) return "warning";
  return "info";
};
