const CheckoutForm = () => {
  return (
    <div className="checkout-container" data-aos="fade-up">
      <form className="checkout-form">
        {/* Customer Information */}
        <div className="checkout-section" id="customer-info">
          <div className="section-header">
            <div className="section-number">1</div>
            <h3>Thông tin khách hàng</h3>
          </div>
          <div className="section-content">
            <div className="row">
              <div className="col-md-6 form-group">
                <label htmlFor="first-name">Họ</label>
                <input
                  type="text"
                  name="first-name"
                  className="form-control"
                  id="first-name"
                  placeholder="Nhập họ của bạn"
                  required
                />
              </div>
              <div className="col-md-6 form-group">
                <label htmlFor="last-name">Tên</label>
                <input
                  type="text"
                  name="last-name"
                  className="form-control"
                  id="last-name"
                  placeholder="Nhập tên của bạn"
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="email">
                Email (Link tải nhạc sẽ được gửi qua email này)
              </label>
              <input
                type="email"
                className="form-control"
                name="email"
                id="email"
                placeholder="Nhập email của bạn"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Số điện thoại</label>
              <input
                type="tel"
                className="form-control"
                name="phone"
                id="phone"
                placeholder="Nhập số điện thoại"
                required
              />
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="checkout-section" id="payment-method">
          <div className="section-header">
            <div className="section-number">2</div>
            <h3>Phương thức thanh toán trực tuyến</h3>
          </div>
          <div className="section-content">
            <div className="payment-options">
              {/* VNPay */}
              <div className="payment-option active">
                <input
                  type="radio"
                  name="payment-method"
                  id="vnpay"
                  defaultChecked
                />
                <label htmlFor="vnpay">
                  <span className="payment-icon">
                    <i className="bi bi-qr-code"></i>
                  </span>
                  <span className="payment-label">Cổng thanh toán VNPay</span>
                </label>
              </div>

              {/* Momo */}
              <div className="payment-option">
                <input type="radio" name="payment-method" id="momo" />
                <label htmlFor="momo">
                  <span className="payment-icon">
                    <i className="bi bi-phone"></i>
                  </span>
                  <span className="payment-label">Ví điện tử MoMo</span>
                </label>
              </div>

              {/* Zalopay */}
              <div className="payment-option">
                <input type="radio" name="payment-method" id="zalopay" />
                <label htmlFor="zalopay">
                  <span className="payment-icon">
                    <i className="bi bi-chat-dots"></i>
                  </span>
                  <span className="payment-label">Ví ZaloPay</span>
                </label>
              </div>

              {/* Bank transfer */}
              <div className="payment-option">
                <input type="radio" name="payment-method" id="bank-transfer" />
                <label htmlFor="bank-transfer">
                  <span className="payment-icon">
                    <i className="bi bi-bank"></i>
                  </span>
                  <span className="payment-label">Chuyển khoản ngân hàng</span>
                </label>
              </div>
            </div>

            {/* Payment Details Context (Can be toggled via state in real implementation) */}
            <div className="payment-details" id="vnpay-details">
              <p className="payment-info">
                Bạn sẽ được chuyển hướng đến cổng thanh toán VNPay an toàn để
                hoàn tất giao dịch.
              </p>
            </div>
          </div>
        </div>

        {/* Order Review */}
        <div className="checkout-section" id="order-review">
          <div className="section-header">
            <div className="section-number">3</div>
            <h3>Xác nhận cấp phép & Đặt hàng</h3>
          </div>
          <div className="section-content">
            <div className="form-check terms-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="terms"
                name="terms"
                required
              />
              <label className="form-check-label" htmlFor="terms">
                Tôi xác nhận đã hiểu rõ quyền hạn sử dụng âm thanh và đồng ý với{" "}
                <a href="#" data-bs-toggle="modal" data-bs-target="#termsModal">
                  Điều khoản Bản quyền
                </a>{" "}
                và{" "}
                <a
                  href="#"
                  data-bs-toggle="modal"
                  data-bs-target="#privacyModal"
                >
                  Chính sách Bảo mật
                </a>
                .
              </label>
            </div>
            <div className="place-order-container mt-4">
              <button
                type="submit"
                className="btn btn-primary place-order-btn w-100 d-flex justify-content-between align-items-center p-3"
              >
                <span className="btn-text">Thanh Toán & Nhận Link Tải</span>
                <span className="btn-price fw-bold">750.000₫</span>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CheckoutForm;
