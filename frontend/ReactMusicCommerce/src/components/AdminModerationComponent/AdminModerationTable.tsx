import { SpinningLoading } from "../utils/SpinningLoading";
import type { PendingTrackListItem } from "./moderationUtils";
import { formatDateTime, formatDuration, getStatusMeta } from "./moderationUtils";

interface Props {
  tracks: PendingTrackListItem[];
  loading: boolean;
  page: number;
  totalPages: number;
  totalItems: number;
  keyword: string;
  onPageChange: (page: number | ((current: number) => number)) => void;
  onViewDetail: (trackId: number) => void;
  onApprove: (trackId: number) => void;
  onReject: (trackId: number) => void;
}

const AdminModerationTable = ({
  tracks,
  loading,
  page,
  totalPages,
  totalItems,
  keyword,
  onPageChange,
  onViewDetail,
  onApprove,
  onReject,
}: Props) => {
  const visibleCount = tracks.length;

  return (
    <div className="card border-0 shadow-sm rounded-4 overflow-hidden position-relative">
      {loading && (
        <div
          className="position-absolute top-0 start-0 w-100 h-100 bg-white bg-opacity-75 d-flex align-items-center justify-content-center"
          style={{ zIndex: 10 }}
        >
          <SpinningLoading />
        </div>
      )}

      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0">
          <thead className="table-light text-muted small text-uppercase">
            <tr>
              <th className="ps-4 py-3">Thông tin bài hát</th>
              <th>Nghệ sĩ</th>
              <th>Thể loại</th>
              <th>Ngày tải lên</th>
              <th>Trạng thái</th>
              <th className="text-center pe-4">Thao tác</th>
            </tr>
          </thead>
          <tbody className="bg-white border-top-0">
            {!loading && tracks.length === 0 && (
              <tr>
                <td colSpan={6} className="py-5 text-center text-muted">
                  Không có bài hát nào phù hợp với bộ lọc hiện tại.
                </td>
              </tr>
            )}

            {tracks.map((track) => {
              const artistName = track.artist?.name || track.authorName || "-";
              const genres = track.tags?.genres?.length ? track.tags.genres.join(" / ") : "Chưa gắn thể loại";
              const statusMeta = getStatusMeta(track.status);

              return (
                <tr key={track.id}>
                  <td className="ps-4 py-3">
                    <div className="d-flex align-items-center">
                      <div className="position-relative me-3">
                        {track.coverImage ? (
                          <img
                            src={track.coverImage}
                            alt={track.title}
                            className="rounded-3"
                            style={{ width: "48px", height: "48px", objectFit: "cover", backgroundColor: "#e2e8f0" }}
                          />
                        ) : (
                          <div className="rounded-3 d-flex justify-content-center align-items-center" style={{ width: "48px", height: "48px", backgroundColor: "#f1f5f9", color: "#64748b" }}>
                            <i className="bi bi-music-note-beamed fs-4"></i>
                          </div>
                        )}
                      </div>
                      <div>
                        <h6 className="mb-0 fw-bold" style={{ color: "#1e293b" }}>{track.title}</h6>
                        <small className="text-muted">{track.audioType} • {formatDuration(track.duration)} • {track.playCount ?? 0} lượt nghe</small>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="fw-medium text-dark">{artistName}</span>
                    <div><small className="text-muted">{track.authorName || ""}</small></div>
                  </td>
                  <td>
                    <span className="badge bg-light text-dark border">{genres}</span>
                  </td>
                  <td className="text-muted small">{formatDateTime(track.uploadDate)}</td>
                  <td>
                    <span className={`badge rounded-pill px-3 py-2 ${statusMeta.className}`}>{statusMeta.label}</span>
                  </td>
                  <td className="text-center pe-4">
                    <div className="d-flex justify-content-center gap-2 flex-wrap">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-primary rounded-pill"
                        onClick={() => onViewDetail(track.id)}
                      >
                        Chi tiết
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-success rounded-circle"
                        title="Phê duyệt"
                        style={{ width: "32px", height: "32px", padding: 0 }}
                        onClick={() => onApprove(track.id)}
                      >
                        <i className="bi bi-check-lg"></i>
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger rounded-circle"
                        title="Từ chối"
                        style={{ width: "32px", height: "32px", padding: 0 }}
                        onClick={() => onReject(track.id)}
                      >
                        <i className="bi bi-x-lg"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="card-footer bg-white p-3 d-flex flex-column flex-md-row gap-3 justify-content-between align-items-md-center border-top">
        <span className="text-muted small">
          Hiển thị {visibleCount > 0 ? page * 10 + 1 : 0}-{page * 10 + visibleCount} của {totalItems} bài hát
          {keyword.trim() ? " trong trang hiện tại" : ""}
        </span>
        <nav>
          <ul className="pagination pagination-sm mb-0">
            <li className={`page-item ${page === 0 ? "disabled" : ""}`}>
              <button className="page-link text-dark" onClick={() => onPageChange((current) => Math.max(0, current - 1))}>
                Trước
              </button>
            </li>
            <li className="page-item active">
              <span className="page-link" style={{ backgroundColor: "#4f46e5", borderColor: "#4f46e5" }}>
                {page + 1} / {totalPages || 1}
              </span>
            </li>
            <li className={`page-item ${page >= totalPages - 1 ? "disabled" : ""}`}>
              <button className="page-link text-dark" onClick={() => onPageChange((current) => current + 1)}>
                Sau
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default AdminModerationTable;