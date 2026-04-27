import AdminHeader from "../../components/AdminHeader/AdminHeader";
import AdminSidebar from "../../components/AdminHeader/AdminSidebar";

const AdminDashboardPage = () => {
  return (
    <div className="admin-dashboard d-flex" style={{ backgroundColor: "#f8fafc" }}>
      <AdminSidebar />

      <main className="main-content flex-grow-1 min-vh-100">
        <AdminHeader />

        {/* Dashboard Content */}
        <div className="container-fluid py-4 px-lg-4">
          {/* Tiêu đề */}
          <div className="d-flex justify-content-between align-items-end mb-4">
            <div>
              <h3 className="fw-bold mb-1" style={{ color: "#0f172a" }}>Bảng điều khiển hệ thống</h3>
              <p className="text-muted mb-0">Theo dõi hoạt động, người dùng và doanh thu của toàn nền tảng.</p>
            </div>
            <div>
              <button className="btn rounded-pill px-4 shadow-sm text-white" style={{ backgroundColor: "#4f46e5", border: "none" }}>
                <i className="bi bi-cloud-download me-2"></i> Xuất báo cáo tổng
              </button>
            </div>
          </div>

          {/* Row 1: Thống kê nhanh toàn hệ thống */}
          <div className="row g-4 mb-4">
            {/* Card Tổng Người Dùng */}
            <div className="col-xl-3 col-sm-6">
              <div className="card border-0 shadow-sm rounded-4 h-100">
                <div className="card-body p-4 d-flex align-items-center">
                  <div className="rounded-circle d-flex justify-content-center align-items-center me-3" style={{ width: "60px", height: "60px", backgroundColor: "#e0e7ff", color: "#4f46e5" }}>
                    <i className="bi bi-people fs-3"></i>
                  </div>
                  <div>
                    <p className="text-muted mb-1 small text-uppercase fw-semibold">Tổng User</p>
                    <h4 className="fw-bold mb-0">12,450</h4>
                    <small className="fw-medium" style={{ color: "#10b981" }}><i className="bi bi-arrow-up-short"></i> +3.2%</small>
                  </div>
                </div>
              </div>
            </div>

            {/* Card Tổng Nghệ Sĩ */}
            <div className="col-xl-3 col-sm-6">
              <div className="card border-0 shadow-sm rounded-4 h-100">
                <div className="card-body p-4 d-flex align-items-center">
                  <div className="rounded-circle d-flex justify-content-center align-items-center me-3" style={{ width: "60px", height: "60px", backgroundColor: "#ccfbf1", color: "#0d9488" }}>
                    <i className="bi bi-person-badge fs-3"></i>
                  </div>
                  <div>
                    <p className="text-muted mb-1 small text-uppercase fw-semibold">Nghệ sĩ hoạt động</p>
                    <h4 className="fw-bold mb-0">842</h4>
                    <small className="fw-medium" style={{ color: "#10b981" }}><i className="bi bi-arrow-up-short"></i> +12 user mới</small>
                  </div>
                </div>
              </div>
            </div>

            {/* Card Bài hát chờ duyệt */}
            <div className="col-xl-3 col-sm-6">
              <div className="card border-0 shadow-sm rounded-4 h-100">
                <div className="card-body p-4 d-flex align-items-center">
                  <div className="rounded-circle d-flex justify-content-center align-items-center me-3" style={{ width: "60px", height: "60px", backgroundColor: "#fef3c7", color: "#d97706" }}>
                    <i className="bi bi-music-note-list fs-3"></i>
                  </div>
                  <div>
                    <p className="text-muted mb-1 small text-uppercase fw-semibold">Bài hát chờ duyệt</p>
                    <h4 className="fw-bold mb-0">45</h4>
                    <small className="text-danger fw-medium"><i className="bi bi-exclamation-circle"></i> Cần xử lý</small>
                  </div>
                </div>
              </div>
            </div>

            {/* Card Doanh thu hệ thống */}
            <div className="col-xl-3 col-sm-6">
              <div className="card border-0 shadow-sm rounded-4 h-100">
                <div className="card-body p-4 d-flex align-items-center">
                  <div className="rounded-circle d-flex justify-content-center align-items-center me-3" style={{ width: "60px", height: "60px", backgroundColor: "#dcfce7", color: "#16a34a" }}>
                    <i className="bi bi-cash-stack fs-3"></i>
                  </div>
                  <div>
                    <p className="text-muted mb-1 small text-uppercase fw-semibold">Doanh thu hệ thống</p>
                    <h4 className="fw-bold mb-0">458M ₫</h4>
                    <small className="fw-medium" style={{ color: "#10b981" }}><i className="bi bi-arrow-up-short"></i> +8.5%</small>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Row 2: Biểu đồ & Bài hát chờ duyệt */}
          <div className="row g-4 mb-4">
            {/* Vùng chứa Biểu đồ */}
            <div className="col-lg-7">
              <div className="card border-0 shadow-sm rounded-4 h-100 p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="fw-bold mb-0" style={{ color: "#1e293b" }}>Lưu lượng Giao dịch</h5>
                  <select className="form-select w-auto form-select-sm border-0 bg-light fw-medium">
                    <option>Tháng này</option>
                    <option>Quý này</option>
                    <option>Năm nay</option>
                  </select>
                </div>
                {/* Giả lập biểu đồ */}
                <div className="bg-light rounded-3 d-flex flex-column justify-content-center align-items-center" style={{ minHeight: "300px" }}>
                    <div className="w-100 px-4 d-flex align-items-end justify-content-between" style={{height: "200px"}}>
                        <div className="rounded-top opacity-75" style={{width: "8%", height: "40%", backgroundColor: "#4f46e5"}}></div>
                        <div className="rounded-top opacity-75" style={{width: "8%", height: "60%", backgroundColor: "#4f46e5"}}></div>
                        <div className="rounded-top opacity-75" style={{width: "8%", height: "30%", backgroundColor: "#4f46e5"}}></div>
                        <div className="rounded-top opacity-75" style={{width: "8%", height: "80%", backgroundColor: "#4f46e5"}}></div>
                        <div className="rounded-top opacity-75" style={{width: "8%", height: "50%", backgroundColor: "#4f46e5"}}></div>
                        <div className="rounded-top opacity-75" style={{width: "8%", height: "90%", backgroundColor: "#4f46e5"}}></div>
                        <div className="rounded-top opacity-75" style={{width: "8%", height: "100%", backgroundColor: "#4f46e5"}}></div>
                    </div>
                    <p className="mt-3 text-muted small">Khu vực tích hợp Biểu đồ Recharts</p>
                </div>
              </div>
            </div>

            {/* Bài hát chờ kiểm duyệt */}
            <div className="col-lg-5">
              <div className="card border-0 shadow-sm rounded-4 h-100 p-0 overflow-hidden">
                <div className="p-4 border-bottom d-flex justify-content-between align-items-center">
                    <h5 className="fw-bold mb-0" style={{ color: "#1e293b" }}>Yêu cầu chờ duyệt</h5>
                    <span className="badge rounded-pill" style={{ backgroundColor: "#f59e0b" }}>45 bài mới</span>
                </div>
                <div className="list-group list-group-flush">
                  {/* Item 1 */}
                  <div className="list-group-item p-3 d-flex justify-content-between align-items-center border-0">
                    <div className="d-flex align-items-center">
                      <div className="rounded-3 d-flex justify-content-center align-items-center" style={{ width: "45px", height: "45px", backgroundColor: "#f1f5f9", color: "#64748b" }}>
                        <i className="bi bi-music-note-beamed fs-5"></i>
                      </div>
                      <div className="ms-3">
                        <h6 className="mb-0 fw-bold text-truncate" style={{maxWidth: "180px"}}>Making My Way</h6>
                        <small className="text-muted">Bởi: Sơn Tùng M-TP</small>
                      </div>
                    </div>
                    <div className="d-flex gap-2">
                      <button className="btn btn-sm btn-light text-success rounded-circle" title="Duyệt"><i className="bi bi-check-lg"></i></button>
                      <button className="btn btn-sm btn-light text-danger rounded-circle" title="Từ chối"><i className="bi bi-x-lg"></i></button>
                    </div>
                  </div>
                  
                  {/* Item 2 */}
                  <div className="list-group-item p-3 d-flex justify-content-between align-items-center border-0">
                    <div className="d-flex align-items-center">
                      <div className="rounded-3 d-flex justify-content-center align-items-center" style={{ width: "45px", height: "45px", backgroundColor: "#f1f5f9", color: "#64748b" }}>
                        <i className="bi bi-music-note-beamed fs-5"></i>
                      </div>
                      <div className="ms-3">
                        <h6 className="mb-0 fw-bold text-truncate" style={{maxWidth: "180px"}}>See Tình (Remix)</h6>
                        <small className="text-muted">Bởi: Hoàng Thùy Linh</small>
                      </div>
                    </div>
                    <div className="d-flex gap-2">
                      <button className="btn btn-sm btn-light text-success rounded-circle" title="Duyệt"><i className="bi bi-check-lg"></i></button>
                      <button className="btn btn-sm btn-light text-danger rounded-circle" title="Từ chối"><i className="bi bi-x-lg"></i></button>
                    </div>
                  </div>

                   {/* Item 3 */}
                   <div className="list-group-item p-3 d-flex justify-content-between align-items-center border-0">
                    <div className="d-flex align-items-center">
                      <div className="rounded-3 d-flex justify-content-center align-items-center" style={{ width: "45px", height: "45px", backgroundColor: "#f1f5f9", color: "#64748b" }}>
                        <i className="bi bi-music-note-beamed fs-5"></i>
                      </div>
                      <div className="ms-3">
                        <h6 className="mb-0 fw-bold text-truncate" style={{maxWidth: "180px"}}>Waiting For You</h6>
                        <small className="text-muted">Bởi: MONO</small>
                      </div>
                    </div>
                    <div className="d-flex gap-2">
                      <button className="btn btn-sm btn-light text-success rounded-circle" title="Duyệt"><i className="bi bi-check-lg"></i></button>
                      <button className="btn btn-sm btn-light text-danger rounded-circle" title="Từ chối"><i className="bi bi-x-lg"></i></button>
                    </div>
                  </div>
                </div>
                <div className="p-3 bg-light text-center mt-auto border-top">
                    <a href="#" className="text-decoration-none fw-medium small" style={{ color: "#4f46e5" }}>Đi tới trang Kiểm duyệt <i className="bi bi-arrow-right"></i></a>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default AdminDashboardPage;