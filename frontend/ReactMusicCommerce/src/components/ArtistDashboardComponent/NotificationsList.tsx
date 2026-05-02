import React from "react";

const NotificationsList = () => {
  return (
    <div className="card border-0 shadow-sm rounded-4 h-100 overflow-hidden">
      <div className="p-4 border-bottom d-flex justify-content-between align-items-center">
        <h5 className="fw-bold mb-0">Việc cần làm & Thông báo</h5>
        <span className="badge bg-danger rounded-pill">3 mới</span>
      </div>
      <div className="list-group list-group-flush">
        
        {/* Thông báo 1 */}
        <div className="list-group-item p-3 border-0 d-flex align-items-start bg-light bg-opacity-50">
          <div className="bg-warning bg-opacity-10 text-warning rounded-circle p-2 me-3 mt-1">
            <i className="bi bi-exclamation-triangle"></i>
          </div>
          <div>
            <h6 className="mb-1 fw-bold">Cập nhật hồ sơ thanh toán</h6>
            <p className="mb-1 small text-muted">Vui lòng cập nhật số tài khoản ngân hàng để nhận thanh toán kỳ này.</p>
            <a href="#" className="small text-decoration-none fw-medium">Cập nhật ngay</a>
          </div>
        </div>

        {/* Thông báo 2 */}
        <div className="list-group-item p-3 border-0 d-flex align-items-start">
          <div className="bg-success bg-opacity-10 text-success rounded-circle p-2 me-3 mt-1">
            <i className="bi bi-check-circle"></i>
          </div>
          <div>
            <h6 className="mb-1 fw-bold">Tác phẩm được duyệt</h6>
            <p className="mb-0 small text-muted">Bản nhạc "Chút Nắng Chút Mưa" đã qua kiểm duyệt và hiện đang online.</p>
            <small className="text-muted" style={{fontSize: "11px"}}>2 giờ trước</small>
          </div>
        </div>

        {/* Thông báo 3 */}
        <div className="list-group-item p-3 border-0 d-flex align-items-start">
          <div className="bg-primary bg-opacity-10 text-primary rounded-circle p-2 me-3 mt-1">
            <i className="bi bi-chat-dots"></i>
          </div>
          <div>
            <h6 className="mb-1 fw-bold">Tin nhắn mới</h6>
            <p className="mb-0 small text-muted">Khách hàng <span className="fw-medium text-dark">Studio M</span> vừa gửi cho bạn một tin nhắn hỏi về giấy phép độc quyền.</p>
            <small className="text-muted" style={{fontSize: "11px"}}>Hôm qua</small>
          </div>
        </div>

      </div>
      <div className="p-3 bg-white text-center mt-auto border-top">
        <a href="#" className="text-decoration-none fw-medium text-primary small">Xem tất cả thông báo <i className="bi bi-arrow-right"></i></a>
      </div>
    </div>
  );
};

export default NotificationsList;