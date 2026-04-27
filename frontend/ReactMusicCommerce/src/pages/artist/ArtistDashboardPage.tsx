import "../../assets/css/artistDashboard.css";

const ArtistDashboardPage = () => {
  
  return (
    <div className="container-fluid py-4 px-lg-4">
          {/* Tiêu đề */}
          <div className="d-flex justify-content-between align-items-end mb-4">
            <div>
              <h3 className="fw-bold mb-1" style={{ color: "var(--heading-color)", fontFamily: "var(--heading-font)" }}>Tổng quan cửa hàng</h3>
              <p className="text-muted mb-0">Theo dõi doanh thu và hoạt động kinh doanh âm nhạc của bạn.</p>
            </div>
            <div>
              <button className="btn rounded-pill px-4 shadow-sm text-white" style={{ backgroundColor: "var(--accent-color)" }}>
                <i className="bi bi-plus-lg me-2"></i> Đăng tác phẩm mới
              </button>
            </div>
          </div>

          {/* Row 1: Thống kê nhanh */}
          <div className="row g-4 mb-4">
            {/* Card Doanh thu */}
            <div className="col-xl-3 col-sm-6">
              <div className="card border-0 shadow-sm rounded-4 h-100">
                <div className="card-body p-4 d-flex align-items-center">
                  <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex justify-content-center align-items-center me-3" style={{ width: "60px", height: "60px" }}>
                    <i className="bi bi-wallet2 fs-3"></i>
                  </div>
                  <div>
                    <p className="text-muted mb-1 small text-uppercase fw-semibold">Doanh thu tháng</p>
                    <h4 className="fw-bold mb-0">12.5M ₫</h4>
                    <small className="text-success fw-medium"><i className="bi bi-arrow-up-short"></i> +15%</small>
                  </div>
                </div>
              </div>
            </div>

            {/* Card Lượt tải/mua */}
            <div className="col-xl-3 col-sm-6">
              <div className="card border-0 shadow-sm rounded-4 h-100">
                <div className="card-body p-4 d-flex align-items-center">
                  <div className="bg-success bg-opacity-10 text-success rounded-circle d-flex justify-content-center align-items-center me-3" style={{ width: "60px", height: "60px" }}>
                    <i className="bi bi-cart-check fs-3"></i>
                  </div>
                  <div>
                    <p className="text-muted mb-1 small text-uppercase fw-semibold">Lượt bán License</p>
                    <h4 className="fw-bold mb-0">342</h4>
                    <small className="text-success fw-medium"><i className="bi bi-arrow-up-short"></i> +5%</small>
                  </div>
                </div>
              </div>
            </div>

            {/* Card Số lượng bài hát */}
            <div className="col-xl-3 col-sm-6">
              <div className="card border-0 shadow-sm rounded-4 h-100">
                <div className="card-body p-4 d-flex align-items-center">
                  <div className="bg-warning bg-opacity-10 text-warning rounded-circle d-flex justify-content-center align-items-center me-3" style={{ width: "60px", height: "60px" }}>
                    <i className="bi bi-music-note-list fs-3"></i>
                  </div>
                  <div>
                    <p className="text-muted mb-1 small text-uppercase fw-semibold">Tác phẩm đang bán</p>
                    <h4 className="fw-bold mb-0">28</h4>
                    <small className="text-muted">Đang trực tuyến</small>
                  </div>
                </div>
              </div>
            </div>

            {/* Card Lượt nghe thử */}
            <div className="col-xl-3 col-sm-6">
              <div className="card border-0 shadow-sm rounded-4 h-100">
                <div className="card-body p-4 d-flex align-items-center">
                  <div className="bg-info bg-opacity-10 text-info rounded-circle d-flex justify-content-center align-items-center me-3" style={{ width: "60px", height: "60px" }}>
                    <i className="bi bi-play-circle fs-3"></i>
                  </div>
                  <div>
                    <p className="text-muted mb-1 small text-uppercase fw-semibold">Lượt nghe thử</p>
                    <h4 className="fw-bold mb-0">5.2K</h4>
                    <small className="text-success fw-medium"><i className="bi bi-arrow-up-short"></i> +20%</small>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Row 2: Biểu đồ & Top bài hát */}
          <div className="row g-4 mb-4">
            {/* Vùng chứa Biểu đồ */}
            <div className="col-lg-8">
              <div className="card border-0 shadow-sm rounded-4 h-100 p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="fw-bold mb-0">Thống kê doanh thu</h5>
                  <select className="form-select w-auto form-select-sm border-0 bg-light fw-medium">
                    <option>7 ngày qua</option>
                    <option>30 ngày qua</option>
                    <option>Năm nay</option>
                  </select>
                </div>
                {/* Giả lập biểu đồ */}
                <div className="bg-light rounded-3 d-flex flex-column justify-content-center align-items-center" style={{ minHeight: "300px" }}>
                    <div className="w-100 px-4 d-flex align-items-end justify-content-between" style={{height: "200px"}}>
                        {/* Cột giả */}
                        <div className="bg-primary rounded-top opacity-75" style={{width: "8%", height: "40%"}}></div>
                        <div className="bg-primary rounded-top opacity-75" style={{width: "8%", height: "60%"}}></div>
                        <div className="bg-primary rounded-top opacity-75" style={{width: "8%", height: "30%"}}></div>
                        <div className="bg-primary rounded-top opacity-75" style={{width: "8%", height: "80%"}}></div>
                        <div className="bg-primary rounded-top opacity-75" style={{width: "8%", height: "50%"}}></div>
                        <div className="bg-primary rounded-top opacity-75" style={{width: "8%", height: "90%"}}></div>
                        <div className="bg-primary rounded-top opacity-75" style={{width: "8%", height: "100%"}}></div>
                    </div>
                    <p className="mt-3 text-muted small">Khu vực tích hợp Recharts</p>
                </div>
              </div>
            </div>

            {/* Top Bài hát */}
            <div className="col-lg-4">
              <div className="card border-0 shadow-sm rounded-4 h-100 p-0 overflow-hidden">
                <div className="p-4 border-bottom">
                    <h5 className="fw-bold mb-0">Top Tác Phẩm Bán Chạy</h5>
                </div>
                <div className="list-group list-group-flush">
                  {/* Item 1 */}
                  <div className="list-group-item p-3 d-flex justify-content-between align-items-center border-0">
                    <div className="d-flex align-items-center">
                      <div className="position-relative">
                        <img src="../../assets/img/music.png" alt="Cover" className="rounded-3" style={{ width: "50px", height: "50px", objectFit: "cover" }} />
                        <span className="position-absolute top-0 start-0 translate-middle badge rounded-circle bg-warning border border-light">1</span>
                      </div>
                      <div className="ms-3">
                        <h6 className="mb-0 fw-bold text-truncate" style={{maxWidth: "150px"}}>Cơn Mưa Ngang Qua</h6>
                        <small className="text-muted">120 Licenses</small>
                      </div>
                    </div>
                    <span className="fw-bold text-success">4.5M ₫</span>
                  </div>
                  
                  {/* Item 2 */}
                  <div className="list-group-item p-3 d-flex justify-content-between align-items-center border-0">
                    <div className="d-flex align-items-center">
                      <div className="position-relative">
                        <img src="../../assets/img/music.png" alt="Cover" className="rounded-3" style={{ width: "50px", height: "50px", objectFit: "cover" }} />
                        <span className="position-absolute top-0 start-0 translate-middle badge rounded-circle bg-secondary border border-light">2</span>
                      </div>
                      <div className="ms-3">
                        <h6 className="mb-0 fw-bold text-truncate" style={{maxWidth: "150px"}}>Nắng Ấm Xa Dần</h6>
                        <small className="text-muted">85 Licenses</small>
                      </div>
                    </div>
                    <span className="fw-bold text-success">3.2M ₫</span>
                  </div>

                   {/* Item 3 */}
                   <div className="list-group-item p-3 d-flex justify-content-between align-items-center border-0">
                    <div className="d-flex align-items-center">
                      <div className="position-relative">
                        <img src="../../assets/img/music.png" alt="Cover" className="rounded-3" style={{ width: "50px", height: "50px", objectFit: "cover" }} />
                        <span className="position-absolute top-0 start-0 translate-middle badge rounded-circle" style={{backgroundColor: "#cd7f32", border: "1px solid #fff"}}>3</span>
                      </div>
                      <div className="ms-3">
                        <h6 className="mb-0 fw-bold text-truncate" style={{maxWidth: "150px"}}>Chắc Ai Đó Sẽ Về</h6>
                        <small className="text-muted">40 Licenses</small>
                      </div>
                    </div>
                    <span className="fw-bold text-success">1.8M ₫</span>
                  </div>
                </div>
                <div className="p-3 bg-light text-center mt-auto">
                    <a href="#" className="text-decoration-none fw-medium text-primary small">Xem chi tiết <i className="bi bi-arrow-right"></i></a>
                </div>
              </div>
            </div>
          </div>

          {/* Row 3: Lịch sử bán bản quyền gần đây */}
          <div className="card border-0 shadow-sm rounded-4 p-0 overflow-hidden">
            <div className="p-4 border-bottom d-flex justify-content-between align-items-center bg-white">
              <h5 className="fw-bold mb-0">Giao dịch bản quyền mới nhất</h5>
              <button className="btn btn-sm btn-outline-secondary rounded-pill px-3">Tải báo cáo CSV</button>
            </div>
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light text-muted small text-uppercase">
                  <tr>
                    <th className="ps-4">Mã Đơn</th>
                    <th>Tác Phẩm</th>
                    <th>Khách Hàng</th>
                    <th>Loại Giấy Phép</th>
                    <th>Doanh thu</th>
                    <th>Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  <tr>
                    <td className="ps-4 fw-medium text-primary">#ORD-9871</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="bg-light rounded p-2 me-3"><i className="bi bi-music-note-beamed text-dark"></i></div>
                        <span className="fw-bold">Cơn Mưa Ngang Qua</span>
                      </div>
                    </td>
                    <td>Creative Agency VN</td>
                    <td><span className="badge bg-danger bg-opacity-10 text-danger rounded-pill px-3">Thương mại</span></td>
                    <td className="fw-bold">2.500.000₫</td>
                    <td><span className="badge bg-success rounded-pill px-3"><i className="bi bi-check-circle me-1"></i> Hoàn tất</span></td>
                  </tr>
                  <tr>
                    <td className="ps-4 fw-medium text-primary">#ORD-9870</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="bg-light rounded p-2 me-3"><i className="bi bi-music-note-beamed text-dark"></i></div>
                        <span className="fw-bold">Nắng Ấm Xa Dần</span>
                      </div>
                    </td>
                    <td>Nguyễn Văn A</td>
                    <td><span className="badge bg-info bg-opacity-10 text-info rounded-pill px-3">Cá nhân</span></td>
                    <td className="fw-bold">150.000₫</td>
                    <td><span className="badge bg-success rounded-pill px-3"><i className="bi bi-check-circle me-1"></i> Hoàn tất</span></td>
                  </tr>
                  <tr>
                    <td className="ps-4 fw-medium text-primary">#ORD-9869</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="bg-light rounded p-2 me-3"><i className="bi bi-music-note-beamed text-dark"></i></div>
                        <span className="fw-bold">Em Của Ngày Hôm Qua</span>
                      </div>
                    </td>
                    <td>Vloger Minh Hiếu</td>
                    <td><span className="badge bg-warning bg-opacity-10 text-warning rounded-pill px-3">Youtube (Standard)</span></td>
                    <td className="fw-bold">500.000₫</td>
                    <td><span className="badge bg-secondary rounded-pill px-3"><i className="bi bi-clock me-1"></i> Chờ xử lý</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="p-3 border-top text-center bg-white">
                 <a href="#" className="text-decoration-none fw-medium text-primary small">Xem tất cả giao dịch</a>
            </div>
          </div>

    </div>
  );
};

export default ArtistDashboardPage;