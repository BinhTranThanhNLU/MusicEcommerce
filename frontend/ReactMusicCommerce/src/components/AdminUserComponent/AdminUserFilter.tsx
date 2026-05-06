import React from "react";

interface Props {
  keyword: string;
  setKeyword: (val: string) => void;
  role: string;
  setRole: (val: string) => void;
  status: string;
  setStatus: (val: string) => void;
}

const AdminUserFilter: React.FC<Props> = ({
  keyword,
  setKeyword,
  role,
  setRole,
  status,
  setStatus,
}) => {
  return (
    <div className="card border-0 shadow-sm rounded-4 mb-4">
      <div className="card-body p-4 d-flex flex-wrap gap-3 align-items-center justify-content-between">
        <div className="d-flex gap-3 flex-grow-1" style={{ maxWidth: "700px" }}>
          <div className="input-group">
            <span className="input-group-text bg-light border-0">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className="form-control bg-light border-0"
              placeholder="Tìm tên, email tài khoản..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>
          <select
            className="form-select border-0 bg-light"
            style={{ width: "160px" }}
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="all">Tất cả vai trò</option>
            <option value="user">Người nghe</option>
            <option value="artist">Nghệ sĩ</option>
            <option value="admin">Quản trị viên</option>
          </select>
          <select
            className="form-select border-0 bg-light"
            style={{ width: "160px" }}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="all">Mọi trạng thái</option>
            <option value="true">Đang hoạt động</option>
            <option value="false">Bị khóa</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default AdminUserFilter;
