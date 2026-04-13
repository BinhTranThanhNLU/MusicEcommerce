import AdminSidebar from "../../components/layouts/AdminSidebar";
import AdminHeader from "../../components/layouts/AdminHeader";

const AdminSongModerationPage = () => {
  return (
    <div className="admin-dashboard d-flex" style={{ backgroundColor: "#f8fafc" }}>
      <AdminSidebar />

      <main className="main-content flex-grow-1 min-vh-100">
        <AdminHeader />

        <div className="container-fluid py-4 px-lg-4">
          {/* Tiêu đề trang */}
          <div className="mb-4">
            <h3 className="fw-bold mb-1" style={{ color: "#0f172a" }}>Kiểm duyệt Nội dung Âm nhạc</h3>
            <p className="text-muted mb-0">Nghe thử, kiểm tra vi phạm và quản lý trạng thái xuất bản của các bài hát.</p>
          </div>

          {/* Bộ lọc & Tìm kiếm */}
          <div className="card border-0 shadow-sm rounded-4 mb-4">
            <div className="card-body p-4 d-flex flex-wrap gap-3 align-items-center justify-content-between">
              <div className="d-flex gap-3 flex-grow-1" style={{ maxWidth: "600px" }}>
                <div className="input-group">
                  <span className="input-group-text bg-light border-0"><i className="bi bi-search"></i></span>
                  <input type="text" className="form-control bg-light border-0" placeholder="Tìm tên bài hát, nghệ sĩ..." />
                </div>
                <select className="form-select border-0 bg-light" style={{ width: "180px" }}>
                  <option value="all">Tất cả thể loại</option>
                  <option value="pop">Pop</option>
                  <option value="ballad">Ballad</option>
                  <option value="rap">Rap/Hip-hop</option>
                </select>
              </div>
              
              <div className="d-flex gap-2">
                <button className="btn rounded-pill px-4 fw-medium" style={{ backgroundColor: "#4f46e5", color: "white" }}>
                  <i className="bi bi-funnel me-2"></i> Lọc dữ liệu
                </button>
              </div>
            </div>
            
            {/* Tabs Trạng thái */}
            <div className="border-top px-4">
              <ul className="nav nav-underline gap-4">
                <li className="nav-item">
                  <a className="nav-link active fw-medium py-3" href="#" style={{ color: "#4f46e5", borderBottomColor: "#4f46e5" }}>Chờ duyệt (45)</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link text-muted fw-medium py-3" href="#">Đã duyệt</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link text-muted fw-medium py-3" href="#">Đã từ chối</a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bảng Danh sách Bài hát */}
          <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light text-muted small text-uppercase">
                  <tr>
                    <th className="ps-4 py-3">Thông tin Bài hát</th>
                    <th>Nghệ sĩ</th>
                    <th>Thể loại</th>
                    <th>Ngày tải lên</th>
                    <th>Trạng thái</th>
                    <th className="text-center pe-4">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="bg-white border-top-0">
                  {/* Item 1 */}
                  <tr>
                    <td className="ps-4 py-3">
                      <div className="d-flex align-items-center">
                        <div className="position-relative me-3 cursor-pointer group">
                          <img src="../../assets/img/music.png" alt="Cover" className="rounded-3" style={{ width: "48px", height: "48px", objectFit: "cover", backgroundColor: "#e2e8f0" }} />
                          <div className="position-absolute top-50 start-50 translate-middle text-white bg-dark bg-opacity-50 rounded-circle d-flex justify-content-center align-items-center" style={{ width: "24px", height: "24px" }}>
                            <i className="bi bi-play-fill"></i>
                          </div>
                        </div>
                        <div>
                          <h6 className="mb-0 fw-bold" style={{ color: "#1e293b" }}>Making My Way</h6>
                          <small className="text-muted"><i className="bi bi-file-earmark-music me-1"></i> FLAC • 4.5MB</small>
                        </div>
                      </div>
                    </td>
                    <td><span className="fw-medium text-dark">Sơn Tùng M-TP</span></td>
                    <td><span className="badge bg-light text-dark border">Pop/Dance</span></td>
                    <td className="text-muted small">24/02/2026 14:30</td>
                    <td><span className="badge bg-warning bg-opacity-10 text-warning border border-warning rounded-pill px-3">Chờ kiểm duyệt</span></td>
                    <td className="text-center pe-4">
                      <div className="d-flex justify-content-center gap-2">
                        <button className="btn btn-sm btn-outline-success rounded-circle" title="Phê duyệt" style={{ width: "32px", height: "32px", padding: 0 }}>
                          <i className="bi bi-check-lg"></i>
                        </button>
                        {/* Nút gọi Modal Từ chối */}
                        <button className="btn btn-sm btn-outline-danger rounded-circle" title="Từ chối" data-bs-toggle="modal" data-bs-target="#rejectModal" style={{ width: "32px", height: "32px", padding: 0 }}>
                          <i className="bi bi-x-lg"></i>
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* Item 2 */}
                  <tr>
                    <td className="ps-4 py-3">
                      <div className="d-flex align-items-center">
                        <div className="position-relative me-3 cursor-pointer group">
                          <div className="rounded-3 d-flex justify-content-center align-items-center" style={{ width: "48px", height: "48px", backgroundColor: "#f1f5f9", color: "#64748b" }}>
                            <i className="bi bi-music-note-beamed fs-4"></i>
                          </div>
                           <div className="position-absolute top-50 start-50 translate-middle text-white bg-dark bg-opacity-50 rounded-circle d-flex justify-content-center align-items-center" style={{ width: "24px", height: "24px" }}>
                            <i className="bi bi-play-fill"></i>
                          </div>
                        </div>
                        <div>
                          <h6 className="mb-0 fw-bold" style={{ color: "#1e293b" }}>Ngủ Một Mình</h6>
                          <small className="text-muted"><i className="bi bi-file-earmark-music me-1"></i> WAV • 12MB</small>
                        </div>
                      </div>
                    </td>
                    <td><span className="fw-medium text-dark">HIEUTHUHAI</span></td>
                    <td><span className="badge bg-light text-dark border">Rap</span></td>
                    <td className="text-muted small">23/02/2026 09:15</td>
                    <td><span className="badge bg-warning bg-opacity-10 text-warning border border-warning rounded-pill px-3">Chờ kiểm duyệt</span></td>
                    <td className="text-center pe-4">
                      <div className="d-flex justify-content-center gap-2">
                        <button className="btn btn-sm btn-outline-success rounded-circle" title="Phê duyệt" style={{ width: "32px", height: "32px", padding: 0 }}>
                          <i className="bi bi-check-lg"></i>
                        </button>
                        <button className="btn btn-sm btn-outline-danger rounded-circle" title="Từ chối" data-bs-toggle="modal" data-bs-target="#rejectModal" style={{ width: "32px", height: "32px", padding: 0 }}>
                          <i className="bi bi-x-lg"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            {/* Phân trang */}
            <div className="card-footer bg-white p-3 d-flex justify-content-between align-items-center border-top">
                <span className="text-muted small">Hiển thị 1-10 của 45 bài hát</span>
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

        {/* Modal Từ chối bài hát & Gửi Email */}
        <div className="modal fade" id="rejectModal" tabIndex={-1} aria-labelledby="rejectModalLabel" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header border-bottom-0 pb-0">
                <h5 className="modal-title fw-bold text-danger" id="rejectModalLabel">Từ chối bài hát</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <p className="text-muted mb-3">Bạn đang từ chối bài hát <strong>"Making My Way"</strong>. Hệ thống sẽ gửi email thông báo lý do này đến nghệ sĩ <strong>Sơn Tùng M-TP</strong>.</p>
                <form>
                  <div className="mb-3">
                    <label className="form-label fw-medium">Lý do từ chối <span className="text-danger">*</span></label>
                    <select className="form-select mb-2">
                      <option>Chọn lý do mẫu...</option>
                      <option>Vi phạm bản quyền âm thanh</option>
                      <option>Chất lượng file âm thanh quá thấp / chứa tạp âm</option>
                      <option>Thông tin Metadata không hợp lệ</option>
                      <option>Lý do khác</option>
                    </select>
                    <textarea className="form-control" rows={4} placeholder="Nhập chi tiết lý do từ chối để nghệ sĩ có thể khắc phục..."></textarea>
                  </div>
                </form>
              </div>
              <div className="modal-footer border-top-0 pt-0">
                <button type="button" className="btn btn-light" data-bs-dismiss="modal">Hủy bỏ</button>
                <button type="button" className="btn btn-danger px-4">
                  <i className="bi bi-envelope-paper me-2"></i> Xác nhận & Gửi Email
                </button>
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
};

export default AdminSongModerationPage;