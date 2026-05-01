import React from "react";

const LicenseFilter = () => {
  return (
    <div className="card border-0 shadow-sm rounded-4 mb-4">
      <div className="card-body p-3 d-flex flex-wrap gap-3 align-items-center justify-content-between">
        {/* Thanh tìm kiếm */}
        <div className="input-group" style={{ maxWidth: "400px" }}>
          <span className="input-group-text bg-light border-end-0">
            <i className="bi bi-search text-muted"></i>
          </span>
          <input
            type="text"
            className="form-control bg-light border-start-0 ps-0"
            placeholder="Tìm theo Mã giấy phép, Tên khách hàng..."
          />
        </div>

        {/* Lọc theo Loại giấy phép & Trạng thái */}
        <div className="d-flex gap-2">
          <select
            className="form-select bg-light border-0"
            style={{ minWidth: "160px" }}
          >
            <option value="all">Mọi loại giấy phép</option>
            <option value="personal">Cá nhân (Standard)</option>
            <option value="commercial">Thương mại (Pro)</option>
            <option value="exclusive">Độc quyền (Bán đứt)</option>
          </select>

          <select
            className="form-select bg-light border-0"
            style={{ minWidth: "150px" }}
          >
            <option value="active">Đang hiệu lực</option>
            <option value="expired">Đã hết hạn</option>
            <option value="revoked">Đã thu hồi</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default LicenseFilter;
