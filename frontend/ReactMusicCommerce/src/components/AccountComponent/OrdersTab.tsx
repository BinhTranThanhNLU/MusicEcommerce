const OrdersTab = () => {
  return (
    <div className="tab-pane fade" id="orders">
      <div className="section-header" data-aos="fade-up">
        <h2>Lịch sử giao dịch</h2>
        <div className="header-actions">
          <div className="dropdown">
            <button className="filter-btn" data-bs-toggle="dropdown">
              <i className="bi bi-funnel"></i>
              <span>Lọc hóa đơn</span>
            </button>
            <ul className="dropdown-menu">
              <li>
                <a className="dropdown-item" href="#">
                  Tất cả
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  Thành công
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  Thất bại
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="orders-grid">
        {/* Order Card 1 */}
        <div
          className="order-card p-3 border rounded mb-4 bg-white shadow-sm"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          <div className="order-header d-flex justify-content-between border-bottom pb-2 mb-3">
            <div className="order-id">
              <span className="fw-bold me-2">Mã hóa đơn:</span>
              <span className="text-primary">#INV-2026-8942</span>
            </div>
            <div className="order-date text-muted">22 Tháng 4, 2026</div>
          </div>
          <div className="order-content">
            <div className="order-info mb-3">
              <div className="d-flex justify-content-between mb-2">
                <span>Trạng thái thanh toán:</span>
                <span className="badge bg-success">Thành công (PAID)</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Tổng tài nguyên:</span>
                <span>2 Sản phẩm</span>
              </div>
              <div className="d-flex justify-content-between fw-bold">
                <span>Tổng thanh toán:</span>
                <span className="text-danger">550.000 VNĐ</span>
              </div>
            </div>
          </div>
          <div className="order-footer">
            <button
              type="button"
              className="btn btn-sm btn-outline-primary w-100"
              data-bs-toggle="collapse"
              data-bs-target="#details1"
              aria-expanded="false"
            >
              Xem chi tiết tài nguyên mua
            </button>
          </div>

          {/* Chi tiết đơn hàng */}
          <div className="collapse order-details mt-3" id="details1">
            <div className="details-content bg-light p-3 rounded">
              <h6 className="mb-3">Tài nguyên số đã cấp phép:</h6>
              <div className="order-items">
                <div className="d-flex justify-content-between align-items-center mb-2 border-bottom pb-2">
                  <div>
                    <div className="fw-bold">Lofi Chill Beats Vol 1</div>
                    <small className="text-muted">Loại: Thương mại</small>
                  </div>
                  <div>450.000 VNĐ</div>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-2 border-bottom pb-2">
                  <div>
                    <div className="fw-bold">Cinematic Epic Trailer Intro</div>
                    <small className="text-muted">Loại: Cá nhân</small>
                  </div>
                  <div>100.000 VNĐ</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersTab;
