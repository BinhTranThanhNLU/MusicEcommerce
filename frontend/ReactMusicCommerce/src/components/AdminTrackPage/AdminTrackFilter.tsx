import type React from "react";

interface Props {
  keyword: string;
  setKeyword: (value: string) => void;
  audioType: string;
  setAudioType: (value: string) => void;
  status: string;
  setStatus: (value: string) => void;
  onReset: () => void;
}

const AdminTrackFilter: React.FC<Props> = ({
  keyword,
  setKeyword,
  audioType,
  setAudioType,
  status,
  setStatus,
  onReset,
}) => {
  return (
    <div className="card border-0 shadow-sm rounded-4 mb-4">
      <div className="card-body p-4">
        <div className="d-flex flex-wrap gap-3 align-items-center justify-content-between">
          <div className="d-flex flex-wrap gap-3 flex-grow-1" style={{ maxWidth: "900px" }}>
            <div className="input-group" style={{ minWidth: "280px", flex: "1 1 320px" }}>
              <span className="input-group-text bg-light border-0">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                className="form-control bg-light border-0"
                placeholder="Tìm theo tên bài hát..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>

            <div className="input-group" style={{ minWidth: "220px", width: "220px" }}>
              <span className="input-group-text bg-light border-0">
                <i className="bi bi-music-note-list"></i>
              </span>
              <input
                type="text"
                className="form-control bg-light border-0"
                placeholder="Loại âm thanh"
                value={audioType}
                onChange={(e) => setAudioType(e.target.value)}
              />
            </div>

            <select
              className="form-select border-0 bg-light"
              style={{ width: "220px" }}
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="all">Mọi trạng thái</option>
              <option value="Pending">Đang chờ duyệt</option>
              <option value="Approved">Đã duyệt</option>
              <option value="Need Revision">Cần chỉnh sửa</option>
              <option value="Rejected">Bị từ chối</option>
            </select>
          </div>

          <button type="button" className="btn btn-outline-secondary rounded-pill px-3" onClick={onReset}>
            <i className="bi bi-arrow-counterclockwise me-2"></i>
            Đặt lại
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminTrackFilter;
