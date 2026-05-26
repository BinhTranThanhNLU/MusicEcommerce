import Swal from "sweetalert2";
import type { AudioTrackDTO } from "../../responsemodel/AudioTrackDTO";

interface Props {
  tracks: AudioTrackDTO[];
  loading: boolean;
  onDeleteTrack: (track: AudioTrackDTO) => Promise<void> | void;
  onViewDetail: (trackId: number) => void;
}

const formatCurrency = (value?: number | null) => {
  if (typeof value !== "number") {
    return "Chưa thiết lập";
  }

  return new Intl.NumberFormat("vi-VN").format(value) + " ₫";
};

const formatDuration = (duration?: number | null) => {
  if (typeof duration !== "number" || Number.isNaN(duration) || duration <= 0) {
    return "00:00";
  }

  const totalSeconds = Math.floor(duration);
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
};

const getStatusMeta = (status?: string | null) => {
  const normalizedStatus = status?.trim().toUpperCase() || "PENDING";

  if (normalizedStatus === "APPROVED") {
    return {
      label: "Đã duyệt",
      className: "bg-success bg-opacity-10 text-success border border-success border-opacity-25",
      icon: "bi-check-circle-fill",
    };
  }

  if (normalizedStatus === "PENDING") {
    return {
      label: "Đang chờ duyệt",
      className: "bg-warning bg-opacity-10 text-warning border border-warning border-opacity-25",
      icon: "bi-hourglass-split",
    };
  }

  if (normalizedStatus === "NEED REVISION") {
    return {
      label: "Cần chỉnh sửa",
      className: "bg-info bg-opacity-10 text-info border border-info border-opacity-25",
      icon: "bi-pencil-fill",
    };
  }

  if (normalizedStatus === "REJECTED") {
    return {
      label: "Bị từ chối",
      className: "bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25",
      icon: "bi-x-circle-fill",
    };
  }

  return {
    label: status || "Không xác định",
    className: "bg-secondary bg-opacity-10 text-secondary border border-secondary border-opacity-25",
    icon: "bi-question-circle-fill",
  };
};

const AdminTrackTable = ({ tracks, loading, onDeleteTrack, onViewDetail }: Props) => {
  const handleDelete = async (track: AudioTrackDTO) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "Xóa mềm bài hát?",
      text: `Bài hát \"${track.title}\" sẽ bị ẩn khỏi danh sách quản trị nhưng vẫn có thể khôi phục sau này.`,
      showCancelButton: true,
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
    });

    if (!result.isConfirmed) {
      return;
    }

    await onDeleteTrack(track);
  };

  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle mb-0">
        <thead className="table-light text-muted small text-uppercase">
          <tr>
            <th className="ps-4 py-3" style={{ width: "34%" }}>
              Bài hát
            </th>
            <th>Nghệ sĩ</th>
            <th>Loại / Thống kê</th>
            <th>Trạng thái</th>
            <th className="text-center pe-4">Thao tác</th>
          </tr>
        </thead>
        <tbody className="bg-white border-top-0">
          {loading ? (
            <tr>
              <td colSpan={5} className="text-center py-5">
                <div className="spinner-border text-dark mb-3" role="status"></div>
                <p className="mb-0 text-muted">Đang tải danh sách bài hát...</p>
              </td>
            </tr>
          ) : tracks.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center py-5 text-muted">
                Không tìm thấy bài hát nào phù hợp với bộ lọc hiện tại.
              </td>
            </tr>
          ) : (
            tracks.map((track) => {
              const statusMeta = getStatusMeta(track.status);
              const artistName = track.artist?.name || track.authorName || "-";
              const genres = track.tags?.genres?.length ? track.tags.genres.slice(0, 2).join(" • ") : "Chưa gắn thể loại";

              return (
                <tr key={track.id}>
                  <td className="ps-4 py-3">
                    <div className="d-flex align-items-center gap-3">
                      <img
                        src={track.coverImage || "https://placehold.co/72x72?text=Track"}
                        alt={track.title}
                        className="rounded-3"
                        style={{ width: "56px", height: "56px", objectFit: "cover", backgroundColor: "#e2e8f0" }}
                      />
                      <div>
                        <h6 className="mb-1 fw-bold" style={{ color: "#1e293b" }}>
                          {track.title}
                        </h6>
                        <div className="d-flex flex-wrap gap-2">
                          <span className="badge bg-light text-dark border fw-normal">{formatDuration(track.duration)}</span>
                          <span className="badge bg-light text-dark border fw-normal">{track.playCount ?? 0} lượt nghe</span>
                          <span className="badge bg-light text-dark border fw-normal">{formatCurrency(track.startingPrice)}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="fw-medium text-dark">{artistName}</div>
                    <small className="text-muted">{track.audioType || "Chưa xác định"}</small>
                  </td>
                  <td>
                    <div className="d-flex flex-column gap-1">
                      <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 rounded-pill px-3 py-2 align-self-start">
                        {genres}
                      </span>
                      <small className="text-muted">
                        {track.reviewCount ?? 0} đánh giá · {formatDate(track.uploadDate)}
                      </small>
                    </div>
                  </td>
                  <td>
                    <span className={`badge rounded-pill px-3 py-2 ${statusMeta.className}`}>
                      <i className={`bi ${statusMeta.icon} me-1`}></i>
                      {statusMeta.label}
                    </span>
                  </td>
                  <td className="text-center pe-4">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary rounded-pill px-3 me-2"
                      title="Xem chi tiết"
                      onClick={() => onViewDetail(track.id)}
                    >
                      <i className="bi bi-eye me-1"></i>
                      Xem
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-light rounded-pill px-3"
                      title="Xóa mềm bài hát"
                      onClick={() => void handleDelete(track)}
                    >
                      <i className="bi bi-trash text-danger me-1"></i>
                      Xóa
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

const formatDate = (value?: string | null) => {
  if (!value) {
    return "Chưa có ngày tải lên";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Chưa có ngày tải lên";
  }

  return date.toLocaleDateString("vi-VN");
};

export default AdminTrackTable;
