import React from "react";

const mockTransactions = [
  {
    id: 1,
    date: "23/12/2025",
    time: "14:30",
    type: "sale",
    title: "Bán giấy phép Thương mại",
    desc: "Tác phẩm: Cơn Mưa Ngang Qua",
    amount: "+ 2.250.000 ₫",
    status: "Hoàn tất",
  },
  {
    id: 2,
    date: "22/12/2025",
    time: "09:15",
    type: "sale",
    title: "Bán giấy phép Cá nhân",
    desc: "Tác phẩm: Nắng Ấm Xa Dần",
    amount: "+ 135.000 ₫",
    status: "Hoàn tất",
  },
  {
    id: 3,
    date: "15/12/2025",
    time: "10:00",
    type: "withdraw",
    title: "Rút tiền về Vietcombank",
    desc: "Mã GD: #WD-0992",
    amount: "- 10.000.000 ₫",
    status: "Đã chuyển",
  },
  {
    id: 4,
    date: "23/12/2025",
    time: "16:00",
    type: "pending",
    title: "Bán giấy phép Youtube",
    desc: "Tác phẩm: Em Của Ngày Hôm Qua",
    amount: "+ 450.000 ₫",
    status: "Đang giữ (Hold)",
  },
];

const TransactionHistory = () => {
  return (
    <div className="card border-0 shadow-sm rounded-4 h-100 overflow-hidden">
      <div className="p-4 border-bottom d-flex justify-content-between align-items-center bg-white">
        <h5 className="fw-bold mb-0">Lịch sử giao dịch</h5>
        <select className="form-select form-select-sm w-auto bg-light border-0">
          <option value="all">Tất cả giao dịch</option>
          <option value="sales">Tiền thu từ bán nhạc</option>
          <option value="withdrawals">Lịch sử rút tiền</option>
        </select>
      </div>

      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0">
          <thead className="table-light text-muted small text-uppercase">
            <tr>
              <th className="ps-4 py-3">Ngày</th>
              <th className="py-3">Mô tả giao dịch</th>
              <th className="py-3 text-end">Số tiền</th>
              <th className="pe-4 py-3 text-center">Trạng thái</th>
            </tr>
          </thead>
          <tbody className="bg-white border-top-0">
            {mockTransactions.map((tx) => (
              <tr key={tx.id}>
                <td className="ps-4 text-muted small">
                  {tx.date}
                  <br />
                  {tx.time}
                </td>
                <td>
                  <div className="d-flex align-items-center">
                    <div
                      className={`rounded-circle p-2 me-3 ${
                        tx.type === "withdraw"
                          ? "bg-danger bg-opacity-10 text-danger"
                          : "bg-success bg-opacity-10 text-success"
                      }`}
                    >
                      <i
                        className={`bi ${tx.type === "withdraw" ? "bi-arrow-up-right" : "bi-arrow-down-left"}`}
                      ></i>
                    </div>
                    <div>
                      <p className="mb-0 fw-bold">{tx.title}</p>
                      <small className="text-muted">{tx.desc}</small>
                    </div>
                  </div>
                </td>
                <td
                  className={`text-end fw-bold ${
                    tx.type === "withdraw"
                      ? "text-dark"
                      : tx.type === "pending"
                        ? "text-warning"
                        : "text-success"
                  }`}
                >
                  {tx.amount}
                </td>
                <td className="pe-4 text-center">
                  <span
                    className={`badge rounded-pill ${
                      tx.type === "withdraw"
                        ? "bg-success"
                        : tx.status === "Hoàn tất"
                          ? "bg-success bg-opacity-10 text-success"
                          : "bg-warning bg-opacity-10 text-warning"
                    }`}
                  >
                    {tx.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-3 bg-white text-center mt-auto border-top">
        <a
          href="#"
          className="text-decoration-none fw-medium text-primary small"
        >
          Xem báo cáo chi tiết <i className="bi bi-arrow-right"></i>
        </a>
      </div>
    </div>
  );
};

export default TransactionHistory;
