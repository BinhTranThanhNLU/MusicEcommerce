import "../../assets/css/artistDashboard.css";
import ArtistSidebar from "../../components/layouts/ArtistSidebar";
import ArtistHeader from "../../components/layouts/ArtistHeader";

const ArtistLicensesPage = () => {
  return (
    <div className="artist-dashboard d-flex">
      <ArtistSidebar />

      <main className="main-content flex-grow-1 bg-light min-vh-100">
        <ArtistHeader />

        <div className="container-fluid py-4 px-lg-4">
          {/* ================= TIÊU ĐỀ ================= */}
          <div className="d-flex justify-content-between align-items-end mb-4">
            <div>
              <h3 className="fw-bold mb-1" style={{ color: "var(--heading-color)" }}>Quản lý Giấy phép & Bản quyền</h3>
              <p className="text-muted mb-0">Theo dõi các giấy phép đã cấp, quản lý hợp đồng điện tử và phát hiện vi phạm.</p>
            </div>
            <div>
              <button className="btn btn-outline-dark rounded-pill px-4 me-2 shadow-sm">
                <i className="bi bi-download me-2"></i> Xuất dữ liệu
              </button>
            </div>
          </div>

          {/* ================= THỐNG KÊ NHANH BẢN QUYỀN ================= */}
          <div className="row g-4 mb-4">
            <div className="col-md-4">
              <div className="card border-0 shadow-sm rounded-4 h-100 p-4 border-start border-4 border-primary">
                <h6 className="text-muted fw-semibold mb-2">Tổng giấy phép đã cấp</h6>
                <h3 className="fw-bold mb-0">342 <span className="fs-6 text-muted fw-normal">giấy phép</span></h3>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-0 shadow-sm rounded-4 h-100 p-4 border-start border-4 border-danger">
                <h6 className="text-muted fw-semibold mb-2">Giấy phép Thương mại / Độc quyền</h6>
                <h3 className="fw-bold mb-0">86 <span className="fs-6 text-muted fw-normal">giấy phép</span></h3>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-0 shadow-sm rounded-4 h-100 p-4 border-start border-4 border-warning">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h6 className="text-muted fw-semibold mb-2">Cảnh báo vi phạm (Content ID)</h6>
                    <h3 className="fw-bold mb-0 text-warning">2 <span className="fs-6 text-muted fw-normal">cảnh báo</span></h3>
                  </div>
                  <button className="btn btn-sm btn-warning text-dark rounded-pill">Kiểm tra ngay</button>
                </div>
              </div>
            </div>
          </div>

          {/* ================= BỘ LỌC & TÌM KIẾM ================= */}
          <div className="card border-0 shadow-sm rounded-4 mb-4">
            <div className="card-body p-3 d-flex flex-wrap gap-3 align-items-center justify-content-between">
              
              {/* Thanh tìm kiếm */}
              <div className="input-group" style={{ maxWidth: "400px" }}>
                <span className="input-group-text bg-light border-end-0">
                  <i className="bi bi-search text-muted"></i>
                </span>
                <input 
                  type="text" 
                  className="form-control bg-light border-start-0 ps-0" 
                  placeholder="Tìm theo Mã giấy phép, Tên khách hàng..." 
                />
              </div>

              {/* Lọc theo Loại giấy phép & Trạng thái */}
              <div className="d-flex gap-2">
                <select className="form-select bg-light border-0" style={{ minWidth: "160px" }}>
                  <option value="all">Mọi loại giấy phép</option>
                  <option value="personal">Cá nhân (Standard)</option>
                  <option value="commercial">Thương mại (Pro)</option>
                  <option value="exclusive">Độc quyền (Bán đứt)</option>
                </select>

                <select className="form-select bg-light border-0" style={{ minWidth: "150px" }}>
                  <option value="active">Đang hiệu lực</option>
                  <option value="expired">Đã hết hạn</option>
                  <option value="disputed">Đang tranh chấp</option>
                </select>
              </div>

            </div>
          </div>

          {/* ================= BẢNG DANH SÁCH GIẤY PHÉP ================= */}
          <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light text-muted small text-uppercase">
                  <tr>
                    <th className="ps-4 py-3">Mã Giấy Phép / Khách Hàng</th>
                    <th className="py-3">Tác Phẩm</th>
                    <th className="py-3">Loại Giấy Phép</th>
                    <th className="py-3">Mã Theo Dõi (Watermark ID)</th>
                    <th className="py-3 text-center">Trạng Thái</th>
                    <th className="pe-4 py-3 text-end">Chứng Chỉ</th>
                  </tr>
                </thead>
                <tbody className="bg-white border-top-0">
                  
                  {/* Item 1: Thương mại */}
                  <tr>
                    <td className="ps-4 py-3">
                      <div className="fw-bold text-dark mb-1">LIC-2026-9871X</div>
                      <div className="small text-muted"><i className="bi bi-person-fill me-1"></i> Creative Agency VN</div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <img src="https://placehold.co/40x40" alt="Cover" className="rounded-2 me-2" style={{ width: "40px", height: "40px", objectFit: "cover" }} />
                        <span className="fw-medium text-dark">Cơn Mưa Ngang Qua</span>
                      </div>
                    </td>
                    <td>
                      <span className="badge bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25 rounded-pill px-3 py-1">
                        Thương mại
                      </span>
                    </td>
                    <td>
                      <code className="text-secondary bg-light px-2 py-1 rounded">WMK-CNMQ-8821</code>
                    </td>
                    <td className="text-center">
                      <span className="text-success small fw-bold"><i className="bi bi-shield-check me-1"></i> Hợp lệ</span>
                    </td>
                    <td className="pe-4 text-end">
                      <button className="btn btn-sm btn-light text-primary fw-medium" title="Xem Hợp Đồng Điện Tử">
                        <i className="bi bi-file-earmark-pdf-fill me-1"></i> PDF
                      </button>
                    </td>
                  </tr>

                  {/* Item 2: Cá nhân */}
                  <tr>
                    <td className="ps-4 py-3">
                      <div className="fw-bold text-dark mb-1">LIC-2026-9870P</div>
                      <div className="small text-muted"><i className="bi bi-person-fill me-1"></i> Nguyễn Văn A</div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <img src="https://placehold.co/40x40" alt="Cover" className="rounded-2 me-2" style={{ width: "40px", height: "40px", objectFit: "cover" }} />
                        <span className="fw-medium text-dark">Nắng Ấm Xa Dần</span>
                      </div>
                    </td>
                    <td>
                      <span className="badge bg-info bg-opacity-10 text-info border border-info border-opacity-25 rounded-pill px-3 py-1">
                        Cá nhân
                      </span>
                    </td>
                    <td>
                      <span className="text-muted small fst-italic">Không áp dụng</span>
                    </td>
                    <td className="text-center">
                      <span className="text-success small fw-bold"><i className="bi bi-shield-check me-1"></i> Hợp lệ</span>
                    </td>
                    <td className="pe-4 text-end">
                      <button className="btn btn-sm btn-light text-primary fw-medium">
                        <i className="bi bi-file-earmark-pdf-fill me-1"></i> PDF
                      </button>
                    </td>
                  </tr>

                  {/* Item 3: Độc quyền */}
                  <tr>
                    <td className="ps-4 py-3">
                      <div className="fw-bold text-dark mb-1">LIC-2026-9865E</div>
                      <div className="small text-muted"><i className="bi bi-person-fill me-1"></i> M-TP Entertainment</div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <img src="https://placehold.co/40x40" alt="Cover" className="rounded-2 me-2" style={{ width: "40px", height: "40px", objectFit: "cover" }} />
                        <span className="fw-medium text-dark">Chắc Ai Đó Sẽ Về</span>
                      </div>
                    </td>
                    <td>
                      <span className="badge bg-warning bg-opacity-10 text-warning border border-warning border-opacity-50 rounded-pill px-3 py-1">
                        <i className="bi bi-star-fill me-1"></i> Độc quyền
                      </span>
                    </td>
                    <td>
                      <code className="text-secondary bg-light px-2 py-1 rounded">WMK-CADSV-1102</code>
                    </td>
                    <td className="text-center">
                      <span className="text-primary small fw-bold"><i className="bi bi-arrow-left-right me-1"></i> Đã chuyển nhượng</span>
                    </td>
                    <td className="pe-4 text-end">
                      <button className="btn btn-sm btn-light text-primary fw-medium">
                        <i className="bi bi-file-earmark-pdf-fill me-1"></i> PDF
                      </button>
                    </td>
                  </tr>

                </tbody>
              </table>
            </div>
            
            {/* Phân trang */}
            <div className="card-footer bg-white p-3 d-flex justify-content-between align-items-center border-top">
              <span className="text-muted small">Hiển thị 1 - 3 của 342 giấy phép</span>
              <nav>
                <ul className="pagination pagination-sm mb-0">
                  <li className="page-item disabled"><a className="page-link" href="#">Trước</a></li>
                  <li className="page-item active"><a className="page-link" href="#" style={{backgroundColor: "var(--accent-color)", borderColor: "var(--accent-color)"}}>1</a></li>
                  <li className="page-item"><a className="page-link text-dark" href="#">2</a></li>
                  <li className="page-item"><a className="page-link text-dark" href="#">3</a></li>
                  <li className="page-item"><a className="page-link text-dark" href="#">Sau</a></li>
                </ul>
              </nav>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default ArtistLicensesPage;