import React from "react";

interface LicensePriceForm {
  licenseId: number;
  price: number;
}

interface Props {
  licenses: LicensePriceForm[];
  handleLicensePriceChange: (index: number, price: number) => void;
  error?: string;
}

const LicensePricing: React.FC<Props> = ({
  licenses,
  handleLicensePriceChange,
  error,
}) => {
  // Hàm phụ trợ map thông tin UI dựa theo licenseId trong database
  const getLicenseInfo = (id: number) => {
    switch (id) {
      case 1:
        return {
          title: "Personal License (Cá nhân)",
          desc: "Dành cho nhu cầu nghe cá nhân, sử dụng trong các dự án phi lợi nhuận.",
          icon: "bi-person-fill text-info",
        };
      case 2:
        return {
          title: "Commercial License (Thương mại)",
          desc: "Cho phép sử dụng trong các video mạng xã hội có bật kiếm tiền.",
          icon: "bi-briefcase-fill text-warning",
        };
      case 3:
        return {
          title: "Extended License (Mở rộng)",
          desc: "Quyền sử dụng không giới hạn, bao gồm phát sóng truyền hình, phim ảnh.",
          icon: "bi-building-fill text-danger",
        };
      default:
        return {
          title: "Giấy phép Khác",
          desc: "Cấp quyền sử dụng tùy chọn.",
          icon: "bi-file-earmark-text-fill text-secondary",
        };
    }
  };

  return (
    <div className="card border-0 shadow-sm rounded-4 mb-4">
      <div className="card-body p-4">
        <h5 className="fw-bold mb-4">Bản quyền & Cấp phép</h5>

        {licenses.map((license, index) => {
          const info = getLicenseInfo(license.licenseId);
          return (
            <div key={license.licenseId} className="mb-3">
              <label className="form-label fw-bold d-flex align-items-center">
                <i className={`bi me-2 ${info.icon}`}></i>
                {info.title}
              </label>
              <p className="small text-muted mb-2">{info.desc}</p>
              <div className="input-group">
                <input
                  type="number"
                  value={license.price || ""}
                  onChange={(e) =>
                    handleLicensePriceChange(
                      index,
                      parseInt(e.target.value) || 0,
                    )
                  }
                  className="form-control"
                  placeholder="0"
                  min="0"
                />
                <span className="input-group-text bg-light">VNĐ</span>
              </div>
              {/* Chỉ hiển thị đường gạch ngang nếu không phải là phần tử cuối cùng */}
              {index < licenses.length - 1 && (
                <hr className="my-4 text-muted" />
              )}
            </div>
          );
        })}

        {error && (
          <div className="alert alert-danger small mt-3 mb-0">
            <i className="bi bi-exclamation-circle me-1"></i>
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default LicensePricing;
