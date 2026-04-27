import "../../assets/css/artistDashboard.css";

const ArtistRevenuePage = () => {
  return (
    <div className="container-fluid py-4 px-lg-4">
          {/* ================= TIÊU ĐỀ ================= */}
          <div className="d-flex justify-content-between align-items-end mb-4">
            <div>
              <h3 className="fw-bold mb-1" style={{ color: "var(--heading-color)", fontFamily: "var(--heading-font)" }}>Doanh thu & Rút tiền</h3>
              <p className="text-muted mb-0">Quản lý thu nhập từ việc bán bản quyền âm nhạc của bạn.</p>
            </div>
            <div>
              <button className="btn rounded-pill px-4 shadow-sm text-white" style={{ backgroundColor: "var(--accent-color)" }}>
                <i className="bi bi-cash-stack me-2"></i> Yêu cầu rút tiền
              </button>
            </div>
          </div>

          {/* ================= THỐNG KÊ TÀI CHÍNH ================= */}
          <div className="row g-4 mb-4">
            {/* Card Số dư khả dụng (Nổi bật nhất) */}
            <div className="col-lg-6">
              <div className="card border-0 shadow-sm rounded-4 h-100 text-white" style={{ background: "linear-gradient(135deg, var(--accent-color), #4a4a4a)" }}>
                <div className="card-body p-4 d-flex flex-column justify-content-between">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="mb-0 fw-medium opacity-75">Số dư khả dụng</h5>
                    <i className="bi bi-wallet2 fs-2 opacity-50"></i>
                  </div>
                  <div>
                    <h1 className="fw-bold display-5 mb-2">12.500.000 ₫</h1>
                    <p className="mb-0 opacity-75 small">Đã trừ 10% phí nền tảng (Platform Fee)</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="row g-4 h-100">
                {/* Card Chờ xử lý */}
                <div className="col-sm-6">
                  <div className="card border-0 shadow-sm rounded-4 h-100">
                    <div className="card-body p-4 d-flex flex-column justify-content-center">
                      <div className="d-flex align-items-center mb-2">
                        <div className="bg-warning bg-opacity-10 text-warning rounded p-2 me-2">
                          <i className="bi bi-hourglass-split"></i>
                        </div>
                        <span className="text-muted fw-semibold small text-uppercase">Đang chờ xử lý</span>
                      </div>
                      <h4 className="fw-bold mb-0">500.000 ₫</h4>
                      <small className="text-muted mt-1">Sẽ cộng vào số dư sau 24h</small>
                    </div>
                  </div>
                </div>

                {/* Card Tổng doanh thu trọn đời */}
                <div className="col-sm-6">
                  <div className="card border-0 shadow-sm rounded-4 h-100">
                    <div className="card-body p-4 d-flex flex-column justify-content-center">
                      <div className="d-flex align-items-center mb-2">
                        <div className="bg-success bg-opacity-10 text-success rounded p-2 me-2">
                          <i className="bi bi-graph-up-arrow"></i>
                        </div>
                        <span className="text-muted fw-semibold small text-uppercase">Tổng thu nhập</span>
                      </div>
                      <h4 className="fw-bold mb-0">45.800.000 ₫</h4>
                      <small className="text-success mt-1"><i className="bi bi-arrow-up-short"></i> Tăng trưởng ổn định</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row g-4">
            {/* ================= TÀI KHOẢN NHẬN TIỀN ================= */}
            <div className="col-lg-4">
              <div className="card border-0 shadow-sm rounded-4 mb-4 h-100">
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="fw-bold mb-0">Tài khoản nhận tiền</h5>
                    <button className="btn btn-sm btn-light text-primary"><i className="bi bi-pencil-square"></i> Sửa</button>
                  </div>

                  <div className="border rounded-4 p-3 mb-3 bg-light position-relative overflow-hidden">
                    <div className="position-absolute top-0 end-0 p-2 opacity-25">
                      <i className="bi bi-bank fs-1"></i>
                    </div>
                    <p className="text-muted small mb-1">Ngân hàng TMCP Ngoại Thương (Vietcombank)</p>
                    <h5 className="fw-bold tracking-wider mb-1">0123 4567 8910</h5>
                    <p className="fw-medium text-dark mb-0 text-uppercase">NGUYEN THANH TUNG</p>
                  </div>

                  <div className="alert alert-info bg-info bg-opacity-10 border-0 small mb-0">
                    <i className="bi bi-info-circle-fill me-2"></i>
                    Lệnh rút tiền sẽ được xử lý vào ngày 15 và 30 hàng tháng. Mức rút tối thiểu là 500.000 ₫.
                  </div>
                </div>
              </div>
            </div>

            {/* ================= LỊCH SỬ GIAO DỊCH ================= */}
            <div className="col-lg-8">
              <div className="card border-0 shadow-sm rounded-4 h-100 overflow-hidden">
                <div className="p-4 border-bottom d-flex justify-content-between align-items-center bg-white">
                  <h5 className="fw-bold mb-0">Lịch sử giao dịch</h5>
                  <select className="form-select form-select-sm w-auto bg-light border-0">
                    <option value="all">Tất cả giao dịch</option>
                    <option value="sales">Tiền thu từ bán nhạc</option>
                    <option value="withdrawals">Lịch sử rút tiền</option>
                  </select>
                </div>
                
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light text-muted small text-uppercase">
                      <tr>
                        <th className="ps-4 py-3">Ngày</th>
                        <th className="py-3">Mô tả giao dịch</th>
                        <th className="py-3 text-end">Số tiền</th>
                        <th className="pe-4 py-3 text-center">Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white border-top-0">
                      {/* Giao dịch bán nhạc */}
                      <tr>
                        <td className="ps-4 text-muted small">23/12/2025<br/>14:30</td>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="bg-success bg-opacity-10 text-success rounded-circle p-2 me-3">
                              <i className="bi bi-arrow-down-left"></i>
                            </div>
                            <div>
                              <p className="mb-0 fw-bold">Bán giấy phép Thương mại</p>
                              <small className="text-muted">Tác phẩm: Cơn Mưa Ngang Qua</small>
                            </div>
                          </div>
                        </td>
                        <td className="text-end fw-bold text-success">+ 2.250.000 ₫</td>
                        <td className="pe-4 text-center">
                          <span className="badge bg-success bg-opacity-10 text-success rounded-pill">Hoàn tất</span>
                        </td>
                      </tr>

                      {/* Giao dịch bán nhạc */}
                      <tr>
                        <td className="ps-4 text-muted small">22/12/2025<br/>09:15</td>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="bg-success bg-opacity-10 text-success rounded-circle p-2 me-3">
                              <i className="bi bi-arrow-down-left"></i>
                            </div>
                            <div>
                              <p className="mb-0 fw-bold">Bán giấy phép Cá nhân</p>
                              <small className="text-muted">Tác phẩm: Nắng Ấm Xa Dần</small>
                            </div>
                          </div>
                        </td>
                        <td className="text-end fw-bold text-success">+ 135.000 ₫</td>
                        <td className="pe-4 text-center">
                          <span className="badge bg-success bg-opacity-10 text-success rounded-pill">Hoàn tất</span>
                        </td>
                      </tr>

                      {/* Giao dịch rút tiền */}
                      <tr>
                        <td className="ps-4 text-muted small">15/12/2025<br/>10:00</td>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="bg-danger bg-opacity-10 text-danger rounded-circle p-2 me-3">
                              <i className="bi bi-arrow-up-right"></i>
                            </div>
                            <div>
                              <p className="mb-0 fw-bold">Rút tiền về Vietcombank</p>
                              <small className="text-muted">Mã GD: #WD-0992</small>
                            </div>
                          </div>
                        </td>
                        <td className="text-end fw-bold text-dark">- 10.000.000 ₫</td>
                        <td className="pe-4 text-center">
                          <span className="badge bg-success rounded-pill">Đã chuyển</span>
                        </td>
                      </tr>

                      {/* Giao dịch chờ xử lý */}
                      <tr>
                        <td className="ps-4 text-muted small">23/12/2025<br/>16:00</td>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="bg-success bg-opacity-10 text-success rounded-circle p-2 me-3">
                              <i className="bi bi-arrow-down-left"></i>
                            </div>
                            <div>
                              <p className="mb-0 fw-bold">Bán giấy phép Youtube</p>
                              <small className="text-muted">Tác phẩm: Em Của Ngày Hôm Qua</small>
                            </div>
                          </div>
                        </td>
                        <td className="text-end fw-bold text-warning">+ 450.000 ₫</td>
                        <td className="pe-4 text-center">
                          <span className="badge bg-warning bg-opacity-10 text-warning rounded-pill">Đang giữ (Hold)</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="p-3 bg-white text-center mt-auto border-top">
                    <a href="#" className="text-decoration-none fw-medium text-primary small">Xem báo cáo chi tiết <i className="bi bi-arrow-right"></i></a>
                </div>
              </div>
            </div>
          </div>

    </div>
  );
};

export default ArtistRevenuePage;