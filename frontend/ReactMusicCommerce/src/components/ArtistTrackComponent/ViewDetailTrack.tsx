import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAudioTrackById } from "../../apis/audioTrackApi";
import type { AudioTrackModel } from "../../models/AudioTrackModel";
import "../../assets/css/artistDashboard.css";

const FALLBACK_COVER_IMAGE = "/assets/img/product/product-1.webp";

const resolveMediaUrl = (path: string | null | undefined) => {
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

const formatDuration = (seconds?: number | null) => {
  if (!seconds || seconds <= 0) {
    return "--:--";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
};

const formatCurrency = (value?: number | null) => {
  if (typeof value !== "number") {
    return "Chưa thiết lập";
  }

  return `${new Intl.NumberFormat("vi-VN").format(value)}₫`;
};

const formatDateTime = (value?: string | null) => {
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

const getStatusTone = (status?: string | null) => {
  const normalized = status?.trim().toLowerCase();

  if (!normalized) {
    return "secondary";
  }

  if (["approved", "published", "active"].includes(normalized)) {
    return "success";
  }

  if (["rejected", "inactive"].includes(normalized)) {
    return "danger";
  }

  if (["revision", "pending review"].includes(normalized)) {
    return "warning";
  }

  return "info";
};

const ViewDetailTrack = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [track, setTrack] = useState<AudioTrackModel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadTrack = async () => {
      const trackId = Number(id);

      if (!id || Number.isNaN(trackId)) {
        setErrorMessage("Thiếu hoặc sai ID tác phẩm.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setErrorMessage(null);
        const data = await getAudioTrackById(trackId);
        setTrack(data);
      } catch (error: any) {
        setErrorMessage(
          error?.response?.data?.message ||
            error?.message ||
            "Không thể tải chi tiết tác phẩm.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    void loadTrack();
  }, [id]);

  if (isLoading) {
    return (
      <div className="container-fluid py-4 px-lg-4">
        <div className="card border-0 shadow-sm rounded-4">
          <div className="card-body py-5 text-center">
            <div className="spinner-border text-primary mb-3" role="status" aria-hidden="true" />
            <p className="mb-0 text-muted">Đang tải chi tiết tác phẩm...</p>
          </div>
        </div>
      </div>
    );
  }

  if (errorMessage || !track) {
    return (
      <div className="container-fluid py-4 px-lg-4">
        <div className="alert alert-danger border-0 shadow-sm rounded-4 d-flex justify-content-between align-items-center">
          <div>{errorMessage || "Không tìm thấy tác phẩm."}</div>
          <button className="btn btn-outline-danger" onClick={() => navigate("/artist/tracks")}>Quay lại</button>
        </div>
      </div>
    );
  }

  const statusText = track.status ?? (track.uploadDate ? "approved" : "pending");
  const statusTone = getStatusTone(statusText);

  return (
    <div className="container-fluid py-4 px-lg-4">
      <div className="d-flex justify-content-between align-items-end mb-4">
        <div>
          <h3 className="fw-bold mb-1" style={{ color: "var(--heading-color)", fontFamily: "var(--heading-font)" }}>
            Chi tiết tác phẩm
          </h3>
          <p className="text-muted mb-0">Xem toàn bộ thông tin, file đính kèm và trạng thái xuất bản.</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary rounded-pill px-4" onClick={() => navigate("/artist/tracks")}>
            <i className="bi bi-arrow-left me-2"></i> Quay lại
          </button>
          <button className="btn rounded-pill px-4 shadow-sm text-white" style={{ backgroundColor: "var(--accent-color)" }} onClick={() => navigate(`/artist/tracks/update/${track.id}`)}>
            <i className="bi bi-pencil-square me-2"></i> Cập nhật
          </button>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 overflow-hidden h-100">
            <img
              src={resolveMediaUrl(track.coverImage)}
              alt={track.title}
              className="w-100"
              style={{ aspectRatio: "1 / 1", objectFit: "cover" }}
            />
            <div className="card-body p-4">
              <span className={`badge rounded-pill px-3 py-2 bg-${statusTone} bg-opacity-10 text-${statusTone} border border-${statusTone} border-opacity-25 mb-3`}>
                {track.status ?? (track.uploadDate ? "Đang xuất bản" : "Đang chờ duyệt")}
              </span>
              <h4 className="fw-bold mb-2">{track.title}</h4>
              <p className="text-muted mb-3">{track.description || "Chưa có mô tả cho tác phẩm này."}</p>

              <div className="d-flex flex-wrap gap-2 mb-3">
                <span className="badge bg-light text-dark border">{track.audioType}</span>
                <span className="badge bg-light text-dark border">{formatDuration(track.duration)}</span>
                <span className="badge bg-light text-dark border">{track.artist?.name}</span>
              </div>

              <div className="d-grid gap-2">
                <a className="btn btn-outline-primary" href={resolveMediaUrl(track.watermarkedFileUrl)} target="_blank" rel="noreferrer">
                  <i className="bi bi-play-circle me-2"></i> Mở file nghe thử
                </a>
                <a className="btn btn-outline-secondary" href={resolveMediaUrl(track.originalFileUrl ?? null)} target="_blank" rel="noreferrer">
                  <i className="bi bi-file-earmark-music me-2"></i> Mở file gốc
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-8">
          <div className="row g-4 mb-4">
            <div className="col-md-3">
              <div className="card border-0 shadow-sm rounded-4 h-100">
                <div className="card-body text-center py-4">
                  <div className="display-6 fw-bold text-primary">{track.playCount ?? 0}</div>
                  <div className="text-muted small">Lượt nghe thử</div>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card border-0 shadow-sm rounded-4 h-100">
                <div className="card-body text-center py-4">
                  <div className="display-6 fw-bold text-warning">{track.reviewCount ?? 0}</div>
                  <div className="text-muted small">Lượt đánh giá</div>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card border-0 shadow-sm rounded-4 h-100">
                <div className="card-body text-center py-4">
                  <div className="display-6 fw-bold text-success">{track.averageRating?.toFixed(1) ?? "-"}</div>
                  <div className="text-muted small">Điểm trung bình</div>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card border-0 shadow-sm rounded-4 h-100">
                <div className="card-body text-center py-4">
                  <div className="display-6 fw-bold text-dark">{formatDuration(track.duration)}</div>
                  <div className="text-muted small">Thời lượng</div>
                </div>
              </div>
            </div>
          </div>

          <div className="card border-0 shadow-sm rounded-4 mb-4">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-3">Thông tin cơ bản</h5>
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="small text-muted">Nghệ sĩ</div>
                  <div className="fw-medium">{track.artist?.name}</div>
                </div>
                <div className="col-md-6">
                  <div className="small text-muted">Ngày đăng</div>
                  <div className="fw-medium">{formatDateTime(track.uploadDate)}</div>
                </div>
                <div className="col-md-6">
                  <div className="small text-muted">Loại âm thanh</div>
                  <div className="fw-medium">{track.audioType}</div>
                </div>
                <div className="col-md-6">
                  <div className="small text-muted">Giá khởi điểm</div>
                  <div className="fw-medium">{formatCurrency(track.startingPrice)}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="card border-0 shadow-sm rounded-4 mb-4">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-3">File và liên kết</h5>
              <div className="list-group list-group-flush">
                <div className="list-group-item px-0 d-flex justify-content-between align-items-center">
                  <span>File gốc</span>
                  <a href={resolveMediaUrl(track.originalFileUrl ?? null)} target="_blank" rel="noreferrer">Mở file</a>
                </div>
                <div className="list-group-item px-0 d-flex justify-content-between align-items-center">
                  <span>File nghe thử</span>
                  <a href={resolveMediaUrl(track.watermarkedFileUrl)} target="_blank" rel="noreferrer">Mở file</a>
                </div>
                <div className="list-group-item px-0 d-flex justify-content-between align-items-center">
                  <span>Ảnh bìa</span>
                  <a href={resolveMediaUrl(track.coverImage)} target="_blank" rel="noreferrer">Mở ảnh</a>
                </div>
              </div>
            </div>
          </div>

          <div className="row g-4">
            <div className="col-lg-6">
              <div className="card border-0 shadow-sm rounded-4 h-100">
                <div className="card-body p-4">
                  <h5 className="fw-bold mb-3">Mô tả</h5>
                  <p className="text-muted mb-0" style={{ whiteSpace: "pre-line" }}>
                    {track.description || "Chưa có mô tả."}
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="card border-0 shadow-sm rounded-4 h-100">
                <div className="card-body p-4">
                  <h5 className="fw-bold mb-3">Lời bài hát</h5>
                  <p className="text-muted mb-0" style={{ whiteSpace: "pre-line" }}>
                    {track.lyrics || "Chưa có lời bài hát."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="card border-0 shadow-sm rounded-4 mt-4">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-3">Tags và thể loại</h5>
              <div className="d-flex flex-wrap gap-2">
                {(track.tags?.genres ?? []).map((genre) => (
                  <span key={`detail-genre-${genre}`} className="badge bg-secondary bg-opacity-10 text-secondary border fw-normal">
                    {genre}
                  </span>
                ))}
                {(track.tags?.moods ?? []).map((mood) => (
                  <span key={`detail-mood-${mood}`} className="badge bg-info bg-opacity-10 text-info border border-info border-opacity-25 fw-normal">
                    {mood}
                  </span>
                ))}
                {!(track.tags?.genres?.length || track.tags?.moods?.length) && (
                  <span className="text-muted">Chưa có metadata.</span>
                )}
              </div>
            </div>
          </div>

          <div className="card border-0 shadow-sm rounded-4 mt-4">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-3">Giấy phép</h5>
              <div className="row g-3">
                {(track.licenses ?? []).map((license) => (
                  <div className="col-md-4" key={license.licenseId}>
                    <div className="border rounded-3 p-3 h-100">
                      <div className="fw-bold mb-1">{license.licenseType}</div>
                      <div className="text-muted small mb-2">{license.description || "Không có mô tả."}</div>
                      <div className="fw-semibold">{formatCurrency(license.price)}</div>
                    </div>
                  </div>
                ))}
                {(!track.licenses || track.licenses.length === 0) && (
                  <div className="col-12 text-muted">Tác phẩm này chưa có giấy phép.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewDetailTrack;
