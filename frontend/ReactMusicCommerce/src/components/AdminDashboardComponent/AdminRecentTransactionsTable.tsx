import { Link } from "react-router-dom";

type TransactionStatus = "COMPLETED" | "PENDING" | "FAILED" | "REFUNDED";

interface RecentTransaction {
  id: string;
  customerName: string;
  customerEmail: string;
  createdAt: string;
  amount: number;
  status: TransactionStatus;
  items: number;
}

const recentTransactions: RecentTransaction[] = [
  {
    id: "TX-10248",
    customerName: "Nguyễn Minh Khoa",
    customerEmail: "khoa.nguyen@email.com",
    createdAt: "2026-05-07T09:24:00",
    amount: 489000,
    status: "COMPLETED",
    items: 3,
  },
  {
    id: "TX-10247",
    customerName: "Trần Thu Hà",
    customerEmail: "ha.tran@email.com",
    createdAt: "2026-05-07T08:41:00",
    amount: 129000,
    status: "PENDING",
    items: 1,
  },
  {
    id: "TX-10246",
    customerName: "Lê Quốc Anh",
    customerEmail: "anh.le@email.com",
    createdAt: "2026-05-07T07:58:00",
    amount: 259000,
    status: "COMPLETED",
    items: 2,
  },
  {
    id: "TX-10245",
    customerName: "Phạm Thảo Vy",
    customerEmail: "vy.pham@email.com",
    createdAt: "2026-05-06T22:11:00",
    amount: 799000,
    status: "COMPLETED",
    items: 5,
  },
  {
    id: "TX-10244",
    customerName: "Đặng Gia Bảo",
    customerEmail: "bao.dang@email.com",
    createdAt: "2026-05-06T19:35:00",
    amount: 169000,
    status: "REFUNDED",
    items: 1,
  },
  {
    id: "TX-10243",
    customerName: "Vũ Hoàng Nam",
    customerEmail: "nam.vu@email.com",
    createdAt: "2026-05-06T17:20:00",
    amount: 219000,
    status: "COMPLETED",
    items: 2,
  },
  {
    id: "TX-10242",
    customerName: "Ngô Nhật Linh",
    customerEmail: "linh.ngo@email.com",
    createdAt: "2026-05-06T15:02:00",
    amount: 149000,
    status: "FAILED",
    items: 1,
  },
];

const statusMeta: Record<TransactionStatus, { label: string; className: string }> = {
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
  return (
    <div className="card border-0 shadow-sm rounded-4 h-100 admin-dashboard-panel overflow-hidden">
      <div className="card-body p-0 d-flex flex-column">
        <div className="p-4 pb-3 d-flex flex-column flex-md-row justify-content-between align-items-md-start gap-3 border-bottom">
          <div>
            <div className="d-flex align-items-center gap-2 mb-2">
              <span className="admin-kicker-pill admin-kicker-blue">
                <i className="bi bi-receipt-cutoff me-1"></i> Recent Transactions
              </span>
              <span className="badge rounded-pill text-bg-light border text-secondary">7 giao dịch gần nhất</span>
            </div>
            <h5 className="fw-bold mb-1">Giao dịch mới nhất</h5>
            <p className="text-muted mb-0 small">
              Theo dõi các đơn vừa thanh toán để xử lý khiếu nại, hoàn tiền và đối soát nhanh hơn.
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
                <th>Thời gian</th>
                <th>Trạng thái</th>
                <th className="text-end pe-4">Giá trị</th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions.map((transaction) => {
                const meta = statusMeta[transaction.status];

                return (
                  <tr key={transaction.id}>
                    <td className="ps-4 py-3">
                      <div className="d-flex align-items-start gap-3">
                        <div className="admin-item-avatar admin-item-avatar-blue">
                          <i className="bi bi-receipt"></i>
                        </div>
                        <div>
                          <div className="fw-semibold text-dark">{transaction.id}</div>
                          <small className="text-muted">{transaction.items} sản phẩm trong đơn</small>
                        </div>
                      </div>
                    </td>
                    <td className="py-3">
                      <div className="fw-medium text-dark">{transaction.customerName}</div>
                      <small className="text-muted">{transaction.customerEmail}</small>
                    </td>
                    <td className="py-3 text-muted small">{formatDateTime(transaction.createdAt)}</td>
                    <td className="py-3">
                      <span className={`badge rounded-pill px-3 py-2 ${meta.className}`}>{meta.label}</span>
                    </td>
                    <td className="py-3 text-end pe-4 fw-semibold text-dark">{formatMoney(transaction.amount)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminRecentTransactionsTable;