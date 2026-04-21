const SummaryOrder = () => {
  return (
    <div className="order-summary" data-aos="fade-left" data-aos-delay="200">
      <div className="order-summary-header">
        <h3>Tóm tắt đơn hàng</h3>
        <span className="item-count">2 tài nguyên âm thanh</span>
      </div>

      <div className="order-summary-content">
        <div className="order-items">
          {/* Sản phẩm 1: Bài hát hoàn chỉnh - Giấy phép thương mại */}
          <div className="order-item">
            <div className="order-item-image">
              <img
                src="../../assets/img/music/cover-1.webp"
                alt="Song Cover"
                className="img-fluid rounded"
              />
            </div>
            <div className="order-item-details">
              <h4 className="text-truncate">Chạy Ngay Đi (Full Song)</h4>
              <p className="order-item-variant text-muted mb-1">
                Nghệ sĩ: Sơn Tùng M-TP
              </p>
              <p className="order-item-variant text-primary fw-medium">
                Giấy phép: Thương mại (Commercial)
              </p>
              <div className="order-item-price mt-2">
                <span className="quantity">1 ×</span>
                <span className="price">500.000₫</span>
              </div>
            </div>
          </div>

          {/* Sản phẩm 2: Hiệu ứng âm thanh - Giấy phép cá nhân */}
          <div className="order-item mt-3">
            <div className="order-item-image">
              <img
                src="../../assets/img/music/sfx-cover.webp"
                alt="SFX Cover"
                className="img-fluid rounded"
              />
            </div>
            <div className="order-item-details">
              <h4 className="text-truncate">Cinematic Rain Impact (SFX)</h4>
              <p className="order-item-variant text-muted mb-1">
                Cấp độ: Đoạn âm thanh ngắn
              </p>
              <p className="order-item-variant text-success fw-medium">
                Giấy phép: Cá nhân (Personal)
              </p>
              <div className="order-item-price mt-2">
                <span className="quantity">1 ×</span>
                <span className="price">250.000₫</span>
              </div>
            </div>
          </div>
        </div>

        <div className="promo-code mt-4">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Mã giảm giá nghệ sĩ"
              aria-label="Mã giảm giá"
            />
            <button className="btn btn-outline-primary" type="button">
              Áp dụng
            </button>
          </div>
        </div>

        <div className="order-totals mt-4">
          <div className="order-subtotal d-flex justify-content-between mb-2">
            <span className="text-muted">Tạm tính</span>
            <span className="fw-medium">750.000₫</span>
          </div>
          {/* Đã bỏ phí vận chuyển vì đây là sản phẩm số */}
          <div className="order-tax d-flex justify-content-between mb-2">
            <span className="text-muted">Thuế VAT (8%)</span>
            <span className="fw-medium">60.000₫</span>
          </div>
          <hr />
          <div className="order-total d-flex justify-content-between fs-5 fw-bold">
            <span>Tổng cộng</span>
            <span className="text-primary">810.000₫</span>
          </div>
        </div>

        <div className="secure-checkout mt-4 text-center">
          <div className="secure-checkout-header text-success mb-2">
            <i className="bi bi-shield-check me-2"></i>
            <span>Giao dịch an toàn & Bảo vệ bản quyền</span>
          </div>
          <p className="text-muted small">
            File âm thanh gốc chất lượng cao cùng giấy chứng nhận bản quyền sẽ
            khả dụng ngay sau khi thanh toán thành công.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SummaryOrder;
