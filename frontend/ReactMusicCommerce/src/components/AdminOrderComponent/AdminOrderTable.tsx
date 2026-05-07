import React from "react";
import { useNavigate } from "react-router-dom";
import type { AdminOrderDTO } from "../../models/AdminOrderDTO";
import { SpinningLoading } from "../utils/SpinningLoading";

interface Props {
  orders: AdminOrderDTO[];
  loading: boolean;
  page: number;
  totalPages: number;
  totalItems: number;
  setPage: (page: number | ((p: number) => number)) => void;
}

export const getStatusBadgeClass = (status: string) => {
  switch (status?.toUpperCase()) {
    case "COMPLETED": return "bg-success bg-opacity-10 text-success";
    case "PENDING": return "bg-warning bg-opacity-10 text-warning";
    case "FAILED": return "bg-danger bg-opacity-10 text-danger";
    case "REFUNDED": return "bg-info bg-opacity-10 text-info";
    default: return "bg-light text-dark border";
  }
};

const AdminOrderTable: React.FC<Props> = ({ orders, loading, page, totalPages, totalItems, setPage }) => {
  const navigate = useNavigate();

  return (
    <div className="card border-0 shadow-sm rounded-4 overflow-hidden position-relative">
      {loading && (
        <div className="position-absolute w-100 h-100 d-flex justify-content-center align-items-center bg-white bg-opacity-75" style={{ zIndex: 10 }}>
          <SpinningLoading />
        </div>
      )}

      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0">
          <thead className="table-light text-muted small text-uppercase">
            <tr>
              <th className="ps-4">Mã đơn</th>
              <th>Khách hàng</th>
              <th>Ngày tạo</th>
              <th>Thanh toán</th>
              <th>Tổng tiền</th>
              <th>Số SP</th>
              <th className="text-center pe-4">Thao tác</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {orders.length === 0 && !loading ? (
              <tr>
                <td colSpan={7} className="text-center py-4 text-muted">Không tìm thấy đơn hàng nào</td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.orderId}>
                  <td className="ps-4 fw-semibold">#{order.orderId}</td>
                  <td>
                    <div>
                      <div className="fw-semibold">{order.customerName}</div>
                      <small className="text-muted">{order.customerEmail}</small>
                    </div>
                  </td>
                  <td className="text-muted small">{new Date(order.createdAt).toLocaleDateString("vi-VN")}</td>
                  <td>
                    <span className={`badge rounded-pill px-3 ${getStatusBadgeClass(order.paymentStatus)}`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="fw-semibold">{new Intl.NumberFormat("vi-VN").format(order.totalAmount)} đ</td>
                  <td className="text-center">{order.totalItems}</td>
                  <td className="text-center pe-4">
                    <button className="btn btn-sm btn-outline-primary rounded-pill" onClick={() => navigate(`/admin/orders/${order.orderId}`)}>
                      <i className="bi bi-eye me-1"></i> Xem
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="card-footer bg-white p-3 d-flex justify-content-between align-items-center border-top">
        <span className="text-muted small">
          Hiển thị {orders.length > 0 ? page * 10 + 1 : 0}-{Math.min((page + 1) * 10, totalItems)} của {totalItems} đơn hàng
        </span>
        <nav>
          <ul className="pagination pagination-sm mb-0">
            <li className={`page-item ${page === 0 ? "disabled" : ""}`}>
              <button className="page-link text-dark" onClick={() => setPage((p) => Math.max(0, p - 1))}>Trước</button>
            </li>
            <li className="page-item active">
              <span className="page-link" style={{ backgroundColor: "#4f46e5", borderColor: "#4f46e5" }}>
                {page + 1} / {totalPages || 1}
              </span>
            </li>
            <li className={`page-item ${page >= totalPages - 1 ? "disabled" : ""}`}>
              <button className="page-link text-dark" onClick={() => setPage((p) => p + 1)}>Sau</button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default AdminOrderTable;