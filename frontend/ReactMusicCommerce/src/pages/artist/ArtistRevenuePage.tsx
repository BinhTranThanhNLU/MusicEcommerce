import React, { useState, useEffect } from "react";
import "../../assets/css/artistDashboard.css";
import RevenueStats from "../../components/ArtistRevenueComponent/RevenueStats";
import RevenueChart from "../../components/ArtistRevenueComponent/RevenueChart";
import RevenueDistribution from "../../components/ArtistRevenueComponent/RevenueDistribution";
import WithdrawalAccount from "../../components/ArtistRevenueComponent/WithdrawalAccount";
import TransactionHistory from "../../components/ArtistRevenueComponent/TransactionHistory";
import TopSellingTracks from "../../components/ArtistRevenueComponent/TopSellingTracks";
import { getMyRevenueSummary } from "../../apis/artistApi";
import type { ArtistRevenueSummaryModel } from "../../models/ArtistRevenueSummaryModel";

const ArtistRevenuePage = () => {
  const [summaryData, setSummaryData] = useState<ArtistRevenueSummaryModel | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const data = await getMyRevenueSummary();
        setSummaryData(data);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu doanh thu:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSummary();
  }, []);

  const handleWithdrawRequest = () => {
    const amount = window.prompt("Nhập số tiền bạn muốn rút (Tối thiểu 500,000 ₫):", "500000");
    if (amount && parseInt(amount) >= 500000) {
      alert(`Yêu cầu rút ${new Intl.NumberFormat("vi-VN").format(parseInt(amount))} ₫ đang được xử lý.`);
    } else if (amount) {
      alert("Số tiền rút phải lớn hơn hoặc bằng 500,000 ₫!");
    }
  };

  if (isLoading) {
    return <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>;
  }

  return (
    <div className="container-fluid py-4 px-lg-4">
      <div className="d-flex justify-content-between align-items-end mb-4">
        <div>
          <h3 className="fw-bold mb-1" style={{ color: "var(--heading-color)" }}>Doanh thu & Rút tiền</h3>
          <p className="text-muted mb-0">Quản lý thu nhập từ việc bán bản quyền âm nhạc của bạn.</p>
        </div>
        <button className="btn rounded-pill px-4 shadow-sm text-white" style={{ backgroundColor: "var(--accent-color)" }} onClick={handleWithdrawRequest}>
          <i className="bi bi-cash-stack me-2"></i> Yêu cầu rút tiền
        </button>
      </div>

      {/* TRUYỀN DATA XUỐNG CÁC COMPONENT CON */}
      <RevenueStats 
        availableBalance={summaryData?.availableBalance || 0}
        pendingBalance={summaryData?.pendingBalance || 0}
        totalRevenue={summaryData?.totalRevenue || 0}
      />

      <div className="row g-4 mb-4">
        <div className="col-lg-8">
          <RevenueChart data={summaryData?.chartData || []} />
        </div>
        <div className="col-lg-4">
          <RevenueDistribution data={summaryData?.distributionData || []} />
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-4 d-flex flex-column gap-4">
          <WithdrawalAccount />
          <TopSellingTracks tracks={summaryData?.topTracks || []} />
        </div>
        <div className="col-lg-8">
          <TransactionHistory />
        </div>
      </div>
    </div>
  );
};

export default ArtistRevenuePage;