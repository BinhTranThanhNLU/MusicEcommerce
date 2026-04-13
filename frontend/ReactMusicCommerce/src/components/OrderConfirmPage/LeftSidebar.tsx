const LeftSidebar = () => {
  return (
    <div className="col-lg-4 sidebar" data-aos="fade-right">
      <div className="sidebar-content">
        {/* Success animation */}
        <div className="success-animation">
          <i className="bi bi-check-lg"></i>
        </div>

        {/* Order number and date */}
        <div className="order-id">
          <h4>Đơn hàng #ORD-935721</h4>
          <div className="order-date">Ngày đặt: 2/3/2025</div>
        </div>

        {/* Order progress stepper */}
        <div className="order-progress">
          <div className="stepper-container">
            <div className="stepper-item completed">
              <div className="stepper-icon">1</div>
              <div className="stepper-text">Đã xác nhận</div>
            </div>
            <div className="stepper-item current">
              <div className="stepper-icon">2</div>
              <div className="stepper-text">Đang xử lý</div>
            </div>
            <div className="stepper-item">
              <div className="stepper-icon">3</div>
              <div className="stepper-text">Đang giao</div>
            </div>
            <div className="stepper-item">
              <div className="stepper-icon">4</div>
              <div className="stepper-text">Đã giao</div>
            </div>
          </div>
        </div>

        {/*  Price summary */}
        <div className="price-summary">
          <h5>Tóm tắt đơn hàng</h5>
          <ul className="summary-list">
            <li>
              <span>Tạm tính</span>
              <span>219.97₫</span>
            </li>
            <li>
              <span>Phí vận chuyển</span>
              <span>0₫</span>
            </li>
            <li>
              <span>Thuế</span>
              <span>18.70₫</span>
            </li>
            <li className="total">
              <span>Tổng cộng</span>
              <span>238.67₫</span>
            </li>
          </ul>
        </div>

        {/*  Delivery info */}
        <div className="delivery-info">
          <h5>Thông tin giao hàng</h5>
          <p className="delivery-estimate">
            <i className="bi bi-calendar-check"></i>
            <span>Dự kiến giao: 7 - 9/3/2025</span>
          </p>
          <p className="shipping-method">
            <i className="bi bi-truck"></i>
            <span>Miễn phí vận chuyển</span>
          </p>
        </div>

        {/*  Customer service */}
        <div className="customer-service">
          <h5>Cần hỗ trợ?</h5>
          <a href="#" className="help-link">
            <i className="bi bi-chat-dots"></i>
            <span>Liên hệ hỗ trợ</span>
          </a>
          <a href="#" className="help-link">
            <i className="bi bi-question-circle"></i>
            <span>Câu hỏi thường gặp</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default LeftSidebar;
