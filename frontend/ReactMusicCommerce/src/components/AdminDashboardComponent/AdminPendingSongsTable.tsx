import { Link } from "react-router-dom";

type SongKind = "Bài hát hoàn chỉnh" | "Nhạc không lời" | "Đoạn âm thanh ngắn";

interface PendingSong {
  id: number;
  title: string;
  artist: string;
  kind: SongKind;
  submittedAt: string;
  duration: string;
  fileType: string;
}

const pendingSongs: PendingSong[] = [
  {
    id: 1,
    title: "Making My Way",
    artist: "Sơn Tùng M-TP",
    kind: "Bài hát hoàn chỉnh",
    submittedAt: "2026-05-07T09:05:00",
    duration: "03:42",
    fileType: "FLAC",
  },
  {
    id: 2,
    title: "Night Drive Loop",
    artist: "Lofi Lab",
    kind: "Nhạc không lời",
    submittedAt: "2026-05-07T08:10:00",
    duration: "02:18",
    fileType: "WAV",
  },
  {
    id: 3,
    title: "City Pulse Intro",
    artist: "Blueframe",
    kind: "Đoạn âm thanh ngắn",
    submittedAt: "2026-05-06T21:44:00",
    duration: "00:34",
    fileType: "MP3",
  },
  {
    id: 4,
    title: "Ngủ Một Mình",
    artist: "HIEUTHUHAI",
    kind: "Bài hát hoàn chỉnh",
    submittedAt: "2026-05-06T19:27:00",
    duration: "03:08",
    fileType: "WAV",
  },
  {
    id: 5,
    title: "Ocean Keys",
    artist: "NOVA Studio",
    kind: "Nhạc không lời",
    submittedAt: "2026-05-06T16:55:00",
    duration: "01:57",
    fileType: "FLAC",
  },
];

const formatDateTime = (value: string) =>
  new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));

const kindClassMap: Record<SongKind, string> = {
  "Bài hát hoàn chỉnh": "bg-primary bg-opacity-10 text-primary border border-primary-subtle",
  "Nhạc không lời": "bg-info bg-opacity-10 text-info border border-info-subtle",
  "Đoạn âm thanh ngắn": "bg-secondary bg-opacity-10 text-secondary border border-secondary-subtle",
};

const AdminPendingSongsTable = () => {
  return (
    <div className="card border-0 shadow-sm rounded-4 h-100 admin-dashboard-panel overflow-hidden">
      <div className="card-body p-0 d-flex flex-column">
        <div className="p-4 pb-3 d-flex flex-column flex-md-row justify-content-between align-items-md-start gap-3 border-bottom">
          <div>
            <div className="d-flex align-items-center gap-2 mb-2">
              <span className="admin-kicker-pill admin-kicker-violet">
                <i className="bi bi-music-note-beamed me-1"></i> Pending Review
              </span>
              <span className="badge rounded-pill text-bg-light border text-secondary">5 bài gần nhất</span>
            </div>
            <h5 className="fw-bold mb-1">Bài hát chờ kiểm duyệt</h5>
            <p className="text-muted mb-0 small">
              Danh sách rút gọn các nội dung vừa gửi lên, giúp admin ưu tiên duyệt nhanh phần đang chờ xuất bản.
            </p>
          </div>

          <Link to="/admin/content" className="btn btn-sm btn-outline-dark rounded-pill px-3 text-nowrap">
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
                <th>Gửi lúc</th>
                <th className="text-end pe-4">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {pendingSongs.map((song) => (
                <tr key={song.id}>
                  <td className="ps-4 py-3">
                    <div className="d-flex align-items-start gap-3">
                      <div className="admin-item-avatar admin-item-avatar-violet">
                        <i className="bi bi-music-note-list"></i>
                      </div>
                      <div>
                        <div className="fw-semibold text-dark">{song.title}</div>
                        <small className="text-muted">{song.fileType} • {song.duration}</small>
                      </div>
                    </div>
                  </td>
                  <td className="py-3">
                    <div className="fw-medium text-dark">{song.artist}</div>
                    <small className="text-muted">Đang chờ duyệt</small>
                  </td>
                  <td className="py-3">
                    <span className={`badge rounded-pill px-3 py-2 ${kindClassMap[song.kind]}`}>{song.kind}</span>
                  </td>
                  <td className="py-3 text-muted small">{formatDateTime(song.submittedAt)}</td>
                  <td className="py-3 text-end pe-4">
                    <Link to="/admin/content" className="btn btn-sm btn-outline-primary rounded-pill">
                      Mở kiểm duyệt
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPendingSongsTable;