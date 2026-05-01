import React from "react";

// Dữ liệu giả lập (Sau này bạn thay bằng dữ liệu fetch từ Spring Boot API)
const mockLicenses = [
  {
    id: 15,
    code: "LIC-2026-00015",
    customer: "Creative Agency VN",
    trackName: "Cơn Mưa Ngang Qua",
    cover: "https://placehold.co/40x40",
    type: "Thương mại",
    watermark: "WMK-CNMQ-8821",
    status: "Hợp lệ",
    issueDate: "21/04/2026",
    expireDate: "21/04/2027",
    revenue: 625000,
  },
  {
    id: 16,
    code: "LIC-2026-00016",
    customer: "Nguyễn Văn A",
    trackName: "Nắng Ấm Xa Dần",
    cover: "https://placehold.co/40x40",
    type: "Cá nhân",
    watermark: "Không áp dụng",
    status: "Hợp lệ",
    issueDate: "22/04/2026",
    expireDate: "Vĩnh viễn",
    revenue: 225000,
  },
  {
    id: 17,
    code: "LIC-2026-00017",
    customer: "Bad Boy Studio",
    trackName: "Chắc Ai Đó Sẽ Về",
    cover: "https://placehold.co/40x40",
    type: "Thương mại",
    watermark: "WMK-CADSV-1102",
    status: "Hết hạn",
    issueDate: "10/01/2025",
    expireDate: "10/01/2026",
    revenue: 625000,
  },
];

const formatVND = (price) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};

const LicenseTable = () => {
  return (
    <div className="card border-0 shadow-sm rounded-4 overflow-visible">
      <div className="table-responsive" style={{ minHeight: "300px" }}>
        <table className="table table-hover align-middle mb-0">
          <thead className="table-light text-muted small text-uppercase">
            <tr>
              <th className="ps-4 py-3">Mã GP / Khách Hàng</th>
              <th className="py-3">Tác Phẩm</th>
              <th className="py-3">Loại GP</th>
              <th className="py-3">Watermark ID</th>
              <th className="py-3">Thời Gian</th>
              <th className="py-3">Doanh Thu</th>
              <th className="py-3 text-center">Trạng Thái</th>
              <th className="pe-4 py-3 text-end">Thao Tác</th>
            </tr>
          </thead>
          <tbody className="bg-white border-top-0">
            {mockLicenses.map((license) => (
              <tr key={license.id}>
                {/* Cột Mã GP / Khách hàng */}
                <td className="ps-4 py-3">
                  <div className="fw-bold text-dark mb-1">{license.code}</div>
                  <div className="small text-muted">
                    <i className="bi bi-person-fill me-1"></i>{" "}
                    {license.customer}
                  </div>
                </td>

                {/* Cột Tác phẩm */}
                <td>
                  <div className="d-flex align-items-center">
                    <img
                      src={license.cover}
                      alt="Cover"
                      className="rounded-2 me-2"
                      style={{
                        width: "40px",
                        height: "40px",
                        objectFit: "cover",
                      }}
                    />
                    <span className="fw-medium text-dark">
                      {license.trackName}
                    </span>
                  </div>
                </td>

                {/* Cột Loại GP */}
                <td>
                  <span
                    className={`badge rounded-pill px-3 py-1 ${
                      license.type === "Thương mại"
                        ? "bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25"
                        : "bg-info bg-opacity-10 text-info border border-info border-opacity-25"
                    }`}
                  >
                    {license.type}
                  </span>
                </td>

                {/* Cột Watermark */}
                <td>
                  {license.watermark === "Không áp dụng" ? (
                    <span className="text-muted small fst-italic">
                      Không áp dụng
                    </span>
                  ) : (
                    <code className="text-secondary bg-light px-2 py-1 rounded">
                      {license.watermark}
                    </code>
                  )}
                </td>

                {/* Cột Thời gian (MỚI) */}
                <td>
                  <div className="small text-dark mb-1">
                    Cấp: {license.issueDate}
                  </div>
                  <div className="small text-muted">
                    Hết: {license.expireDate}
                  </div>
                </td>

                {/* Cột Doanh Thu (MỚI) */}
                <td>
                  <span className="fw-semibold text-success">
                    {formatVND(license.revenue)}
                  </span>
                </td>

                {/* Cột Trạng thái */}
                <td className="text-center">
                  {license.status === "Hợp lệ" ? (
                    <span className="text-success small fw-bold">
                      <i className="bi bi-shield-check me-1"></i> Hợp lệ
                    </span>
                  ) : (
                    <span className="text-danger small fw-bold">
                      <i className="bi bi-x-circle me-1"></i> Hết hạn
                    </span>
                  )}
                </td>

                {/* Cột Thao tác (MỚI) */}
                <td className="pe-4 text-end">
                  <div className="dropdown">
                    <button
                      className="btn btn-sm btn-light text-secondary rounded-circle"
                      type="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <i className="bi bi-three-dots-vertical"></i>
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end shadow border-0">
                      <li>
                        <a className="dropdown-item py-2" href="#">
                          <i className="bi bi-info-circle me-2 text-primary"></i>{" "}
                          Chi tiết giấy phép
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item py-2" href="#">
                          <i className="bi bi-receipt me-2 text-success"></i>{" "}
                          Xem hóa đơn
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item py-2" href="#">
                          <i className="bi bi-file-earmark-pdf me-2 text-secondary"></i>{" "}
                          Tải chứng chỉ PDF
                        </a>
                      </li>
                      <li>
                        <hr className="dropdown-divider" />
                      </li>
                      <li>
                        <a className="dropdown-item py-2 text-danger" href="#">
                          <i className="bi bi-shield-x me-2"></i> Báo cáo vi
                          phạm
                        </a>
                      </li>
                    </ul>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Phân trang */}
      <div className="card-footer bg-white p-3 d-flex justify-content-between align-items-center border-top">
        <span className="text-muted small">
          Hiển thị 1 - 3 của 342 giấy phép
        </span>
        <nav>
          <ul className="pagination pagination-sm mb-0">
            <li className="page-item disabled">
              <a className="page-link" href="#">
                Trước
              </a>
            </li>
            <li className="page-item active">
              <a
                className="page-link"
                href="#"
                style={{
                  backgroundColor: "var(--accent-color)",
                  borderColor: "var(--accent-color)",
                }}
              >
                1
              </a>
            </li>
            <li className="page-item">
              <a className="page-link text-dark" href="#">
                2
              </a>
            </li>
            <li className="page-item">
              <a className="page-link text-dark" href="#">
                3
              </a>
            </li>
            <li className="page-item">
              <a className="page-link text-dark" href="#">
                Sau
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default LicenseTable;
