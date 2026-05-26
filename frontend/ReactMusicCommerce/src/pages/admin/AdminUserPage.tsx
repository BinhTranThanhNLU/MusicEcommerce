import { useEffect, useState } from "react";
import { getAdminUsers, toggleUserStatus } from "../../apis/adminApi";
import type { AdminUserModel } from "../../models/AdminUserModel";

import { SpinningLoading } from "../../components/utils/SpinningLoading";
import AdminUserTable from "../../components/AdminUserComponent/AdminUserTable";
import AdminUserLockModal from "../../components/AdminUserComponent/AdminUserLockModal";
import AdminUserFilter from "../../components/AdminUserComponent/AdminUserFilter";

const AdminUserPage = () => {
  const [users, setUsers] = useState<AdminUserModel[]>([]);
  const [loading, setLoading] = useState(true);

  // States cho phân trang
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  // States cho bộ lọc
  const [keyword, setKeyword] = useState("");
  const [role, setRole] = useState("all");
  const [status, setStatus] = useState("all");

  // State cho Modal
  const [selectedUser, setSelectedUser] = useState<AdminUserModel | null>(null);

  // Hàm gọi API lấy dữ liệu
  const fetchUsers = async () => {
    setLoading(true);
    try {
      let isActiveParam: boolean | string = "all";
      if (status === "true") isActiveParam = true;
      if (status === "false") isActiveParam = false;

      const data = await getAdminUsers(page, 10, keyword, role, isActiveParam);
      setUsers(data.users);
      setTotalPages(data.totalPages);
      setTotalItems(data.totalItems);
    } catch (error) {
      console.error("Lỗi khi tải danh sách user:", error);
    } finally {
      setLoading(false);
    }
  };

  // Gọi API mỗi khi page hoặc bộ lọc thay đổi
  useEffect(() => {
    setPage(0);
  }, [keyword, role, status]);

  useEffect(() => {
    fetchUsers();
  }, [page, keyword, role, status]);

  // Xử lý xác nhận khóa/mở khóa từ Modal
  const handleToggleStatus = async (
    userId: number,
    targetStatus: boolean,
    reason: string,
  ) => {
    try {
      await toggleUserStatus(userId, targetStatus);
      fetchUsers();
    } catch (error) {
      alert("Có lỗi xảy ra khi cập nhật trạng thái!");
    }
  };

  return (
    <div className="container-fluid py-4 px-lg-4">
      {/* Tiêu đề trang */}
      <div className="d-flex justify-content-between align-items-end mb-4">
        <div>
          <h3 className="fw-bold mb-1" style={{ color: "#0f172a" }}>
            Quản lý Tài khoản
          </h3>
          <p className="text-muted mb-0">
            Xem danh sách, phân quyền và xử lý vi phạm của người dùng, nghệ sĩ.
          </p>
        </div>
        <div>
         
        </div>
      </div>

      <AdminUserFilter
        keyword={keyword}
        setKeyword={setKeyword}
        role={role}
        setRole={setRole}
        status={status}
        setStatus={setStatus}
      />

      <div className="card border-0 shadow-sm rounded-4 overflow-hidden position-relative">
        {loading && (
          <div
            className="position-absolute w-100 h-100 d-flex justify-content-center align-items-center bg-white bg-opacity-75"
            style={{ zIndex: 10 }}
          >
            <SpinningLoading />
          </div>
        )}

        <AdminUserTable users={users} onOpenLockModal={setSelectedUser} />

        {/* Phân trang */}
        <div className="card-footer bg-white p-3 d-flex justify-content-between align-items-center border-top">
          <span className="text-muted small">
            Hiển thị {users.length > 0 ? page * 10 + 1 : 0}-
            {Math.min((page + 1) * 10, totalItems)} của {totalItems} tài khoản
          </span>
          <nav>
            <ul className="pagination pagination-sm mb-0">
              <li className={`page-item ${page === 0 ? "disabled" : ""}`}>
                <button
                  className="page-link text-dark"
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                >
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
              <li
                className={`page-item ${page >= totalPages - 1 ? "disabled" : ""}`}
              >
                <button
                  className="page-link text-dark"
                  onClick={() => setPage((p) => p + 1)}
                >
                  Sau
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      <AdminUserLockModal user={selectedUser} onConfirm={handleToggleStatus} />
    </div>
  );
};

export default AdminUserPage;
