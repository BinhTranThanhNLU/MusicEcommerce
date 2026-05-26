import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAdminOrders } from "../../apis/adminApi";
import type { AdminOrderDTO } from "../../models/AdminOrderDTO";
import { parseApiError } from "../../utils/apiError";

const PAGE_SIZE = 5;

const statusMeta: Record<string, { label: string; className: string }> = {
  COMPLETED: { label: "Hoàn tất", className: "bg-success bg-opacity-10 text-success border border-success-subtle" },
  PENDING: { label: "Đang chờ", className: "bg-warning bg-opacity-10 text-warning border border-warning-subtle" },
  FAILED: { label: "Thất bại", className: "bg-danger bg-opacity-10 text-danger border border-danger-subtle" },
  REFUNDED: { label: "Hoàn tiền", className: "bg-info bg-opacity-10 text-info border border-info-subtle" },
};

const formatMoney = (value: number) =>
  new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 0 }).format(value) + " ₫";

const formatDateTime = (value: string) =>
  new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));

const AdminRecentTransactionsTable = () => {
  const [orders, setOrders] = useState<AdminOrderDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setErrorMessage(null);

      try {
        const response = await getAdminOrders(0, PAGE_SIZE);
        setOrders(response.orders?.slice(0, PAGE_SIZE) ?? []);
        setTotalItems(response.totalItems ?? 0);
      } catch (error) {
        setOrders([]);
        setTotalItems(0);
        setErrorMessage(parseApiError(error, "Không thể tải giao dịch gần đây.").message);
      } finally {
        setLoading(false);
      }
    };

    void fetchOrders();
  }, []);

  return (
    <div className="card border-0 shadow-sm rounded-4 h-100 admin-dashboard-panel overflow-hidden">
      <div className="card-body p-0 d-flex flex-column">
        <div className="p-4 pb-3 d-flex flex-column flex-md-row justify-content-between align-items-md-start gap-3 border-bottom">
          <div>
            <div className="d-flex align-items-center gap-2 mb-2">
              <span className="admin-kicker-pill admin-kicker-blue">
                <i className="bi bi-receipt-cutoff me-1"></i> Recent Transactions
              </span>
              <span className="badge rounded-pill text-bg-light border text-secondary">{totalItems || orders.length} giao dịch gần nhất</span>
            </div>
            <h5 className="fw-bold mb-1">Giao dịch mới nhất</h5>
            <p className="text-muted mb-0 small">
              Snapshot các đơn vừa thanh toán để theo dõi nhanh tình trạng doanh thu và đối soát.
            </p>
          </div>

          <Link to="/admin/orders" className="btn btn-sm btn-outline-dark rounded-pill px-3 text-nowrap">
            Xem tất cả <i className="bi bi-arrow-right ms-1"></i>
          </Link>
        </div>

        <div className="table-responsive flex-grow-1">
          <table className="table table-hover align-middle mb-0 admin-compact-table">
            <thead className="text-uppercase text-muted small admin-table-head">
              <tr>
                <th className="ps-4">Giao dịch</th>
                <th>Khách hàng</th>
                <th>Trạng thái</th>
                <th className="text-end pe-4">Giá trị</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-5 text-center text-muted">
                    <div className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></div>
                    Đang tải giao dịch...
                  </td>
                </tr>
              ) : errorMessage ? (
                <tr>
                  <td colSpan={4} className="py-5 text-center text-muted">
                    {errorMessage}
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-5 text-center text-muted">
                    Chưa có giao dịch nào để hiển thị.
                  </td>
                </tr>
              ) : (
                orders.map((order) => {
                  const meta = statusMeta[order.paymentStatus] ?? statusMeta.PENDING;

                  return (
                  <tr key={order.orderId}>
                    <td className="ps-4 py-3">
                      <div className="d-flex align-items-start gap-3">
                        <div className="admin-item-avatar admin-item-avatar-blue">
                          <i className="bi bi-receipt"></i>
                        </div>
                        <div>
                          <div className="fw-semibold text-dark">#{order.orderId}</div>
                          <small className="text-muted">{order.totalItems} sản phẩm trong đơn</small>
                        </div>
                      </div>
                    </td>
                    <td className="py-3">
                      <div className="fw-medium text-dark">{order.customerName}</div>
                      <small className="text-muted">{order.customerEmail}</small>
                    </td>
                    <td className="py-3">
                      <span className={`badge rounded-pill px-3 py-2 ${meta.className}`}>{meta.label}</span>
                    </td>
                    <td className="py-3 text-end pe-4 fw-semibold text-dark">
                      <div>{formatMoney(order.totalAmount)}</div>
                      <small className="text-muted fw-normal d-block">{formatDateTime(order.createdAt)}</small>
                    </td>
                  </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminRecentTransactionsTable;