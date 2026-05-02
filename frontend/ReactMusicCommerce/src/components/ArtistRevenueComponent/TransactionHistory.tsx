import React, { useState, useEffect } from "react";
import { getMyTransactions } from "../../apis/artistApi";
import type { TransactionPageResponse } from "../../responsemodel/TransactionPageResponse";

const formatVND = (value: number) => {
  return new Intl.NumberFormat("vi-VN").format(value) + " ₫";
};

// Hàm tách chuỗi thời gian thành Ngày và Giờ
const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);
  return {
    date: date.toLocaleDateString("vi-VN"),
    time: date.toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' })
  };
};

const TransactionHistory = () => {
  const [pageData, setPageData] = useState<TransactionPageResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(0);
  const size = 5;

  useEffect(() => {
    const fetchTransactions = async () => {
      setIsLoading(true);
      try {
        const data = await getMyTransactions(page, size);
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
        <h5 className="fw-bold mb-0">Lịch sử giao dịch</h5>
        <select className="form-select form-select-sm w-auto bg-light border-0">
          <option value="all">Tất cả giao dịch</option>
          <option value="sales">Tiền thu từ bán nhạc</option>
          <option value="withdrawals">Lịch sử rút tiền</option>
        </select>
      </div>
      
      <div className="table-responsive flex-grow-1">
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
            {isLoading ? (
              <tr>
                <td colSpan={4} className="text-center py-5 text-muted">
                  <div className="spinner-border spinner-border-sm me-2"></div> Đang tải...
                </td>
              </tr>
            ) : pageData?.transactions.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-5 text-muted">Không có giao dịch nào.</td>
              </tr>
            ) : (
              pageData?.transactions.map((tx) => {
                const { date, time } = formatDateTime(tx.createdAt);
                return (
                  <tr key={tx.id}>
                    <td className="ps-4 text-muted small">
                      {date}<br />{time}
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className={`rounded-circle p-2 me-3 ${
                          tx.type === "withdraw" ? "bg-danger bg-opacity-10 text-danger" : "bg-success bg-opacity-10 text-success"
                        }`}>
                          <i className={`bi ${tx.type === "withdraw" ? "bi-arrow-up-right" : "bi-arrow-down-left"}`}></i>
                        </div>
                        <div>
                          <p className="mb-0 fw-bold">{tx.title}</p>
                          <small className="text-muted">{tx.desc}</small>
                        </div>
                      </div>
                    </td>
                    <td className={`text-end fw-bold ${
                      tx.type === "withdraw" ? "text-dark" : "text-success"
                    }`}>
                      {tx.type !== "withdraw" ? "+ " : "- "}{formatVND(tx.amount)}
                    </td>
                    <td className="pe-4 text-center">
                      <span className={`badge rounded-pill ${
                        tx.status === "Hoàn tất" ? "bg-success bg-opacity-10 text-success" : "bg-warning bg-opacity-10 text-warning"
                      }`}>
                        {tx.status}
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
          Tổng cộng: {pageData?.totalElements || 0} giao dịch
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

export default TransactionHistory;