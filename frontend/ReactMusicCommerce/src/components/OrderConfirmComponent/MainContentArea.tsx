const MainContentArea = () => {
  return (
    <div className="col-lg-8 main-content" data-aos="fade-in">
      {/* Thank you message */}
      <div className="thank-you-message">
        <h1>Cảm ơn bạn đã đặt hàng!</h1>
        <p>
          Chúng tôi đã nhận được đơn hàng của bạn và sẽ bắt đầu xử lý ngay lập
          tức. Chúng tôi sẽ gửi cho bạn thông tin cập nhật qua email khi đơn
          hàng của bạn tiến triển.
        </p>
      </div>

      {/* Shipping details */}
      <div className="details-card" data-aos="fade-up">
        <div className="card-header" data-toggle="collapse">
          <h3>
            <i className="bi bi-geo-alt"></i>
            Chi tiết vận chuyển
          </h3>
          <i className="bi bi-chevron-down toggle-icon"></i>
        </div>
        <div className="card-body">
          <div className="row g-4">
            <div className="col-md-6">
              <div className="detail-group">
                <label>Gửi đến</label>
                <address>
                  Michael Thompson
                  <br />
                  789 Oakwood Lane
                  <br />
                  Seattle, WA 98101
                  <br />
                  United States
                </address>
              </div>
            </div>
            <div className="col-md-6">
              <div className="detail-group">
                <label>Liên hệ</label>
                <div className="contact-info">
                  <p>
                    <i className="bi bi-envelope"></i> michael.t@example.com
                  </p>
                  <p>
                    <i className="bi bi-telephone"></i> (206) 555-1234
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment details */}
      <div className="details-card" data-aos="fade-up">
        <div className="card-header" data-toggle="collapse">
          <h3>
            <i className="bi bi-credit-card"></i>
            Chi tiết thanh toán
          </h3>
          <i className="bi bi-chevron-down toggle-icon"></i>
        </div>
        <div className="card-body">
          <div className="payment-method">
            <div className="payment-icon">
              <i className="bi bi-credit-card-2-front"></i>
            </div>
            <div className="payment-details">
              <div className="card-type">American Express</div>
              <div className="card-number">•••• •••• •••• 3782</div>
            </div>
          </div>
          <div className="billing-address mt-4">
            <h5>Địa chỉ thanh toán</h5>
            <p>Giống như địa chỉ giao hàng</p>
          </div>
        </div>
      </div>

      {/* Order items */}
      <div className="details-card" data-aos="fade-up">
        <div className="card-header" data-toggle="collapse">
          <h3>
            <i className="bi bi-bag-check"></i>
            Sản phẩm đặt hàng
          </h3>
          <i className="bi bi-chevron-down toggle-icon"></i>
        </div>
        <div className="card-body">
          <div className="item">
            <div className="item-image">
              <img
                src="../../assets/img/product/product-7.webp"
                alt="Product"
                loading="lazy"
              />
            </div>
            <div className="item-details">
              <h4>Wireless Bluetooth Speaker</h4>
              <div className="item-meta">
                <span>Màu: Xanh navy</span>
              </div>
              <div className="item-price">
                <span className="quantity">1 ×</span>
                <span className="price">$129.99</span>
              </div>
            </div>
          </div>

          <div className="item">
            <div className="item-image">
              <img
                src="assets/img/product/product-9.webp"
                alt="Product"
                loading="lazy"
              />
            </div>
            <div className="item-details">
              <h4>Smart Fitness Tracker</h4>
              <div className="item-meta">
                <span>Màu: đen</span>
                <span>Kích thước: US 9</span>
              </div>
              <div className="item-price">
                <span className="quantity">1 ×</span>
                <span className="price">$89.98</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="action-area" data-aos="fade-up">
        <div className="row g-3">
          <div className="col-md-6">
            <a href="#" className="btn btn-back">
              <i className="bi bi-arrow-left"></i>
              Quay lại Cửa hàng
            </a>
          </div>
          <div className="col-md-6">
            <a href="#" className="btn btn-account">
              <span>Xem trong Tài khoản</span>
              <i className="bi bi-arrow-right"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainContentArea;
