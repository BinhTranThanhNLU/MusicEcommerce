import React, { useState, useEffect } from "react";
import "../../assets/css/artistDashboard.css";
import DashboardStats from "../../components/ArtistDashboardComponent/DashboardStats";
import TrafficChart from "../../components/ArtistDashboardComponent/TrafficChart";
import NotificationsList from "../../components/ArtistDashboardComponent/NotificationsList";
import RecentActivityTable from "../../components/ArtistDashboardComponent/RecentActivityTable";
import { getDashboardSummary } from "../../apis/artistApi";
import type { ArtistDashboardSummaryModel } from "../../models/ArtistDashboardSummaryModel";

const ArtistDashboardPage = () => {
  const [summaryData, setSummaryData] = useState<ArtistDashboardSummaryModel | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDashboardInfo = async () => {
      try {
        const data = await getDashboardSummary();
        setSummaryData(data);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu Dashboard:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardInfo();
  }, []);

  if (isLoading) {
    return <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>;
  }

  return (
    <div className="container-fluid py-4 px-lg-4">
      {/* Tiêu đề */}
      <div className="d-flex justify-content-between align-items-end mb-4">
        <div>
          <h3 className="fw-bold mb-1" style={{ color: "var(--heading-color)", fontFamily: "var(--heading-font)" }}>Tổng quan cửa hàng</h3>
          <p className="text-muted mb-0">Theo dõi lưu lượng truy cập và hoạt động tương tác của khán giả.</p>
        </div>
        <div>
          <button className="btn rounded-pill px-4 shadow-sm text-white" style={{ backgroundColor: "var(--accent-color)" }}>
            <i className="bi bi-plus-lg me-2"></i> Đăng tác phẩm mới
          </button>
        </div>
      </div>

      {/* Row 1: Thống kê nhanh */}
      <DashboardStats stats={summaryData?.stats} />

      {/* Row 2: Biểu đồ & Thông báo (DỮ LIỆU MOCK ĐỂ TRANG TRÍ) */}
      <div className="row g-4 mb-4">
        <div className="col-lg-8">
          <TrafficChart />
        </div>
        <div className="col-lg-4">
          <NotificationsList />
        </div>
      </div>

      {/* Row 3: Hoạt động tương tác */}
      <div className="row">
        <div className="col-12">
          <RecentActivityTable activities={summaryData?.recentActivities || []} />
        </div>
      </div>

    </div>
  );
};

export default ArtistDashboardPage;