import { useEffect, useMemo, useState } from "react";
import "../../assets/css/adminDashboard.css";
import AdminRevenueStats from "../../components/AdminRevenueComponent/AdminRevenueStats";
import AdminTransactionHistory from "../../components/AdminRevenueComponent/AdminTransactionHistory";
import AdminTopSellingTracks from "../../components/AdminRevenueComponent/AdminTopSellingTracks";
import AdminRevenueChart from "../../components/AdminRevenueComponent/AdminRevenueChart";
import AdminRevenueDistribution from "../../components/AdminRevenueComponent/AdminRevenueDistribution";
import { getAdminDashboardOverview } from "../../apis/adminApi";
import type { AdminDashboardOverviewDTO } from "../../responsemodel/AdminDashboardOverviewDTO";
import { parseApiError } from "../../utils/apiError";

const AdminRevenuePage = () => {
  const [summaryData, setSummaryData] = useState<AdminDashboardOverviewDTO | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [period, setPeriod] = useState<string>("month");
  const [points, setPoints] = useState<number>(6); // Đổi mặc định thành 6 tháng cho giống UI
  const [refreshIndex, setRefreshIndex] = useState(0);

  useEffect(() => {
    const fetchSummary = async () => {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const overviewResult = await getAdminDashboardOverview(period, points);
        setSummaryData(overviewResult);
      } catch (error) {
        const parsedError = parseApiError(error, "Không thể tải dữ liệu doanh thu.");
        setErrorMessage(parsedError.message);
      } finally {
        setIsLoading(false);
      }
    };
    void fetchSummary();
  }, [period, points, refreshIndex]);

  // Lấy doanh thu Commercial License
  const commercialLicenseRevenue = useMemo(() => {
    const distribution = summaryData?.licenseRevenueDistribution ?? [];
    const commercialEntry = distribution.find((item) => {
      const label = (item.label ?? item.name ?? "").toLowerCase();
      return label.includes("commercial") || label.includes("thương mại") || label.includes("pro");
    });
    return commercialEntry?.value ?? commercialEntry?.revenue ?? 0;
  }, [summaryData]);

  // Lấy doanh thu Personal License
  const personalLicenseRevenue = useMemo(() => {
    const distribution = summaryData?.licenseRevenueDistribution ?? [];
    const personalEntry = distribution.find((item) => {
      const label = (item.label ?? item.name ?? "").toLowerCase();
      return label.includes("personal") || label.includes("cá nhân") || label.includes("basic");
    });
    return personalEntry?.value ?? personalEntry?.revenue ?? 0;
  }, [summaryData]);

  // Dữ liệu cho biểu đồ đường
  const revenueTrendData = summaryData?.revenueTrend ?? [];

  // Dữ liệu cho biểu đồ tròn (Pie Chart) - Cần map lại để có màu sắc
  const distributionColors = ["#0d6efd", "#198754", "#fd7e14", "#dc3545"];
  const revenueDistributionData = (summaryData?.contentDistribution ?? []).map((item, index) => ({
    name: item.contentType,
    value: item.count,
    color: distributionColors[index % distributionColors.length]
  }));

  if (isLoading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary"></div>
      </div>
    );
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
            onChange={(e) => setPoints(Math.max(3, Math.min(24, parseInt(e.target.value) || 6)))}
            className="form-control form-control-sm w-auto bg-light border-0"
            style={{ width: "80px" }}
          />
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm rounded-pill px-3"
            onClick={() => setRefreshIndex((current) => current + 1)}
          >
            <i className="bi bi-arrow-clockwise me-1"></i> Làm mới
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="alert alert-danger rounded-4 mb-4" role="alert">
          {errorMessage}
        </div>
      )}

      {/* STATS CARDS */}
      <AdminRevenueStats 
        totalRevenue={summaryData?.totalRevenue || 0}
        commercialLicenseRevenue={commercialLicenseRevenue}
        personalLicenseRevenue={personalLicenseRevenue}
        totalTransactions={summaryData?.totalTransactions || 0}
      />

      <div className="row g-4 mb-4">
        <div className="col-lg-8">
          <AdminRevenueChart data={revenueTrendData} />
        </div>
        <div className="col-lg-4">
          <AdminRevenueDistribution data={revenueDistributionData} />
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-4 d-flex flex-column gap-4">
          <AdminTopSellingTracks limit={5} />
        </div>
        <div className="col-lg-8">
          <AdminTransactionHistory />
        </div>
      </div>
    </div>
  );
};

export default AdminRevenuePage;