import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPendingTracks } from "../../apis/adminApi";
import type { AudioTrackModel } from "../../models/AudioTrackModel";
import { parseApiError } from "../../utils/apiError";

const PAGE_SIZE = 5;

const formatDateTime = (value: string) =>
  new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));

const formatDuration = (seconds: number) => {
  const safeSeconds = Math.max(0, seconds || 0);
  const minutes = Math.floor(safeSeconds / 60);
  const remainingSeconds = safeSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
};

const AdminPendingSongsTable = () => {
  const [tracks, setTracks] = useState<AudioTrackModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    const fetchTracks = async () => {
      setLoading(true);
      setErrorMessage(null);

      try {
        const response = await getPendingTracks(0, PAGE_SIZE);
        setTracks(response.tracks?.slice(0, PAGE_SIZE) ?? []);
        setTotalItems(response.totalItems ?? 0);
      } catch (error) {
        setTracks([]);
        setTotalItems(0);
        setErrorMessage(parseApiError(error, "Không thể tải danh sách bài hát chờ kiểm duyệt.").message);
      } finally {
        setLoading(false);
      }
    };

    void fetchTracks();
  }, []);

  return (
    <div className="card border-0 shadow-sm rounded-4 h-100 admin-dashboard-panel overflow-hidden">
      <div className="card-body p-0 d-flex flex-column">
        <div className="p-4 pb-3 d-flex flex-column flex-md-row justify-content-between align-items-md-start gap-3 border-bottom">
          <div>
            <div className="d-flex align-items-center gap-2 mb-2">
              <span className="admin-kicker-pill admin-kicker-violet">
                <i className="bi bi-music-note-beamed me-1"></i> Pending Review
              </span>
              <span className="badge rounded-pill text-bg-light border text-secondary">{totalItems || tracks.length} bài chờ duyệt</span>
            </div>
            <h5 className="fw-bold mb-1">Bài hát chờ kiểm duyệt</h5>
            <p className="text-muted mb-0 small">
              Danh sách rút gọn các nội dung vừa gửi lên để mở nhanh trang kiểm duyệt khi cần xử lý.
            </p>
          </div>

          <Link to="/admin/moderation" className="btn btn-sm btn-outline-dark rounded-pill px-3 text-nowrap">
            Xem tất cả <i className="bi bi-arrow-right ms-1"></i>
          </Link>
        </div>

        <div className="table-responsive flex-grow-1">
          <table className="table table-hover align-middle mb-0 admin-compact-table">
            <thead className="text-uppercase text-muted small admin-table-head">
              <tr>
                <th className="ps-4">Bài hát</th>
                <th>Nghệ sĩ</th>
                <th>Loại nội dung</th>
                <th className="text-end pe-4">Thông tin</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-5 text-center text-muted">
                    <div className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></div>
                    Đang tải bài chờ duyệt...
                  </td>
                </tr>
              ) : errorMessage ? (
                <tr>
                  <td colSpan={4} className="py-5 text-center text-muted">
                    {errorMessage}
                  </td>
                </tr>
              ) : tracks.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-5 text-center text-muted">
                    Chưa có nội dung nào đang chờ kiểm duyệt.
                  </td>
                </tr>
              ) : (
                tracks.map((song) => (
                <tr key={song.id}>
                  <td className="ps-4 py-3">
                    <div className="d-flex align-items-start gap-3">
                      <div className="admin-item-avatar admin-item-avatar-violet">
                        <i className="bi bi-music-note-list"></i>
                      </div>
                      <div>
                        <div className="fw-semibold text-dark">{song.title}</div>
                        <small className="text-muted">{formatDuration(song.duration)} • {song.playCount ?? 0} lượt nghe</small>
                      </div>
                    </div>
                  </td>
                  <td className="py-3">
                    <div className="fw-medium text-dark">{song.artist?.name || song.authorName || "-"}</div>
                    <small className="text-muted">{formatDateTime(song.uploadDate || "")}</small>
                  </td>
                  <td className="py-3">
                    <span className="badge rounded-pill px-3 py-2 bg-light text-dark border">{song.audioType || "-"}</span>
                  </td>
                  <td className="py-3 text-end pe-4">
                    <div className="text-muted small">{song.status || "Chờ duyệt"}</div>
                    <div className="text-muted small">{song.tags?.genres?.slice(0, 2).join(" / ") || "Chưa gắn thể loại"}</div>
                  </td>
                </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPendingSongsTable;