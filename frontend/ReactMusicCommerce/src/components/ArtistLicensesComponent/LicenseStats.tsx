import React from "react";
import type { ArtistLicenseStatsModel } from "../../models/ArtistLicenseStatsModel";

interface Props {
  stats: ArtistLicenseStatsModel | null;
}

const LicenseStats: React.FC<Props> = ({ stats }) => {
  return (
    <div className="row g-4 mb-4">
      <div className="col-md-4">
        <div className="card border-0 shadow-sm rounded-4 h-100 p-4 border-start border-4 border-primary">
          <h6 className="text-muted fw-semibold mb-2">Tổng giấy phép đã cấp</h6>
          <h3 className="fw-bold mb-0">
            {stats ? stats.totalLicenses : "..."} <span className="fs-6 text-muted fw-normal">giấy phép</span>
          </h3>
        </div>
      </div>
      <div className="col-md-4">
        <div className="card border-0 shadow-sm rounded-4 h-100 p-4 border-start border-4 border-danger">
          <h6 className="text-muted fw-semibold mb-2">Giấy phép Thương mại / Độc quyền</h6>
          <h3 className="fw-bold mb-0">
            {stats ? stats.commercialAndExclusiveLicenses : "..."} <span className="fs-6 text-muted fw-normal">giấy phép</span>
          </h3>
        </div>
      </div>
      <div className="col-md-4">
        <div className="card border-0 shadow-sm rounded-4 h-100 p-4 border-start border-4 border-warning">
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <h6 className="text-muted fw-semibold mb-2">Cảnh báo vi phạm (Content ID)</h6>
              <h3 className="fw-bold mb-0 text-warning">
                {stats ? stats.copyrightWarnings : "..."} <span className="fs-6 text-muted fw-normal">cảnh báo</span>
              </h3>
            </div>
            <button className="btn btn-sm btn-warning text-dark rounded-pill">Kiểm tra ngay</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LicenseStats;