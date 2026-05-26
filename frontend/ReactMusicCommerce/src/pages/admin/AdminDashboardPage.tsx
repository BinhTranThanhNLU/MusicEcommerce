import { useEffect, useState } from "react";
import "../../assets/css/adminDashboard.css";
import { getAdminDashboardOverview } from "../../apis/adminApi";
import AdminDashboardSummaryCards from "../../components/AdminDashboardComponent/AdminDashboardSummaryCards";
import AdminRevenueTrendChart from "../../components/AdminDashboardComponent/AdminRevenueTrendChart";
import AdminGrowthTrendChart from "../../components/AdminDashboardComponent/AdminGrowthTrendChart";
import AdminContentDistributionChart from "../../components/AdminDashboardComponent/AdminContentDistributionChart";
import AdminRecentTransactionsTable from "../../components/AdminDashboardComponent/AdminRecentTransactionsTable";
import AdminPendingSongsTable from "../../components/AdminDashboardComponent/AdminPendingSongsTable";
import { parseApiError } from "../../utils/apiError";
import type { AdminDashboardOverviewDTO } from "../../responsemodel/AdminDashboardOverviewDTO";

const AdminDashboardPage = () => {
  const [dashboardData, setDashboardData] = useState<AdminDashboardOverviewDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [period, setPeriod] = useState("month");
  const [points, setPoints] = useState(12);
  const [refreshIndex, setRefreshIndex] = useState(0);

  useEffect(() => {
    const fetchDashboardOverview = async () => {
      setLoading(true);
      setErrorMessage(null);

      try {
        const data = await getAdminDashboardOverview(period, points);
        setDashboardData(data);
      } catch (error) {
        setDashboardData(null);
        setErrorMessage(parseApiError(error, "Không thể tải dữ liệu tổng quan dashboard.").message);
      } finally {
        setLoading(false);
      }
    };

    void fetchDashboardOverview();
  }, [period, points, refreshIndex]);

  return (
    <div className="admin-dashboard-page container-fluid py-4 px-lg-4">
      <div className="card border-0 shadow-sm rounded-4 mb-4 admin-hero">
        <div className="card-body p-4 p-lg-5 position-relative">
          <div className="d-flex flex-column flex-xl-row justify-content-between align-items-start align-items-xl-end gap-4 position-relative">
            <div>
              <span className="badge rounded-pill text-bg-light text-dark mb-3">
                Admin dashboard overview
              </span>
              <h3 className="fw-bold mb-2">Bảng điều khiển hệ thống</h3>
              <p className="mb-0 text-white-50" style={{ maxWidth: "760px" }}>
                Theo dõi doanh thu, tăng trưởng người dùng và cơ cấu nội dung theo từng chu kỳ.
              </p>
            </div>

            <div className="d-flex flex-column flex-sm-row gap-3 align-items-stretch align-items-sm-end">
              <div>
                <label className="form-label small text-white-50 mb-2">Chu kỳ</label>
                <select
                  className="form-select admin-filter-chip border-0 shadow-sm"
                  value={period}
                  onChange={(event) => setPeriod(event.target.value)}
                >
                  <option value="day">Theo ngày</option>
                  <option value="month">Theo tháng</option>
                  <option value="year">Theo năm</option>
                </select>
              </div>
              <div>
                <label className="form-label small text-white-50 mb-2">Số điểm</label>
                <input
                  type="number"
                  min={3}
                  max={24}
                  value={points}
                  onChange={(event) => setPoints(Math.max(3, Math.min(24, Number(event.target.value) || 12)))}
                  className="form-control admin-filter-chip border-0 shadow-sm"
                />
              </div>
              <button
                className="btn btn-light rounded-pill px-4 shadow-sm fw-semibold"
                type="button"
                onClick={() => setRefreshIndex((current) => current + 1)}
              >
                <i className="bi bi-arrow-clockwise me-2"></i> Làm mới
              </button>
            </div>
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="alert alert-danger border-0 shadow-sm rounded-4 mb-4" role="alert">
          {errorMessage}
        </div>
      )}

      <AdminDashboardSummaryCards data={dashboardData} loading={loading} />

      <div className="row g-4 mb-4">
        <div className="col-lg-8">
          <AdminRevenueTrendChart data={dashboardData?.revenueTrend ?? []} />
        </div>
        <div className="col-lg-4">
          <AdminContentDistributionChart data={dashboardData?.contentDistribution ?? []} />
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-12">
          <AdminGrowthTrendChart data={dashboardData?.growthTrend ?? []} />
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-12">
          <AdminRecentTransactionsTable />
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-12">
          <AdminPendingSongsTable />
        </div>
      </div>

    </div>
  );
};

export default AdminDashboardPage;
