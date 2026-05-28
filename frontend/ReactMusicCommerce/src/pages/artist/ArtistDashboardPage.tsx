import { useState, useEffect } from "react";
import "../../assets/css/artistDashboard.css";
import DashboardStats from "../../components/ArtistDashboardComponent/DashboardStats";
import RevenueChart from "../../components/ArtistDashboardComponent/RevenueChart";
import LicenseDistributionChart from "../../components/ArtistDashboardComponent/LicenseDistributionChart";
import TopTracksChart from "../../components/ArtistDashboardComponent/TopTracksChart";
import RecentActivityTable from "../../components/ArtistDashboardComponent/RecentActivityTable";
import NotificationsList from "../../components/ArtistDashboardComponent/NotificationsList"; // Thêm lại import này
import { getDashboardSummary } from "../../apis/artistApi";
import type { ArtistDashboardSummaryModel } from "../../models/ArtistDashboardSummaryModel";

const ArtistDashboardPage = () => {
  const [summaryData, setSummaryData] =
    useState<ArtistDashboardSummaryModel | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDashboardInfo = async () => {
      try {
        const response = await getDashboardSummary();
        const data = response.data || response;
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
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "70vh" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4 px-lg-4">
      {/* Tiêu đề */}
      <div className="d-flex justify-content-between align-items-end mb-4">
        <div>
          <h3
            className="fw-bold mb-1"
            style={{
              color: "var(--heading-color)",
              fontFamily: "var(--heading-font)",
            }}
          >
            Tổng quan cửa hàng
          </h3>
          <p className="text-muted mb-0">
            Theo dõi doanh thu, hiệu suất tác phẩm và hoạt động của khán giả.
          </p>
        </div>
        <div>
          <button
            className="btn rounded-pill px-4 shadow-sm text-white"
            style={{ backgroundColor: "var(--accent-color)" }}
          >
            <i className="bi bi-plus-lg me-2"></i> Đăng tác phẩm mới
          </button>
        </div>
      </div>

      {/* Row 1: Thống kê nhanh (KPI) */}
      <DashboardStats stats={summaryData?.stats} />

      {/* Row 2: Biểu đồ Doanh thu (8) & Cơ cấu Giấy phép (4) */}
      <div className="row g-4 mb-4">
        <div className="col-lg-8">
          <RevenueChart data={summaryData?.revenueChart} />
        </div>
        <div className="col-lg-4">
          <LicenseDistributionChart data={summaryData?.licenseDistribution} />
        </div>
      </div>

      {/* Row 3: Top Tác phẩm (8) & Thông báo (4) */}
      <div className="row g-4 mb-4">
        <div className="col-lg-8">
          <TopTracksChart data={summaryData?.topPerformingTracks} />
        </div>
        <div className="col-lg-4">
          <NotificationsList />
        </div>
      </div>

      {/* Row 4: Hoạt động tương tác (Full width - 12) nằm ở cuối */}
      <div className="row">
        <div className="col-12">
          <RecentActivityTable
            activities={summaryData?.recentActivities || []}
          />
        </div>
      </div>
    </div>
  );
};

export default ArtistDashboardPage;
