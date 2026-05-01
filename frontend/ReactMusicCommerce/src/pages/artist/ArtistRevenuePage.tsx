import React from "react";
import "../../assets/css/artistDashboard.css";
import RevenueStats from "../../components/ArtistRevenueComponent/RevenueStats";
import RevenueChart from "../../components/ArtistRevenueComponent/RevenueChart";
import RevenueDistribution from "../../components/ArtistRevenueComponent/RevenueDistribution";
import WithdrawalAccount from "../../components/ArtistRevenueComponent/WithdrawalAccount";
import TransactionHistory from "../../components/ArtistRevenueComponent/TransactionHistory";
import TopSellingTracks from "../../components/ArtistRevenueComponent/TopSellingTracks";

const ArtistRevenuePage = () => {
  // FAKE LOGIC RÚT TIỀN
  const handleWithdrawRequest = () => {
    const amount = window.prompt("Nhập số tiền bạn muốn rút (Tối thiểu 500,000 ₫):", "500000");
    if (amount) {
      if (parseInt(amount) < 500000) {
        alert("Số tiền rút phải lớn hơn hoặc bằng 500,000 ₫!");
      } else {
        alert(`Yêu cầu rút ${new Intl.NumberFormat("vi-VN").format(parseInt(amount))} ₫ đang được xử lý. Tiền sẽ về tài khoản Vietcombank của bạn trong vòng 24h.`);
      }
    }
  };

  return (
    <div className="container-fluid py-4 px-lg-4">
      {/* ================= TIÊU ĐỀ ================= */}
      <div className="d-flex justify-content-between align-items-end mb-4">
        <div>
          <h3 className="fw-bold mb-1" style={{ color: "var(--heading-color)" }}>Doanh thu & Rút tiền</h3>
          <p className="text-muted mb-0">Quản lý thu nhập từ việc bán bản quyền âm nhạc của bạn.</p>
        </div>
        <div>
          <button 
            className="btn rounded-pill px-4 shadow-sm text-white" 
            style={{ backgroundColor: "var(--accent-color)" }}
            onClick={handleWithdrawRequest}
          >
            <i className="bi bi-cash-stack me-2"></i> Yêu cầu rút tiền
          </button>
        </div>
      </div>

      {/* ================= HÀNG 1: THỐNG KÊ ================= */}
      <RevenueStats />

      {/* ================= HÀNG 2: BIỂU ĐỒ ================= */}
      <div className="row g-4 mb-4">
        <div className="col-lg-8">
          <RevenueChart />
        </div>
        <div className="col-lg-4">
          <RevenueDistribution />
        </div>
      </div>

      {/* ================= HÀNG 3: DANH SÁCH CHI TIẾT ================= */}
      <div className="row g-4">
        {/* Cột trái: Gồm Tài khoản ngân hàng và Top bài hát */}
        <div className="col-lg-4 d-flex flex-column gap-4">
          <WithdrawalAccount />
          <TopSellingTracks />
        </div>
        
        {/* Cột phải: Lịch sử giao dịch */}
        <div className="col-lg-8">
          <TransactionHistory />
        </div>
      </div>

    </div>
  );
};

export default ArtistRevenuePage;