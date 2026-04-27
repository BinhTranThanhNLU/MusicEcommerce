import AdminSidebar from "../../components/AdminHeader/AdminSidebar";
import AdminHeader from "../../components/AdminHeader/AdminHeader";

const AdminCopyrightManagementPage = () => {
  return (
    <div className="admin-dashboard d-flex" style={{ backgroundColor: "#f8fafc" }}>
      <AdminSidebar />

      <main className="main-content flex-grow-1 min-vh-100">
        <AdminHeader />

        <div className="container-fluid py-4 px-lg-4">
          {/* Tiêu đề trang */}
          <div className="d-flex justify-content-between align-items-end mb-4">
            <div>
              <h3 className="fw-bold mb-1" style={{ color: "#0f172a" }}>Quản lý Bản quyền & Giấy phép</h3>
              <p className="text-muted mb-0">Lưu trữ thông tin quyền sở hữu, thiết lập loại giấy phép và theo dõi lịch sử cấp phép.</p>
            </div>
            <div>
              <button className="btn rounded-pill px-4 shadow-sm text-white" style={{ backgroundColor: "#4f46e5" }}>
                <i className="bi bi-plus-circle me-2"></i> Tạo loại giấy phép mới
              </button>
            </div>
          </div>

          <div className="row g-4 mb-4">
            {/* Cột trái: Quản lý Loại Giấy Phép */}
            <div className="col-lg-4">
              <div className="card border-0 shadow-sm rounded-4 h-100 p-0 overflow-hidden">
                <div className="p-4 border-bottom bg-white">
                  <h5 className="fw-bold mb-0" style={{ color: "#1e293b" }}>Các Loại Giấy Phép (Licenses)</h5>
                </div>
                <div className="list-group list-group-flush">
                  {/* Giấy phép Cá nhân */}
                  <div className="list-group-item p-4 border-0 border-bottom">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div className="d-flex align-items-center gap-2">
                        <span className="badge bg-info bg-opacity-10 text-info rounded px-2 py-1"><i className="bi bi-person"></i> Cá nhân</span>
                      </div>
                      <div className="dropdown">
                        <button className="btn btn-sm text-muted" data-bs-toggle="dropdown"><i className="bi bi-three-dots"></i></button>
                        <ul className="dropdown-menu shadow-sm border-0">
                          <li><a className="dropdown-item" href="#">Chỉnh sửa</a></li>
                          <li><a className="dropdown-item text-danger" href="#">Vô hiệu hóa</a></li>
                        </ul>
                      </div>
                    </div>
                    <h6 className="fw-bold mt-2">Standard Personal License</h6>
                    <p className="text-muted small mb-0">Chỉ cấp quyền tải file chất lượng cao để nghe cá nhân. Không được sao chép, phân phối hoặc dùng vào mục đích thương mại.</p>
                  </div>

                  {/* Giấy phép Thương mại */}
                  <div className="list-group-item p-4 border-0 border-bottom">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div className="d-flex align-items-center gap-2">
                        <span className="badge bg-danger bg-opacity-10 text-danger rounded px-2 py-1"><i className="bi bi-briefcase"></i> Thương mại</span>
                      </div>
                      <div className="dropdown">
                        <button className="btn btn-sm text-muted" data-bs-toggle="dropdown"><i className="bi bi-three-dots"></i></button>
                        <ul className="dropdown-menu shadow-sm border-0">
                          <li><a className="dropdown-item" href="#">Chỉnh sửa</a></li>
                          <li><a className="dropdown-item text-danger" href="#">Vô hiệu hóa</a></li>
                        </ul>
                      </div>
                    </div>
                    <h6 className="fw-bold mt-2">Pro Commercial License</h6>
                    <p className="text-muted small mb-0">Cho phép sử dụng bài hát trong quảng cáo, phim ảnh, sự kiện thương mại. Doanh thu không giới hạn.</p>
                  </div>

                  {/* Giấy phép YouTube */}
                  <div className="list-group-item p-4 border-0">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div className="d-flex align-items-center gap-2">
                        <span className="badge bg-warning bg-opacity-10 text-warning rounded px-2 py-1"><i className="bi bi-youtube"></i> Mạng xã hội</span>
                      </div>
                      <div className="dropdown">
                        <button className="btn btn-sm text-muted" data-bs-toggle="dropdown"><i className="bi bi-three-dots"></i></button>
                        <ul className="dropdown-menu shadow-sm border-0">
                          <li><a className="dropdown-item" href="#">Chỉnh sửa</a></li>
                          <li><a className="dropdown-item text-danger" href="#">Vô hiệu hóa</a></li>
                        </ul>
                      </div>
                    </div>
                    <h6 className="fw-bold mt-2">Creator Content License</h6>
                    <p className="text-muted small mb-0">Cho phép sử dụng làm nhạc nền trong các video YouTube, TikTok, Facebook có bật kiếm tiền.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Cột phải: Hồ sơ sở hữu & Nhật ký cấp phép */}
            <div className="col-lg-8">
              <div className="card border-0 shadow-sm rounded-4 h-100">
                <div className="p-4 border-bottom d-flex justify-content-between align-items-center bg-white rounded-top-4">
                  <h5 className="fw-bold mb-0" style={{ color: "#1e293b" }}>Sổ đăng ký & Nhật ký Cấp phép</h5>
                  <div className="input-group" style={{ width: "250px" }}>
                    <span className="input-group-text bg-light border-0"><i className="bi bi-search"></i></span>
                    <input type="text" className="form-control bg-light border-0 form-control-sm" placeholder="Tìm mã số chứng nhận..." />
                  </div>
                </div>
                
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light text-muted small text-uppercase">
                      <tr>
                        <th className="ps-4 py-3">Mã Chứng nhận</th>
                        <th>Nội dung (Bài hát)</th>
                        <th>Nghệ sĩ sở hữu</th>
                        <th>Khách hàng cấp phép</th>
                        <th>Loại Quyền</th>
                        <th>Ngày cấp</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white border-top-0">
                      <tr>
                        <td className="ps-4 py-3"><span className="fw-medium font-monospace text-primary">CER-9921-COM</span></td>
                        <td><span className="fw-bold text-dark">Nơi Này Có Anh</span></td>
                        <td>Sơn Tùng M-TP</td>
                        <td><span className="fw-medium">VNG Corporation</span></td>
                        <td><span className="badge bg-danger bg-opacity-10 text-danger rounded-pill">Thương mại</span></td>
                        <td className="text-muted small">24/02/2026</td>
                      </tr>
                      <tr>
                        <td className="ps-4 py-3"><span className="fw-medium font-monospace text-primary">CER-9920-YTB</span></td>
                        <td><span className="fw-bold text-dark">Chạy Ngay Đi</span></td>
                        <td>Sơn Tùng M-TP</td>
                        <td><span className="fw-medium">KOL Khoa Pug</span></td>
                        <td><span className="badge bg-warning bg-opacity-10 text-warning rounded-pill">Mạng xã hội</span></td>
                        <td className="text-muted small">23/02/2026</td>
                      </tr>
                      <tr>
                        <td className="ps-4 py-3"><span className="fw-medium font-monospace text-primary">CER-9919-PER</span></td>
                        <td><span className="fw-bold text-dark">Waiting For You</span></td>
                        <td>MONO</td>
                        <td><span className="fw-medium">Nguyễn Văn A</span></td>
                        <td><span className="badge bg-info bg-opacity-10 text-info rounded-pill">Cá nhân</span></td>
                        <td className="text-muted small">22/02/2026</td>
                      </tr>
                       <tr>
                        <td className="ps-4 py-3"><span className="fw-medium font-monospace text-primary">CER-9918-COM</span></td>
                        <td><span className="fw-bold text-dark">Gieo Quẻ</span></td>
                        <td>Hoàng Thùy Linh</td>
                        <td><span className="fw-medium">Shopee VN</span></td>
                        <td><span className="badge bg-danger bg-opacity-10 text-danger rounded-pill">Thương mại</span></td>
                        <td className="text-muted small">20/02/2026</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <div className="card-footer bg-white p-3 text-center border-top">
                    <a href="#" className="text-decoration-none fw-medium small" style={{ color: "#4f46e5" }}>Xem toàn bộ sổ đăng ký <i className="bi bi-arrow-right"></i></a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminCopyrightManagementPage;