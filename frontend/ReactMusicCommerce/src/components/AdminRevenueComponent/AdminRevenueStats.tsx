import React from "react";

interface Props {
  totalRevenue: number;
  commercialLicenseRevenue: number;
  personalLicenseRevenue: number;
  totalTransactions: number;
}

const formatVND = (value: number) => new Intl.NumberFormat("vi-VN").format(value) + " ₫";

const AdminRevenueStats: React.FC<Props> = ({ 
  totalRevenue, 
  commercialLicenseRevenue, 
  personalLicenseRevenue,
  totalTransactions 
}) => {
  return (
    <div className="row g-4 mb-4">
      {/* Card Tổng doanh thu */}
      <div className="col-lg-6">
        <div className="card border-0 shadow-sm rounded-4 h-100">
          <div className="card-body p-0 d-flex h-100" style={{ overflow: "hidden", borderRadius: 12 }}>
            <div style={{ width: 8, background: "linear-gradient(180deg,var(--accent-color),#36b6ff)" }} />
            <div className="p-4 w-100 d-flex flex-column justify-content-between" style={{ background: "#fff" }}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0 fw-medium text-muted">Tổng doanh thu</h5>
                <div style={{ width: 44, height: 44, borderRadius: 8, background: "rgba(0,0,0,0.04)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <i className="bi bi-graph-up fs-4 text-muted"></i>
                </div>
              </div>

              <div>
                <h1 className="fw-bold mb-2" style={{ color: "#111", fontSize: "3.25rem", letterSpacing: "-1px" }}>
                  {formatVND(totalRevenue)}
                </h1>
                <p className="mb-0 small text-muted">
                  Tổng doanh thu toàn nền tảng
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="col-lg-6">
        <div className="row g-4 h-100">
          {/* Card Commercial License */}
          <div className="col-sm-6">
            <div className="card border-0 shadow-sm rounded-4 h-100">
              <div className="card-body p-4 d-flex flex-column justify-content-center">
                <div className="d-flex align-items-center mb-2">
                  <div className="bg-primary bg-opacity-10 text-primary rounded p-2 me-2">
                    <i className="bi bi-briefcase"></i>
                  </div>
                  <span className="text-muted fw-semibold small text-uppercase">
                    Commercial License
                  </span>
                </div>
                <h4 className="fw-bold mb-0">{formatVND(commercialLicenseRevenue)}</h4>
                <small className="text-muted mt-1">
                  Bản quyền thương mại
                </small>
              </div>
            </div>
          </div>

          {/* Card Personal License */}
          <div className="col-sm-6">
            <div className="card border-0 shadow-sm rounded-4 h-100">
              <div className="card-body p-4 d-flex flex-column justify-content-center">
                <div className="d-flex align-items-center mb-2">
                  <div className="bg-info bg-opacity-10 text-info rounded p-2 me-2">
                    <i className="bi bi-person"></i>
                  </div>
                  <span className="text-muted fw-semibold small text-uppercase">
                    Personal License
                  </span>
                </div>
                <h4 className="fw-bold mb-0">{formatVND(personalLicenseRevenue)}</h4>
                <small className="text-info mt-1">
                  Bản quyền cá nhân
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminRevenueStats;
