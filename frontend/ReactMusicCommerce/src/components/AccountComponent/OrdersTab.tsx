import type { AccountOrderResponse } from "../../responsemodel/AccountOrderResponse";

interface OrdersTabProps {
  orders: AccountOrderResponse[];
  isLoading: boolean;
}

const formatDateTime = (value: string | null) => {
  if (!value) {
    return "Không xác định";
  }

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
};

const formatCurrency = (value: number | null) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value ?? 0);
};

const getStatusBadgeClass = (status: string) => {
  const normalized = status.trim().toUpperCase();

  if (normalized === "PAID") {
    return "bg-success";
  }

  if (normalized === "FAILED") {
    return "bg-danger";
  }

  if (normalized === "PENDING") {
    return "bg-warning text-dark";
  }

  return "bg-secondary";
};

const OrdersTab = ({ orders, isLoading }: OrdersTabProps) => {
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
        {isLoading ? (
          <div className="bg-white border rounded-4 p-4 text-center shadow-sm">
            <div className="spinner-border text-primary mb-3" role="status" aria-hidden="true" />
            <p className="mb-0 text-muted">Đang tải lịch sử giao dịch...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white border rounded-4 p-4 text-center shadow-sm">
            <i className="bi bi-receipt-cutoff fs-1 text-muted d-block mb-3"></i>
            <h5 className="mb-2">Chưa có giao dịch nào</h5>
            <p className="text-muted mb-0">Các đơn hàng đã thanh toán sẽ xuất hiện ở đây.</p>
          </div>
        ) : (
          orders.map((order, index) => (
            <div
              key={order.orderId}
              className="order-card p-3 border rounded mb-4 bg-white shadow-sm"
              data-aos="fade-up"
              data-aos-delay={100 + index * 100}
            >
              <div className="order-header d-flex flex-column flex-md-row justify-content-between gap-2 border-bottom pb-2 mb-3">
                <div className="order-id">
                  <span className="fw-bold me-2">Mã hóa đơn:</span>
                  <span className="text-primary">#{order.orderId}</span>
                </div>
                <div className="order-date text-muted">{formatDateTime(order.createdAt)}</div>
              </div>
              <div className="order-content">
                <div className="order-info mb-3">
                  <div className="d-flex justify-content-between mb-2">
                    <span>Trạng thái thanh toán:</span>
                    <span className={`badge ${getStatusBadgeClass(order.paymentStatus)}`}>
                      {order.paymentStatus}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Tổng tài nguyên:</span>
                    <span>{order.totalItems} sản phẩm</span>
                  </div>
                  <div className="d-flex justify-content-between fw-bold">
                    <span>Tổng thanh toán:</span>
                    <span className="text-danger">{formatCurrency(order.totalAmount)}</span>
                  </div>
                </div>
              </div>
              <div className="order-footer">
                <button
                  type="button"
                  className="btn btn-sm btn-outline-primary w-100"
                  data-bs-toggle="collapse"
                  data-bs-target={`#details-${order.orderId}`}
                  aria-expanded="false"
                >
                  Xem chi tiết tài nguyên mua
                </button>
              </div>

              <div className="collapse order-details mt-3" id={`details-${order.orderId}`}>
                <div className="details-content bg-light p-3 rounded">
                  <h6 className="mb-3">Tài nguyên số đã cấp phép:</h6>
                  <div className="order-items">
                    {order.items.map((item) => (
                      <div
                        key={item.orderDetailId}
                        className="d-flex justify-content-between align-items-center gap-3 mb-2 border-bottom pb-2"
                      >
                        <div>
                          <div className="fw-bold">{item.title}</div>
                          <small className="text-muted">
                            {item.artistName} | Loại: {item.licenseType}
                          </small>
                        </div>
                        <div>{formatCurrency(item.price)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OrdersTab;
