const SummaryOrder = () => {
  return (
    <div className="order-summary" data-aos="fade-left" data-aos-delay="200">
      <div className="order-summary-header">
        <h3>Tóm tắt đơn hàng</h3>
        <span className="item-count">2 sản phẩm</span>
      </div>

      <div className="order-summary-content">
        <div className="order-items">
          <div className="order-item">
            <div className="order-item-image">
              <img
                src="../../assets/img/product/product-1.webp"
                alt="Sản phẩm"
                className="img-fluid"
              />
            </div>
            <div className="order-item-details">
              <h4>Lorem Ipsum Dolor</h4>
              <p className="order-item-variant">Màu: Đen | Size: M</p>
              <div className="order-item-price">
                <span className="quantity">1 ×</span>
                <span className="price">89.99₫</span>
              </div>
            </div>
          </div>

          <div className="order-item">
            <div className="order-item-image">
              <img
                src="../../assets/img/product/product-1.webp"
                alt="Sản phẩm"
                className="img-fluid"
              />
            </div>
            <div className="order-item-details">
              <h4>Sit Amet Consectetur</h4>
              <p className="order-item-variant">Màu: Trắng | Size: L</p>
              <div className="order-item-price">
                <span className="quantity">2 ×</span>
                <span className="price">59.99₫</span>
              </div>
            </div>
          </div>
        </div>

        <div className="promo-code">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Mã giảm giá"
              aria-label="Mã giảm giá"
            />
            <button className="btn btn-outline-primary" type="button">
              Áp dụng
            </button>
          </div>
        </div>

        <div className="order-totals">
          <div className="order-subtotal d-flex justify-content-between">
            <span>Tạm tính</span>
            <span>209.97₫</span>
          </div>
          <div className="order-shipping d-flex justify-content-between">
            <span>Phí vận chuyển</span>
            <span>9.99₫</span>
          </div>
          <div className="order-tax d-flex justify-content-between">
            <span>Thuế</span>
            <span>21.00₫</span>
          </div>
          <div className="order-total d-flex justify-content-between">
            <span>Tổng cộng</span>
            <span>240.96₫</span>
          </div>
        </div>

        <div className="secure-checkout">
          <div className="secure-checkout-header">
            <i className="bi bi-shield-lock"></i>
            <span>Thanh toán an toàn</span>
          </div>
          <div className="payment-icons">
            <i className="bi bi-credit-card-2-front"></i>
            <i className="bi bi-credit-card"></i>
            <i className="bi bi-paypal"></i>
            <i className="bi bi-apple"></i>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryOrder;
