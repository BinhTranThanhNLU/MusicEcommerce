import React from "react";

const RevenueStats = () => {
  return (
    <div className="row g-4 mb-4">
      {/* Card Số dư khả dụng */}
      <div className="col-lg-6">
        <div
          className="card border-0 shadow-sm rounded-4 h-100 text-white"
          style={{
            background: "linear-gradient(135deg, var(--accent-color), #4a4a4a)",
          }}
        >
          <div className="card-body p-4 d-flex flex-column justify-content-between">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0 fw-medium opacity-75">Số dư khả dụng</h5>
              <i className="bi bi-wallet2 fs-2 opacity-50"></i>
            </div>
            <div>
              <h1 className="fw-bold display-5 mb-2">12.500.000 ₫</h1>
              <p className="mb-0 opacity-75 small">
                Đã trừ 10% phí nền tảng (Platform Fee)
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="col-lg-6">
        <div className="row g-4 h-100">
          {/* Card Chờ xử lý */}
          <div className="col-sm-6">
            <div className="card border-0 shadow-sm rounded-4 h-100">
              <div className="card-body p-4 d-flex flex-column justify-content-center">
                <div className="d-flex align-items-center mb-2">
                  <div className="bg-warning bg-opacity-10 text-warning rounded p-2 me-2">
                    <i className="bi bi-hourglass-split"></i>
                  </div>
                  <span className="text-muted fw-semibold small text-uppercase">
                    Đang chờ xử lý
                  </span>
                </div>
                <h4 className="fw-bold mb-0">500.000 ₫</h4>
                <small className="text-muted mt-1">
                  Sẽ cộng vào số dư sau 24h
                </small>
              </div>
            </div>
          </div>

          {/* Card Tổng doanh thu */}
          <div className="col-sm-6">
            <div className="card border-0 shadow-sm rounded-4 h-100">
              <div className="card-body p-4 d-flex flex-column justify-content-center">
                <div className="d-flex align-items-center mb-2">
                  <div className="bg-success bg-opacity-10 text-success rounded p-2 me-2">
                    <i className="bi bi-graph-up-arrow"></i>
                  </div>
                  <span className="text-muted fw-semibold small text-uppercase">
                    Tổng thu nhập
                  </span>
                </div>
                <h4 className="fw-bold mb-0">45.800.000 ₫</h4>
                <small className="text-success mt-1">
                  <i className="bi bi-arrow-up-short"></i> Tăng trưởng ổn định
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueStats;
