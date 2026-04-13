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
                  placeholder="Your First Name"
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
                  placeholder="Your Last Name"
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                className="form-control"
                name="email"
                id="email"
                placeholder="Your Email"
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
                placeholder="Your Phone Number"
                required
              />
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="checkout-section" id="shipping-address">
          <div className="section-header">
            <div className="section-number">2</div>
            <h3>Địa chỉ giao hàng</h3>
          </div>
          <div className="section-content">
            <div className="form-group">
              <label htmlFor="fullname">Họ và tên</label>
              <input
                type="text"
                className="form-control"
                name="fullname"
                id="fullname"
                placeholder="Nhập họ và tên"
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
            <div className="form-group">
              <label htmlFor="address">Địa chỉ (Số nhà, tên đường)</label>
              <input
                type="text"
                className="form-control"
                name="address"
                id="address"
                placeholder="Ví dụ: 123 Lê Lợi"
                required
              />
            </div>
            <div className="row">
              <div className="col-md-4 form-group">
                <label htmlFor="ward">Phường/Xã</label>
                <input
                  type="text"
                  name="ward"
                  className="form-control"
                  id="ward"
                  placeholder="Phường/Xã"
                  required
                />
              </div>
              <div className="col-md-4 form-group">
                <label htmlFor="district">Quận/Huyện</label>
                <input
                  type="text"
                  name="district"
                  className="form-control"
                  id="district"
                  placeholder="Quận/Huyện"
                  required
                />
              </div>
              <div className="col-md-4 form-group">
                <label htmlFor="city">Tỉnh/Thành phố</label>
                <input
                  type="text"
                  name="city"
                  className="form-control"
                  id="city"
                  placeholder="Tỉnh/Thành phố"
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="country">Quốc gia</label>
              <select
                className="form-select"
                id="country"
                name="country"
                required
              >
                <option value="VN" selected>
                  Việt Nam
                </option>
                <option value="US">Hoa Kỳ</option>
                <option value="CA">Canada</option>
                <option value="UK">Vương Quốc Anh</option>
                <option value="AU">Úc</option>
                <option value="DE">Đức</option>
                <option value="FR">Pháp</option>
              </select>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="save-address"
                name="save-address"
              />
              <label className="form-check-label" htmlFor="save-address">
                Lưu địa chỉ này cho lần đặt hàng sau
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="billing-same"
                name="billing-same"
                checked
              />
              <label className="form-check-label" htmlFor="billing-same">
                Sử dụng địa chỉ này cho thanh toán
              </label>
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="checkout-section" id="payment-method">
          <div className="section-header">
            <div className="section-number">3</div>
            <h3>Phương thức thanh toán</h3>
          </div>
          <div className="section-content">
            <div className="payment-options">
              {/* COD */}
              <div className="payment-option active">
                <input type="radio" name="payment-method" id="cod" checked />
                <label htmlFor="cod">
                  <span className="payment-icon">
                    <i className="bi bi-truck"></i>
                  </span>
                  <span className="payment-label">
                    Thanh toán khi nhận hàng (COD)
                  </span>
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

              {/* Momo */}
              <div className="payment-option">
                <input type="radio" name="payment-method" id="momo" />
                <label htmlFor="momo">
                  <span className="payment-icon">
                    <i className="bi bi-phone"></i>
                  </span>
                  <span className="payment-label">Ví MoMo</span>
                </label>
              </div>

              {/* Zalopay */}
              <div className="payment-option">
                <input type="radio" name="payment-method" id="zalopay" />
                <label htmlFor="zalopay">
                  <span className="payment-icon">
                    <i className="bi bi-chat-dots"></i>
                  </span>
                  <span className="payment-label">ZaloPay</span>
                </label>
              </div>

              {/* VNPay */}
              <div className="payment-option">
                <input type="radio" name="payment-method" id="vnpay" />
                <label htmlFor="vnpay">
                  <span className="payment-icon">
                    <i className="bi bi-qr-code"></i>
                  </span>
                  <span className="payment-label">VNPay QR</span>
                </label>
              </div>
            </div>

            {/* COD Details */}
            <div className="payment-details" id="cod-details">
              <p className="payment-info">
                Bạn sẽ thanh toán trực tiếp cho nhân viên giao hàng khi nhận
                hàng.
              </p>
            </div>

            {/* Bank transfer */}
            <div className="payment-details d-none" id="bank-transfer-details">
              <p className="payment-info">
                Vui lòng chuyển khoản đến tài khoản sau:
                <br />
                <strong>Ngân hàng:</strong> Vietcombank
                <br />
                <strong>Số tài khoản:</strong> 123456789
                <br />
                <strong>Chủ tài khoản:</strong> Nguyễn Văn A<br />
                <em>Nội dung: Thanh toán đơn hàng #12345</em>
              </p>
            </div>

            {/* Momo */}
            <div className="payment-details d-none" id="momo-details">
              <p className="payment-info">
                Bạn sẽ được chuyển hướng sang ứng dụng MoMo để hoàn tất thanh
                toán.
              </p>
            </div>

            {/* Zalopay */}
            <div className="payment-details d-none" id="zalopay-details">
              <p className="payment-info">
                Bạn sẽ được chuyển hướng sang ứng dụng ZaloPay để hoàn tất thanh
                toán.
              </p>
            </div>

            {/* VNPay */}
            <div className="payment-details d-none" id="vnpay-details">
              <p className="payment-info">
                Quét mã QR bằng ứng dụng ngân hàng hoặc ví điện tử để thanh toán
                qua VNPay.
              </p>
            </div>
          </div>
        </div>

        {/* Order Review */}
        <div className="checkout-section" id="order-review">
          <div className="section-header">
            <div className="section-number">4</div>
            <h3>Đánh giá &amp; Đặt hàng</h3>
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
                Tôi đồng ý với{" "}
                <a href="#" data-bs-toggle="modal" data-bs-target="#termsModal">
                  Điều khoản và Điều kiện
                </a>{" "}
                và{" "}
                <a
                  href="#"
                  data-bs-toggle="modal"
                  data-bs-target="#privacyModal"
                >
                  Chính sách Bảo mật
                </a>
              </label>
            </div>
            <div className="success-message d-none">
              Đơn hàng của bạn đã được đặt thành công! Cảm ơn bạn đã mua hàng.
            </div>
            <div className="place-order-container">
              <button type="submit" className="btn btn-primary place-order-btn">
                <span className="btn-text">Thanh toán</span>
                <span className="btn-price">$240.96</span>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CheckoutForm;
