import type { CopyrightInfoDTO } from "../../models/CopyrightInfoDTO";
import { SpinningLoading } from "../utils/SpinningLoading";

interface Props {
  items: CopyrightInfoDTO[];
  loading: boolean;
  page: number;
  totalPages: number;
  totalItems: number;
  onView: (id: number) => void;
  onEdit: (id: number) => void;
  onPageChange: (page: number | ((current: number) => number)) => void;
}

const formatDateTime = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleString("vi-VN");
};

const AdminCopyrightTable = ({
  items,
  loading,
  page,
  totalPages,
  totalItems,
  onView,
  onEdit,
  onPageChange,
}: Props) => {
  return (
    <div className="card border-0 shadow-sm rounded-4 overflow-hidden position-relative">
      {loading && (
        <div
          className="position-absolute w-100 h-100 d-flex justify-content-center align-items-center bg-white bg-opacity-75"
          style={{ zIndex: 10 }}
        >
          <SpinningLoading />
        </div>
      )}

      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0">
          <thead className="table-light text-muted small text-uppercase">
            <tr>
              <th className="ps-4">Bản ghi</th>
              <th>Bài hát</th>
              <th>Nghệ sĩ</th>
              <th>Chủ sở hữu</th>
              <th>ISRC</th>
              <th>Chứng nhận</th>
              <th>Ngày đăng ký</th>
              <th className="text-center pe-4">Thao tác</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {items.length === 0 && !loading ? (
              <tr>
                <td colSpan={8} className="text-center py-4 text-muted">
                  Không tìm thấy dữ liệu bản quyền nào
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id}>
                  <td className="ps-4 fw-semibold text-primary">#{item.id}</td>
                  <td>
                    <div className="fw-semibold text-dark">{item.audioTitle}</div>
                    <small className="text-muted">Audio ID: {item.audioId}</small>
                  </td>
                  <td>{item.artistName}</td>
                  <td>{item.ownerName}</td>
                  <td>
                    <span className="font-monospace fw-semibold text-dark">{item.isrcCode}</span>
                  </td>
                  <td>
                    {item.certificateFileUrl ? (
                      <span className="badge rounded-pill bg-success bg-opacity-10 text-success">
                        Có file
                      </span>
                    ) : (
                      <span className="badge rounded-pill bg-secondary bg-opacity-10 text-secondary">
                        Chưa có
                      </span>
                    )}
                  </td>
                  <td className="text-muted small">{formatDateTime(item.registeredAt)}</td>
                  <td className="text-center pe-4">
                    <div className="btn-group btn-group-sm" role="group">
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => onView(item.id)}
                      >
                        <i className="bi bi-eye me-1"></i> Xem
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-primary"
                        onClick={() => onEdit(item.id)}
                      >
                        <i className="bi bi-pencil-square me-1"></i> Sửa
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="card-footer bg-white p-3 d-flex justify-content-between align-items-center border-top">
        <span className="text-muted small">
          Hiển thị {items.length > 0 ? page * 10 + 1 : 0}-
          {Math.min((page + 1) * 10, totalItems)} của {totalItems} bản ghi
        </span>
        <nav>
          <ul className="pagination pagination-sm mb-0">
            <li className={`page-item ${page === 0 ? "disabled" : ""}`}>
              <button className="page-link text-dark" onClick={() => onPageChange((current) => Math.max(0, current - 1))}>
                Trước
              </button>
            </li>
            <li className="page-item active">
              <span
                className="page-link"
                style={{ backgroundColor: "#4f46e5", borderColor: "#4f46e5" }}
              >
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

export default AdminCopyrightTable;