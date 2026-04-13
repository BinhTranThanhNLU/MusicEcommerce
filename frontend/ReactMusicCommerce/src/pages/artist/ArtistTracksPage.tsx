import React from "react";
import "../../assets/css/artistDashboard.css";
import ArtistSidebar from "../../components/layouts/ArtistSidebar";
import ArtistHeader from "../../components/layouts/ArtistHeader";

const ArtistTracksPage = () => {
  return (
    <div className="artist-dashboard d-flex">
      <ArtistSidebar />

      <main className="main-content flex-grow-1 bg-light min-vh-100">
        <ArtistHeader />

        <div className="container-fluid py-4 px-lg-4">
          <div className="d-flex justify-content-between align-items-end mb-4">
            <div>
              <h3 className="fw-bold mb-1" style={{ color: "var(--heading-color)" }}>Kho nhạc của tôi</h3>
              <p className="text-muted mb-0">Quản lý toàn bộ tác phẩm, chỉnh sửa metadata và theo dõi lượt mua.</p>
            </div>
            <div>
              <button className="btn rounded-pill px-4 shadow-sm text-white" style={{ backgroundColor: "var(--accent-color)" }}>
                <i className="bi bi-cloud-arrow-up-fill me-2"></i> Tải nhạc lên
              </button>
            </div>
          </div>

          {/* ================= BỘ LỌC & TÌM KIẾM ================= */}
          <div className="card border-0 shadow-sm rounded-4 mb-4">
            <div className="card-body p-3 d-flex flex-wrap gap-3 align-items-center justify-content-between">
              
              {/* Thanh tìm kiếm */}
              <div className="input-group" style={{ maxWidth: "350px" }}>
                <span className="input-group-text bg-light border-end-0">
                  <i className="bi bi-search text-muted"></i>
                </span>
                <input 
                  type="text" 
                  className="form-control bg-light border-start-0 ps-0" 
                  placeholder="Tìm theo tên bài, tag, thể loại..." 
                />
              </div>

              {/* Lọc theo Trạng thái & Thể loại */}
              <div className="d-flex gap-2">
                <select className="form-select bg-light border-0" style={{ minWidth: "150px" }}>
                  <option value="all">Tất cả trạng thái</option>
                  <option value="published">Đang xuất bản</option>
                  <option value="pending">Đang chờ duyệt</option>
                  <option value="draft">Bản nháp</option>
                </select>

                <select className="form-select bg-light border-0" style={{ minWidth: "150px" }}>
                  <option value="all">Mọi thể loại</option>
                  <option value="pop">Pop / Ballad</option>
                  <option value="rap">Rap / Hip-hop</option>
                  <option value="edm">EDM</option>
                </select>
              </div>

            </div>
          </div>

          {/* ================= BẢNG DANH SÁCH BÀI HÁT ================= */}
          <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light text-muted small text-uppercase">
                  <tr>
                    <th className="ps-4 py-3" style={{ width: "35%" }}>Tác phẩm & Metadata</th>
                    <th className="py-3">Giá (Cá nhân / Thương mại)</th>
                    <th className="py-3 text-center">Thống kê</th>
                    <th className="py-3 text-center">Trạng thái</th>
                    <th className="pe-4 py-3 text-end">Hành động</th>
                  </tr>
                </thead>
                <tbody className="bg-white border-top-0">
                  
                  {/* Item 1 */}
                  <tr>
                    <td className="ps-4 py-3">
                      <div className="d-flex align-items-center">
                        <img 
                          src="https://placehold.co/60x60" 
                          alt="Cover" 
                          className="rounded-3 me-3" 
                          style={{ width: "60px", height: "60px", objectFit: "cover" }} 
                        />
                        <div>
                          <h6 className="mb-1 fw-bold text-dark">Cơn Mưa Ngang Qua</h6>
                          {/* Dữ liệu phục vụ Tìm kiếm thông minh */}
                          <div className="d-flex gap-1 flex-wrap mt-1">
                            <span className="badge bg-secondary bg-opacity-10 text-secondary border fw-normal">Pop / Ballad</span>
                            <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 fw-normal">120 BPM</span>
                            <span className="badge bg-info bg-opacity-10 text-info border border-info border-opacity-25 fw-normal">Buồn</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex flex-column">
                        <span className="fw-semibold text-dark">150.000₫ <small className="text-muted fw-normal">/ cá nhân</small></span>
                        <span className="fw-semibold text-danger">2.500.000₫ <small className="text-muted fw-normal">/ thương mại</small></span>
                      </div>
                    </td>
                    <td className="text-center">
                      <div className="d-flex justify-content-center gap-3">
                        <div className="text-muted small" title="Lượt nghe thử"><i className="bi bi-play-circle me-1"></i> 5.2k</div>
                        <div className="text-success small fw-medium" title="Lượt mua"><i className="bi bi-cart-check me-1"></i> 120</div>
                      </div>
                    </td>
                    <td className="text-center">
                      <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 rounded-pill px-3 py-2">
                        <i className="bi bi-check-circle-fill me-1"></i> Đang xuất bản
                      </span>
                    </td>
                    <td className="pe-4 text-end">
                      <button className="btn btn-sm btn-light me-2" title="Chỉnh sửa">
                        <i className="bi bi-pencil-square text-primary"></i>
                      </button>
                      <button className="btn btn-sm btn-light" title="Ẩn/Xóa bài">
                        <i className="bi bi-trash text-danger"></i>
                      </button>
                    </td>
                  </tr>

                  {/* Item 2 */}
                  <tr>
                    <td className="ps-4 py-3">
                      <div className="d-flex align-items-center">
                        <img 
                          src="https://placehold.co/60x60" 
                          alt="Cover" 
                          className="rounded-3 me-3" 
                          style={{ width: "60px", height: "60px", objectFit: "cover" }} 
                        />
                        <div>
                          <h6 className="mb-1 fw-bold text-dark">Nắng Ấm Xa Dần (Remix)</h6>
                          <div className="d-flex gap-1 flex-wrap mt-1">
                            <span className="badge bg-secondary bg-opacity-10 text-secondary border fw-normal">EDM</span>
                            <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 fw-normal">145 BPM</span>
                            <span className="badge bg-info bg-opacity-10 text-info border border-info border-opacity-25 fw-normal">Sôi động</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex flex-column">
                        <span className="fw-semibold text-dark">200.000₫ <small className="text-muted fw-normal">/ cá nhân</small></span>
                        <span className="fw-semibold text-danger">3.000.000₫ <small className="text-muted fw-normal">/ thương mại</small></span>
                      </div>
                    </td>
                    <td className="text-center">
                      <div className="d-flex justify-content-center gap-3">
                        <div className="text-muted small"><i className="bi bi-play-circle me-1"></i> 3.1k</div>
                        <div className="text-success small fw-medium"><i className="bi bi-cart-check me-1"></i> 85</div>
                      </div>
                    </td>
                    <td className="text-center">
                      <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 rounded-pill px-3 py-2">
                        <i className="bi bi-check-circle-fill me-1"></i> Đang xuất bản
                      </span>
                    </td>
                    <td className="pe-4 text-end">
                      <button className="btn btn-sm btn-light me-2">
                        <i className="bi bi-pencil-square text-primary"></i>
                      </button>
                      <button className="btn btn-sm btn-light">
                        <i className="bi bi-trash text-danger"></i>
                      </button>
                    </td>
                  </tr>

                  {/* Item 3 */}
                  <tr>
                    <td className="ps-4 py-3">
                      <div className="d-flex align-items-center">
                        <img 
                          src="https://placehold.co/60x60" 
                          alt="Cover" 
                          className="rounded-3 me-3 opacity-75" 
                          style={{ width: "60px", height: "60px", objectFit: "cover", filter: "grayscale(50%)" }} 
                        />
                        <div>
                          <h6 className="mb-1 fw-bold text-dark">Chắc Ai Đó Sẽ Về</h6>
                          <div className="d-flex gap-1 flex-wrap mt-1">
                            <span className="badge bg-secondary bg-opacity-10 text-secondary border fw-normal">Pop</span>
                            <span className="badge bg-info bg-opacity-10 text-info border border-info border-opacity-25 fw-normal">Tâm trạng</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex flex-column">
                        <span className="fw-semibold text-muted">Chưa thiết lập</span>
                      </div>
                    </td>
                    <td className="text-center">
                      <div className="d-flex justify-content-center gap-3 text-muted">
                        <span>--</span>
                      </div>
                    </td>
                    <td className="text-center">
                      <span className="badge bg-warning bg-opacity-10 text-warning border border-warning border-opacity-25 rounded-pill px-3 py-2">
                        <i className="bi bi-hourglass-split me-1"></i> Đang chờ duyệt
                      </span>
                    </td>
                    <td className="pe-4 text-end">
                      <button className="btn btn-sm btn-light me-2">
                        <i className="bi bi-pencil-square text-primary"></i>
                      </button>
                      <button className="btn btn-sm btn-light">
                        <i className="bi bi-trash text-danger"></i>
                      </button>
                    </td>
                  </tr>

                </tbody>
              </table>
            </div>
            
            {/* Phân trang (Pagination) */}
            <div className="card-footer bg-white p-3 d-flex justify-content-between align-items-center border-top">
              <span className="text-muted small">Hiển thị 1 - 3 của 28 tác phẩm</span>
              <nav>
                <ul className="pagination pagination-sm mb-0">
                  <li className="page-item disabled">
                    <a className="page-link" href="#" tabIndex={-1}>Trước</a>
                  </li>
                  <li className="page-item active"><a className="page-link" href="#" style={{backgroundColor: "var(--accent-color)", borderColor: "var(--accent-color)"}}>1</a></li>
                  <li className="page-item"><a className="page-link text-dark" href="#">2</a></li>
                  <li className="page-item"><a className="page-link text-dark" href="#">3</a></li>
                  <li className="page-item">
                    <a className="page-link text-dark" href="#">Sau</a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default ArtistTracksPage;