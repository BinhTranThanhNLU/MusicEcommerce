import AdminSidebar from "../../components/layouts/AdminSidebar";
import AdminHeader from "../../components/layouts/AdminHeader";

const AdminUserManagementPage = () => {
  return (
    <div className="admin-dashboard d-flex" style={{ backgroundColor: "#f8fafc" }}>
      <AdminSidebar />

      <main className="main-content flex-grow-1 min-vh-100">
        <AdminHeader />

        <div className="container-fluid py-4 px-lg-4">
          {/* Tiêu đề trang */}
          <div className="d-flex justify-content-between align-items-end mb-4">
            <div>
              <h3 className="fw-bold mb-1" style={{ color: "#0f172a" }}>Quản lý Tài khoản</h3>
              <p className="text-muted mb-0">Xem danh sách, phân quyền và xử lý vi phạm của người dùng, nghệ sĩ.</p>
            </div>
            <div>
              <button className="btn rounded-pill px-4 shadow-sm text-white" style={{ backgroundColor: "#4f46e5" }}>
                <i className="bi bi-person-plus me-2"></i> Thêm Quản trị viên
              </button>
            </div>
          </div>

          {/* Bộ lọc & Tìm kiếm */}
          <div className="card border-0 shadow-sm rounded-4 mb-4">
            <div className="card-body p-4 d-flex flex-wrap gap-3 align-items-center justify-content-between">
              <div className="d-flex gap-3 flex-grow-1" style={{ maxWidth: "700px" }}>
                <div className="input-group">
                  <span className="input-group-text bg-light border-0"><i className="bi bi-search"></i></span>
                  <input type="text" className="form-control bg-light border-0" placeholder="Tìm tên, email tài khoản..." />
                </div>
                <select className="form-select border-0 bg-light" style={{ width: "160px" }}>
                  <option value="all">Tất cả vai trò</option>
                  <option value="user">Người nghe</option>
                  <option value="artist">Nghệ sĩ</option>
                  <option value="admin">Quản trị viên</option>
                </select>
                <select className="form-select border-0 bg-light" style={{ width: "160px" }}>
                  <option value="all">Mọi trạng thái</option>
                  <option value="active">Đang hoạt động</option>
                  <option value="locked">Bị khóa</option>
                </select>
              </div>
            </div>
          </div>

          {/* Bảng Danh sách Người dùng */}
          <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
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
                  {/* User 1: Nghệ sĩ - Hoạt động */}
                  <tr>
                    <td className="ps-4 py-3">
                      <div className="d-flex align-items-center">
                        <img src="../../assets/img/artist-avatar.png" alt="Avatar" className="rounded-circle me-3" style={{ width: "40px", height: "40px", objectFit: "cover", backgroundColor: "#e2e8f0" }} />
                        <div>
                          <h6 className="mb-0 fw-bold" style={{ color: "#1e293b" }}>Sơn Tùng M-TP</h6>
                          <small className="text-muted">sontung@mtpentertainment.com</small>
                        </div>
                      </div>
                    </td>
                    <td><span className="badge bg-primary bg-opacity-10 text-primary border border-primary rounded-pill px-3">Nghệ sĩ</span></td>
                    <td className="text-muted small">15/01/2026</td>
                    <td><span className="badge bg-success bg-opacity-10 text-success rounded-pill px-3"><i className="bi bi-circle-fill small me-1" style={{ fontSize: "8px" }}></i> Hoạt động</span></td>
                    <td className="text-center pe-4">
                      <div className="dropdown">
                        <button className="btn btn-sm btn-light rounded-circle" data-bs-toggle="dropdown">
                          <i className="bi bi-three-dots-vertical"></i>
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end shadow border-0">
                          <li><a className="dropdown-item" href="#"><i className="bi bi-eye me-2 text-muted"></i> Xem hồ sơ</a></li>
                          <li><a className="dropdown-item" href="#"><i className="bi bi-music-note-list me-2 text-muted"></i> Xem kho nhạc</a></li>
                          <li><hr className="dropdown-divider" /></li>
                          <li><a className="dropdown-item text-danger" href="#" data-bs-toggle="modal" data-bs-target="#lockAccountModal"><i className="bi bi-lock me-2"></i> Khóa tài khoản</a></li>
                        </ul>
                      </div>
                    </td>
                  </tr>

                  {/* User 2: Người nghe - Hoạt động */}
                  <tr>
                    <td className="ps-4 py-3">
                      <div className="d-flex align-items-center">
                        <div className="rounded-circle me-3 d-flex justify-content-center align-items-center text-white fw-bold" style={{ width: "40px", height: "40px", backgroundColor: "#0d9488" }}>
                          T
                        </div>
                        <div>
                          <h6 className="mb-0 fw-bold" style={{ color: "#1e293b" }}>Trần Thanh Bình</h6>
                          <small className="text-muted">binh.tran@email.com</small>
                        </div>
                      </div>
                    </td>
                    <td><span className="badge bg-light text-dark border rounded-pill px-3">Người nghe</span></td>
                    <td className="text-muted small">20/02/2026</td>
                    <td><span className="badge bg-success bg-opacity-10 text-success rounded-pill px-3"><i className="bi bi-circle-fill small me-1" style={{ fontSize: "8px" }}></i> Hoạt động</span></td>
                    <td className="text-center pe-4">
                      <div className="dropdown">
                        <button className="btn btn-sm btn-light rounded-circle" data-bs-toggle="dropdown">
                          <i className="bi bi-three-dots-vertical"></i>
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end shadow border-0">
                          <li><a className="dropdown-item" href="#"><i className="bi bi-eye me-2 text-muted"></i> Xem hồ sơ</a></li>
                          <li><a className="dropdown-item" href="#"><i className="bi bi-cart3 me-2 text-muted"></i> Lịch sử mua hàng</a></li>
                          <li><hr className="dropdown-divider" /></li>
                          <li><a className="dropdown-item text-danger" href="#" data-bs-toggle="modal" data-bs-target="#lockAccountModal"><i className="bi bi-lock me-2"></i> Khóa tài khoản</a></li>
                        </ul>
                      </div>
                    </td>
                  </tr>

                  {/* User 3: Nghệ sĩ - Bị khóa */}
                  <tr className="bg-light">
                    <td className="ps-4 py-3 opacity-75">
                      <div className="d-flex align-items-center">
                        <div className="rounded-circle me-3 d-flex justify-content-center align-items-center text-white fw-bold" style={{ width: "40px", height: "40px", backgroundColor: "#64748b" }}>
                          J
                        </div>
                        <div>
                          <h6 className="mb-0 fw-bold text-decoration-line-through" style={{ color: "#1e293b" }}>Jack 97</h6>
                          <small className="text-muted">jack.official@email.com</small>
                        </div>
                      </div>
                    </td>
                    <td className="opacity-75"><span className="badge bg-primary bg-opacity-10 text-primary border border-primary rounded-pill px-3">Nghệ sĩ</span></td>
                    <td className="text-muted small opacity-75">10/12/2025</td>
                    <td><span className="badge bg-danger bg-opacity-10 text-danger rounded-pill px-3"><i className="bi bi-lock-fill small me-1"></i> Đã khóa</span></td>
                    <td className="text-center pe-4">
                      <div className="dropdown">
                        <button className="btn btn-sm btn-light rounded-circle" data-bs-toggle="dropdown">
                          <i className="bi bi-three-dots-vertical"></i>
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end shadow border-0">
                          <li><a className="dropdown-item" href="#"><i className="bi bi-eye me-2 text-muted"></i> Xem hồ sơ</a></li>
                          <li><hr className="dropdown-divider" /></li>
                          <li><a className="dropdown-item text-success" href="#"><i className="bi bi-unlock me-2"></i> Mở khóa tài khoản</a></li>
                        </ul>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            {/* Phân trang */}
            <div className="card-footer bg-white p-3 d-flex justify-content-between align-items-center border-top">
                <span className="text-muted small">Hiển thị 1-10 của 12,450 tài khoản</span>
                <nav>
                    <ul className="pagination pagination-sm mb-0">
                        <li className="page-item disabled"><a className="page-link" href="#">Trước</a></li>
                        <li className="page-item active"><a className="page-link" href="#" style={{backgroundColor: "#4f46e5", borderColor: "#4f46e5"}}>1</a></li>
                        <li className="page-item"><a className="page-link text-dark" href="#">2</a></li>
                        <li className="page-item"><a className="page-link text-dark" href="#">3</a></li>
                        <li className="page-item"><a className="page-link text-dark" href="#">Sau</a></li>
                    </ul>
                </nav>
            </div>
          </div>
        </div>

        {/* Modal Khóa Tài Khoản */}
        <div className="modal fade" id="lockAccountModal" tabIndex={-1} aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header border-bottom-0 pb-0">
                <h5 className="modal-title fw-bold text-danger">Xác nhận khóa tài khoản</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <p className="text-muted mb-3">Bạn đang thực hiện thao tác khóa tài khoản. Người dùng này sẽ không thể đăng nhập và mọi bài hát đang bán (nếu có) có thể bị ẩn.</p>
                <form>
                  <div className="mb-3">
                    <label className="form-label fw-medium">Lý do khóa <span className="text-danger">*</span></label>
                    <select className="form-select mb-2">
                      <option>Chọn lý do...</option>
                      <option>Vi phạm bản quyền nghiêm trọng</option>
                      <option>Gian lận thanh toán</option>
                      <option>Spam hệ thống</option>
                      <option>Lý do khác</option>
                    </select>
                    <textarea className="form-control" rows={3} placeholder="Ghi chú thêm về vi phạm (Chỉ hiển thị với Admin)..."></textarea>
                  </div>
                </form>
              </div>
              <div className="modal-footer border-top-0 pt-0">
                <button type="button" className="btn btn-light" data-bs-dismiss="modal">Hủy bỏ</button>
                <button type="button" className="btn btn-danger px-4">
                  <i className="bi bi-lock-fill me-2"></i> Khóa ngay
                </button>
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
};

export default AdminUserManagementPage;