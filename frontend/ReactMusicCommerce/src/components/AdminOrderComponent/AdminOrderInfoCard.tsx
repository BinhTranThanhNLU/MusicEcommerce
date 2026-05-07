import React from "react";
import type { AdminOrderWithDetailsDTO } from "../../responsemodel/AdminOrderWithDetailsDTO";
import { getStatusBadgeClass } from "./AdminOrderTable";

interface Props {
  order: AdminOrderWithDetailsDTO;
  updatingStatus: boolean;
  onUpdateStatus: () => void;
}

const AdminOrderInfoCard: React.FC<Props> = ({ order, updatingStatus, onUpdateStatus }) => {
  return (
    <div className="card border-0 shadow-sm rounded-4 mb-4 overflow-hidden">
      <div className="card-body p-4">
        <div className="row g-4">
          <div className="col-md-6">
            <h6 className="fw-bold text-muted text-uppercase mb-3">Thông tin khách hàng</h6>
            <div className="d-flex justify-content-between py-2 border-bottom">
              <span className="text-muted">Tên khách</span>
              <span className="fw-semibold">{order.customerName}</span>
            </div>
            <div className="d-flex justify-content-between py-2 border-bottom">
              <span className="text-muted">Email</span>
              <span className="fw-semibold">{order.customerEmail}</span>
            </div>
            <div className="d-flex justify-content-between py-2">
              <span className="text-muted">ID khách hàng</span>
              <span className="fw-semibold">#{order.userId}</span>
            </div>
          </div>

          <div className="col-md-6">
            <h6 className="fw-bold text-muted text-uppercase mb-3">Thông tin thanh toán</h6>
            <div className="d-flex justify-content-between py-2 border-bottom">
              <span className="text-muted">Tổng tiền</span>
              <span className="fw-semibold">{new Intl.NumberFormat("vi-VN").format(order.totalAmount)} đ</span>
            </div>
            <div className="d-flex justify-content-between py-2 border-bottom">
              <span className="text-muted">Phương thức</span>
              <span className="fw-semibold text-capitalize">{order.paymentMethod}</span>
            </div>
            <div className="d-flex justify-content-between py-2 border-bottom">
              <span className="text-muted">Trạng thái</span>
              <span className={`badge rounded-pill px-3 ${getStatusBadgeClass(order.paymentStatus)}`}>
                {order.paymentStatus}
              </span>
            </div>
            <div className="d-flex justify-content-between py-2">
              <span className="text-muted">Ngày tạo</span>
              <span className="fw-semibold">{new Date(order.createdAt).toLocaleString("vi-VN")}</span>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-top d-flex gap-2">
          <button className="btn btn-primary rounded-pill px-4" onClick={onUpdateStatus} disabled={updatingStatus}>
            <i className="bi bi-pencil me-2" />
            {updatingStatus ? "Đang cập nhật..." : "Cập nhật trạng thái"}
          </button>
          {order.gatewayTransactionCode && (
            <button className="btn btn-outline-secondary rounded-pill px-4 disabled">
              <i className="bi bi-receipt me-2" /> Mã giao dịch: {order.gatewayTransactionCode}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOrderInfoCard;