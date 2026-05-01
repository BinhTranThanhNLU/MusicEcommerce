import React, { useState } from "react";

interface Props {
  filters: { search: string; licenseType: string; status: string };
  onFilterChange: (key: string, value: string) => void;
}

const LicenseFilter: React.FC<Props> = ({ filters, onFilterChange }) => {
  // State cục bộ cho ô search để không gọi API mỗi khi gõ 1 chữ
  const [searchInput, setSearchInput] = useState(filters.search);

  // Chỉ kích hoạt lọc khi ấn Enter
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onFilterChange("search", searchInput);
    }
  };

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
            placeholder="Tìm theo Mã giấy phép, Tên... (Ấn Enter)"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleSearchKeyDown}
          />
        </div>

        {/* Dropdown Lọc */}
        <div className="d-flex gap-2">
          <select
            className="form-select bg-light border-0"
            style={{ minWidth: "160px" }}
            value={filters.licenseType}
            onChange={(e) => onFilterChange("licenseType", e.target.value)}
          >
            <option value="all">Mọi loại giấy phép</option>
            <option value="personal">Cá nhân (Standard)</option>
            <option value="commercial">Thương mại (Pro)</option>
            <option value="exclusive">Độc quyền (Bán đứt)</option>
          </select>

          <select
            className="form-select bg-light border-0"
            style={{ minWidth: "150px" }}
            value={filters.status}
            onChange={(e) => onFilterChange("status", e.target.value)}
          >
            <option value="all">Mọi trạng thái</option>
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