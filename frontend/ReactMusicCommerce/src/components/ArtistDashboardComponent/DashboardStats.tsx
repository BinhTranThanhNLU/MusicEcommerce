import React from "react";
import type { DashboardStatsModel } from "../../models/ArtistDashboardSummaryModel";

interface Props {
  stats?: DashboardStatsModel;
}

const formatVND = (value: number) => {
  if (value >= 1000000) {
    return (value / 1000000).toFixed(1) + "M ₫"; // Rút gọn thành chữ M (Triệu) cho đẹp
  }
  return new Intl.NumberFormat("vi-VN").format(value) + " ₫";
};

const DashboardStats: React.FC<Props> = ({ stats }) => {
  return (
    <div className="row g-4 mb-4">
      {/* Card Doanh thu tháng */}
      <div className="col-xl-3 col-sm-6">
        <div className="card border-0 shadow-sm rounded-4 h-100">
          <div className="card-body p-4 d-flex align-items-center">
            <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex justify-content-center align-items-center me-3" style={{ width: "60px", height: "60px" }}>
              <i className="bi bi-wallet2 fs-3"></i>
            </div>
            <div>
              <p className="text-muted mb-1 small text-uppercase fw-semibold">Doanh thu tháng</p>
              <h4 className="fw-bold mb-0">{stats ? formatVND(stats.monthlyRevenue) : "0 ₫"}</h4>
            </div>
          </div>
        </div>
      </div>

      {/* Card Khách hàng */}
      <div className="col-xl-3 col-sm-6">
        <div className="card border-0 shadow-sm rounded-4 h-100">
          <div className="card-body p-4 d-flex align-items-center">
            <div className="bg-danger bg-opacity-10 text-danger rounded-circle d-flex justify-content-center align-items-center me-3" style={{ width: "60px", height: "60px" }}>
              <i className="bi bi-person-check fs-3"></i>
            </div>
            <div>
              <p className="text-muted mb-1 small text-uppercase fw-semibold">Khách hàng</p>
              <h4 className="fw-bold mb-0">{stats?.totalCustomers || 0}</h4>
            </div>
          </div>
        </div>
      </div>

      {/* Card Lượt đánh giá */}
      <div className="col-xl-3 col-sm-6">
        <div className="card border-0 shadow-sm rounded-4 h-100">
          <div className="card-body p-4 d-flex align-items-center">
            <div className="bg-info bg-opacity-10 text-info rounded-circle d-flex justify-content-center align-items-center me-3" style={{ width: "60px", height: "60px" }}>
              <i className="bi bi-star fs-3"></i>
            </div>
            <div>
              <p className="text-muted mb-1 small text-uppercase fw-semibold">Lượt đánh giá</p>
              <h4 className="fw-bold mb-0">{stats?.totalReviews || 0}</h4>
            </div>
          </div>
        </div>
      </div>

      {/* Card Tác phẩm đang bán */}
      <div className="col-xl-3 col-sm-6">
        <div className="card border-0 shadow-sm rounded-4 h-100">
          <div className="card-body p-4 d-flex align-items-center">
            <div className="bg-warning bg-opacity-10 text-warning rounded-circle d-flex justify-content-center align-items-center me-3" style={{ width: "60px", height: "60px" }}>
              <i className="bi bi-music-note-list fs-3"></i>
            </div>
            <div>
              <p className="text-muted mb-1 small text-uppercase fw-semibold">Tác phẩm đang bán</p>
              <h4 className="fw-bold mb-0">{stats?.activeTracks || 0}</h4>
              <small className="text-muted">Audio Tracks trực tuyến</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;