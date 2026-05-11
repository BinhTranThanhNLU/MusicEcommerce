import React, { useState, useEffect } from "react";
import { getAdminOrders } from "../../apis/adminApi";
import type { AdminOrderPageResponse } from "../../responsemodel/AdminOrderPageResponse";

const formatVND = (value: number) => {
  return new Intl.NumberFormat("vi-VN").format(value) + " ₫";
};

const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);
  return {
    date: date.toLocaleDateString("vi-VN"),
    time: date.toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' })
  };
};

const AdminTransactionHistory = () => {
  const [pageData, setPageData] = useState<AdminOrderPageResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(0);
  const size = 5;

  useEffect(() => {
    const fetchTransactions = async () => {
      setIsLoading(true);
      try {
        const data = await getAdminOrders(page, size);
        setPageData(data);
      } catch (error) {
        console.error("Lỗi tải lịch sử giao dịch:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTransactions();
  }, [page]);

  return (
    <div className="card border-0 shadow-sm rounded-4 h-100 flex-column d-flex overflow-hidden">
      <div className="p-4 border-bottom d-flex justify-content-between align-items-center bg-white">
        <h5 className="fw-bold mb-0">Lịch sử giao dịch gần đây</h5>
        <select className="form-select form-select-sm w-auto bg-light border-0">
          <option value="all">Tất cả trạng thái</option>
          <option value="PENDING">Đang chờ</option>
          <option value="COMPLETED">Hoàn tất</option>
          <option value="FAILED">Thất bại</option>
        </select>
      </div>
      
      <div className="table-responsive flex-grow-1">
        <table className="table table-hover align-middle mb-0">
          <thead className="table-light text-muted small text-uppercase">
            <tr>
              <th className="ps-4 py-3">Ngày</th>
              <th className="py-3">ID Đơn</th>
              <th className="py-3">Khách hàng</th>
              <th className="py-3 text-end">Số tiền</th>
              <th className="pe-4 py-3 text-center">Trạng thái</th>
            </tr>
          </thead>
          <tbody className="bg-white border-top-0">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="text-center py-5 text-muted">
                  <div className="spinner-border spinner-border-sm me-2"></div> Đang tải...
                </td>
              </tr>
            ) : pageData?.orders.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-5 text-muted">Không có giao dịch nào.</td>
              </tr>
            ) : (
              pageData?.orders.map((order) => {
                const { date, time } = formatDateTime(order.createdAt);
                return (
                  <tr key={order.orderId}>
                    <td className="ps-4 text-muted small">
                      {date}<br />{time}
                    </td>
                    <td className="fw-semibold">#{order.orderId}</td>
                    <td>
                      <div>
                        <p className="mb-0 fw-bold">{order.customerName}</p>
                        <small className="text-muted">{order.customerEmail}</small>
                      </div>
                    </td>
                    <td className="text-end fw-bold text-success">
                      {formatVND(order.totalAmount)}
                    </td>
                    <td className="pe-4 text-center">
                      <span className={`badge rounded-pill ${
                        order.paymentStatus === "COMPLETED" ? "bg-success bg-opacity-10 text-success" : 
                        order.paymentStatus === "PENDING" ? "bg-warning bg-opacity-10 text-warning" :
                        "bg-danger bg-opacity-10 text-danger"
                      }`}>
                        {order.paymentStatus === "COMPLETED" ? "Hoàn tất" : 
                         order.paymentStatus === "PENDING" ? "Đang chờ" : "Thất bại"}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Phân trang */}
      <div className="p-3 bg-white d-flex justify-content-between align-items-center mt-auto border-top">
        <span className="text-muted small">
          Tổng cộng: {pageData?.totalItems || 0} giao dịch
        </span>
        <div className="btn-group">
          <button 
            className="btn btn-sm btn-outline-secondary" 
            disabled={page === 0 || isLoading}
            onClick={() => setPage(page - 1)}
          >
            <i className="bi bi-chevron-left"></i> Trước
          </button>
          <button 
            className="btn btn-sm btn-outline-secondary" 
            disabled={!pageData || page >= pageData.totalPages - 1 || isLoading}
            onClick={() => setPage(page + 1)}
          >
            Sau <i className="bi bi-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminTransactionHistory;
