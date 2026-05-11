import React, { useState, useEffect } from "react";
import "../../assets/css/adminDashboard.css";
import AdminRevenueStats from "../../components/AdminRevenueComponent/AdminRevenueStats";
import AdminRevenueChart from "../../components/AdminRevenueComponent/AdminRevenueChart";
import AdminRevenueDistribution from "../../components/AdminRevenueComponent/AdminRevenueDistribution";
import AdminTransactionHistory from "../../components/AdminRevenueComponent/AdminTransactionHistory";
import AdminTopSellingTracks from "../../components/AdminRevenueComponent/AdminTopSellingTracks";
import { getAdminDashboardOverview } from "../../apis/adminApi";
import type { AdminDashboardOverviewDTO } from "../../responsemodel/AdminDashboardOverviewDTO";
import type { RevenueChartModel } from "../../models/RevenueChartModel";
import type { RevenuePieModel } from "../../models/RevenuePieModel";
import type { TopTrackModel } from "../../models/TopTrackModel";

const AdminRevenuePage = () => {
  const [summaryData, setSummaryData] = useState<AdminDashboardOverviewDTO | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [period, setPeriod] = useState<string>("month");
  const [points, setPoints] = useState<number>(12);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const data = await getAdminDashboardOverview(period, points);
        setSummaryData(data);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu doanh thu:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSummary();
  }, [period, points]);

  // Transform AdminRevenuePointDTO to RevenueChartModel
  const transformChartData = (): RevenueChartModel[] => {
    return summaryData?.revenueTrend.map(point => ({
      name: point.label,
      revenue: point.revenue
    })) || [];
  };

  // Transform ContentDistribution to RevenuePieModel
  const transformDistributionData = (): RevenuePieModel[] => {
    const colors = ["#0d6efd", "#198754", "#fd7e14", "#dc3545"];
    return summaryData?.contentDistribution.map((item, index) => ({
      name: item.contentType,
      value: (summaryData.totalRevenue * item.percentage) / 100,
      color: colors[index % colors.length]
    })) || [];
  };

  // Mock top tracks data
  const getTopTracks = (): TopTrackModel[] => {
    return [
      {
        id: 1,
        title: "Beautiful Sunset",
        cover: "https://via.placeholder.com/40?text=Track1",
        type: "Commercial License",
        revenue: 2500000
      },
      {
        id: 2,
        title: "Morning Coffee",
        cover: "https://via.placeholder.com/40?text=Track2",
        type: "Personal License",
        revenue: 1800000
      },
      {
        id: 3,
        title: "Night Dreams",
        cover: "https://via.placeholder.com/40?text=Track3",
        type: "Commercial License",
        revenue: 1500000
      },
      {
        id: 4,
        title: "Ocean Waves",
        cover: "https://via.placeholder.com/40?text=Track4",
        type: "Personal License",
        revenue: 1200000
      },
      {
        id: 5,
        title: "Forest Walk",
        cover: "https://via.placeholder.com/40?text=Track5",
        type: "Commercial License",
        revenue: 900000
      }
    ];
  };

  // Calculate revenue by license type
  const calculateRevenueByType = () => {
    if (!summaryData) return { commercial: 0, personal: 0 };
    
    let commercial = 0;
    let personal = 0;

    summaryData.contentDistribution.forEach(item => {
      const revenue = (summaryData.totalRevenue * item.percentage) / 100;
      if (item.contentType.includes("Commercial")) {
        commercial += revenue;
      } else {
        personal += revenue;
      }
    });

    return { commercial: commercial || summaryData.totalRevenue * 0.6, personal: personal || summaryData.totalRevenue * 0.4 };
  };

  const revenueByType = calculateRevenueByType();

  if (isLoading) {
    return <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>;
  }

  return (
    <div className="container-fluid py-4 px-lg-4">
      <div className="d-flex justify-content-between align-items-end mb-4">
        <div>
          <h3 className="fw-bold mb-1" style={{ color: "var(--heading-color)" }}>Doanh thu & Phân tích</h3>
          <p className="text-muted mb-0">Theo dõi doanh thu toàn nền tảng từ bán bản quyền âm nhạc.</p>
        </div>
        <div className="d-flex gap-2">
          <select 
            className="form-select form-select-sm w-auto bg-light border-0"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
          >
            <option value="day">Theo ngày</option>
            <option value="month">Theo tháng</option>
            <option value="year">Theo năm</option>
          </select>
          <input
            type="number"
            min={3}
            max={24}
            value={points}
            onChange={(e) => setPoints(Math.max(3, Math.min(24, parseInt(e.target.value) || 12)))}
            className="form-control form-control-sm w-auto bg-light border-0"
            style={{ width: "80px" }}
          />
        </div>
      </div>

      {/* STATS CARDS */}
      <AdminRevenueStats 
        totalRevenue={summaryData?.totalRevenue || 0}
        commercialLicenseRevenue={revenueByType.commercial}
        personalLicenseRevenue={revenueByType.personal}
        totalTransactions={0}
      />

      <div className="row g-4 mb-4">
        <div className="col-lg-8">
          <AdminRevenueChart data={transformChartData()} />
        </div>
        <div className="col-lg-4">
          <AdminRevenueDistribution data={transformDistributionData()} />
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-4 d-flex flex-column gap-4">
          <AdminTopSellingTracks tracks={getTopTracks()} />
        </div>
        <div className="col-lg-8">
          <AdminTransactionHistory />
        </div>
      </div>
    </div>
  );
};

export default AdminRevenuePage;
