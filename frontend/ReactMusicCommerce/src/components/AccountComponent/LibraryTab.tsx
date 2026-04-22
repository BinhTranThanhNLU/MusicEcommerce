import { useEffect, useMemo, useState } from "react";
import { getUserLibrary } from "../../apis/userApi";
import type { LibraryItemResponse } from "../../responsemodel/LibraryItemResponse";

const FALLBACK_COVER_IMAGE = "/assets/img/product/product-1.webp";

const formatDateTime = (value: string | null) => {
  if (!value) {
    return "Không xác định";
  }

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
};

const formatDuration = (durationInSeconds: number | null) => {
  if (!durationInSeconds || durationInSeconds <= 0) {
    return "--:--";
  }

  const minutes = Math.floor(durationInSeconds / 60);
  const seconds = durationInSeconds % 60;

  return `${minutes}:${String(seconds).padStart(2, "0")}`;
};

const resolveMediaUrl = (path: string | null) => {
  if (!path) {
    return FALLBACK_COVER_IMAGE;
  }

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  if (path.startsWith("/")) {
    return `http://localhost:8080${path}`;
  }

  return `http://localhost:8080/${path}`;
};

const LibraryTab = () => {
  const [libraryItems, setLibraryItems] = useState<LibraryItemResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadLibrary = async () => {
      try {
        setIsLoading(true);
        setErrorMessage(null);

        const items = await getUserLibrary();

        if (isMounted) {
          setLibraryItems(items);
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage("Không tải được thư viện cá nhân. Vui lòng thử lại.");
          setLibraryItems([]);
        }
        console.error("Failed to load user library:", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadLibrary();

    return () => {
      isMounted = false;
    };
  }, []);

  const hasItems = useMemo(() => libraryItems.length > 0, [libraryItems]);

  return (
    <div className="tab-pane fade show active" id="library">
      <div className="section-header" data-aos="fade-up">
        <h2>Thư viện nhạc cá nhân</h2>
        <div className="header-actions">
          <div className="search-box">
            <i className="bi bi-search"></i>
            <input type="text" placeholder="Tìm bài hát, nghệ sĩ..." disabled />
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="bg-white border rounded-4 p-4 text-center shadow-sm">
          <div className="spinner-border text-primary mb-3" role="status" aria-hidden="true" />
          <p className="mb-0 text-muted">Đang tải thư viện cá nhân...</p>
        </div>
      ) : errorMessage ? (
        <div className="bg-white border rounded-4 p-4 text-center shadow-sm">
          <i className="bi bi-exclamation-triangle text-danger fs-1 d-block mb-3"></i>
          <h5 className="mb-2">Không thể tải dữ liệu</h5>
          <p className="text-muted mb-0">{errorMessage}</p>
        </div>
      ) : !hasItems ? (
        <div className="bg-white border rounded-4 p-4 text-center shadow-sm">
          <i className="bi bi-music-note-list fs-1 text-muted d-block mb-3"></i>
          <h5 className="mb-2">Thư viện đang trống</h5>
          <p className="text-muted mb-0">
            Khi đơn hàng chuyển sang PAID, tài nguyên số sẽ xuất hiện tại đây.
          </p>
        </div>
      ) : (
        <div className="library-grid">
          {libraryItems.map((item, index) => (
            <div
              key={item.orderDetailId ?? `${item.audioId}-${index}`}
              className="library-card"
              data-aos="fade-up"
              data-aos-delay={100 + index * 100}
            >
              <div className="d-flex flex-column flex-md-row align-items-md-center gap-3 p-3 border rounded-4 mb-3 bg-white shadow-sm">
                <img
                  src={resolveMediaUrl(item.coverImage)}
                  alt={item.title}
                  className="rounded-3 flex-shrink-0"
                  width="96"
                  height="96"
                  style={{ objectFit: "cover" }}
                  onError={(event) => {
                    event.currentTarget.src = FALLBACK_COVER_IMAGE;
                  }}
                />

                <div className="flex-grow-1">
                  <div className="d-flex flex-column flex-lg-row justify-content-between gap-2 mb-2">
                    <div>
                      <h5 className="mb-1">{item.title}</h5>
                      <p className="text-muted mb-0 fs-6">
                        Nghệ sĩ: {item.artistName} | Loại: {item.audioType}
                      </p>
                    </div>

                    <div className="text-lg-end">
                      <div className="badge bg-primary mb-2">Giấy phép: {item.licenseType}</div>
                      <div className="small text-muted">
                        Mua lúc: {formatDateTime(item.purchasedAt)}
                      </div>
                    </div>
                  </div>

                  <div className="d-flex flex-wrap gap-2 text-muted small">
                    <span className="badge bg-light text-dark border">Thời lượng: {formatDuration(item.duration)}</span>
                    <span className="badge bg-light text-dark border">Mã đơn: #{item.orderId}</span>
                    <span className="badge bg-light text-dark border">#CT: {item.orderDetailId}</span>
                  </div>
                </div>

                <div className="d-flex flex-column gap-2 actions">
                  <a
                    className={`btn btn-outline-dark btn-sm ${!item.watermarkedFileUrl ? "disabled" : ""}`}
                    href={resolveMediaUrl(item.watermarkedFileUrl)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <i className="bi bi-play-fill"></i> Phát nhạc
                  </a>
                  <a
                    className={`btn btn-dark btn-sm ${!item.originalFileUrl ? "disabled" : ""}`}
                    href={resolveMediaUrl(item.originalFileUrl)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <i className="bi bi-download"></i> Tải gốc (.WAV/.MP3)
                  </a>
                  <button className="btn btn-outline-secondary btn-sm" type="button" disabled>
                    <i className="bi bi-file-earmark-pdf"></i> Giấy chứng nhận
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LibraryTab;
