import React from "react";
import type { AdminUserModel } from "../../models/AdminUserModel";
import { Link } from "react-router-dom";

interface Props {
  users: AdminUserModel[];
  onOpenLockModal: (user: AdminUserModel) => void;
}

// Hàm lấy chữ cái đầu của tên nếu không có avatar
const getInitials = (name: string) => name.charAt(0).toUpperCase();

const AdminUserTable: React.FC<Props> = ({ users, onOpenLockModal }) => {
  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle mb-0">
        <thead className="table-light text-muted small text-uppercase">
          <tr>
            <th className="ps-4 py-3">Người dùng</th>
            <th>Vai trò</th>
            <th>Ngày tham gia</th>
            <th>Trạng thái</th>
            <th className="text-center pe-4">Thao tác</th>
          </tr>
        </thead>
        <tbody className="bg-white border-top-0">
          {users.map((user) => (
            <tr key={user.id} className={!user.isActive ? "bg-light" : ""}>
              <td className={`ps-4 py-3 ${!user.isActive ? "opacity-75" : ""}`}>
                <div className="d-flex align-items-center">
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt="Avatar"
                      className="rounded-circle me-3"
                      style={{
                        width: "40px",
                        height: "40px",
                        objectFit: "cover",
                        backgroundColor: "#e2e8f0",
                      }}
                    />
                  ) : (
                    <div
                      className="rounded-circle me-3 d-flex justify-content-center align-items-center text-white fw-bold"
                      style={{
                        width: "40px",
                        height: "40px",
                        backgroundColor: !user.isActive ? "#64748b" : "#0d9488",
                      }}
                    >
                      {getInitials(user.name)}
                    </div>
                  )}
                  <div>
                    <h6
                      className={`mb-0 fw-bold ${!user.isActive ? "text-decoration-line-through" : ""}`}
                      style={{ color: "#1e293b" }}
                    >
                      {user.name}
                    </h6>
                    <small className="text-muted">{user.email}</small>
                  </div>
                </div>
              </td>
              <td className={!user.isActive ? "opacity-75" : ""}>
                {user.role === "artist" && (
                  <span className="badge bg-primary bg-opacity-10 text-primary border border-primary rounded-pill px-3">
                    Nghệ sĩ
                  </span>
                )}
                {user.role === "user" && (
                  <span className="badge bg-light text-dark border rounded-pill px-3">
                    Người nghe
                  </span>
                )}
                {user.role === "admin" && (
                  <span className="badge bg-dark text-white rounded-pill px-3">
                    Quản trị viên
                  </span>
                )}
              </td>
              <td
                className={`text-muted small ${!user.isActive ? "opacity-75" : ""}`}
              >
                {new Date(user.createdAt).toLocaleDateString("vi-VN")}
              </td>
              <td>
                {user.isActive ? (
                  <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-3">
                    <i
                      className="bi bi-circle-fill small me-1"
                      style={{ fontSize: "8px" }}
                    ></i>{" "}
                    Hoạt động
                  </span>
                ) : (
                  <span className="badge bg-danger bg-opacity-10 text-danger rounded-pill px-3">
                    <i className="bi bi-lock-fill small me-1"></i> Đã khóa
                  </span>
                )}
              </td>
              <td className="text-center pe-4">
                <div className="dropdown">
                  <button
                    className="btn btn-sm btn-light rounded-circle"
                    data-bs-toggle="dropdown"
                  >
                    <i className="bi bi-three-dots-vertical"></i>
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end shadow border-0">
                    <Link
                      to={`/admin/users/view/${user.id}`}
                      className="dropdown-item"
                    >
                      <i className="bi bi-eye me-2 text-muted"></i> Xem hồ sơ
                    </Link>
                   
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <button
                        className={`dropdown-item ${user.isActive ? "text-danger" : "text-success"}`}
                        onClick={() => onOpenLockModal(user)}
                        data-bs-toggle="modal"
                        data-bs-target="#lockAccountModal"
                      >
                        {user.isActive ? (
                          <>
                            <i className="bi bi-lock me-2"></i> Khóa tài khoản
                          </>
                        ) : (
                          <>
                            <i className="bi bi-unlock me-2"></i> Mở khóa tài
                            khoản
                          </>
                        )}
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
            </tr>
          ))}
          {users.length === 0 && (
            <tr>
              <td colSpan={5} className="text-center py-4 text-muted">
                Không tìm thấy người dùng nào.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUserTable;
