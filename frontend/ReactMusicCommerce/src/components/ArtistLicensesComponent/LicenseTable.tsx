import React, { useState } from "react";
import type { ArtistLicensePageResponse } from "../../responsemodel/ArtistLicensePageResponse";
import { downloadCertificateForArtist } from "../../apis/artistApi";

interface Props {
  pageData: ArtistLicensePageResponse | null;
  isLoading: boolean;
  onPageChange: (newPage: number) => void;
}

const formatVND = (price: number) => {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN");
};

const LicenseTable: React.FC<Props> = ({ pageData, isLoading, onPageChange }) => {
  const [isDownloading, setIsDownloading] = useState<number | null>(null);

  const handleDownloadPDF = async (orderDetailId: number) => {
    try {
      setIsDownloading(orderDetailId);
      await downloadCertificateForArtist(orderDetailId);
    } catch (error) {
      alert("Không thể tải chứng chỉ lúc này. Vui lòng thử lại sau.");
    } finally {
      setIsDownloading(null);
    }
  };

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
            {isLoading ? (
              <tr>
                <td colSpan={8} className="text-center py-5 text-muted">
                  <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : pageData?.licenses.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-5 text-muted">
                  Không tìm thấy giấy phép nào phù hợp.
                </td>
              </tr>
            ) : (
              pageData?.licenses.map((license) => (
                <tr key={license.orderDetailId}>
                  <td className="ps-4 py-3">
                    <div className="fw-bold text-dark mb-1">
                      {license.watermarkId !== "Không áp dụng" ? license.watermarkId.replace("WMK", "LIC") : `LIC-00${license.orderDetailId}`}
                    </div>
                    <div className="small text-muted">
                      <i className="bi bi-person-fill me-1"></i> {license.customerName}
                    </div>
                  </td>
                  <td>
                    <div className="d-flex align-items-center">
                      <img
                        src={license.coverImage || "https://placehold.co/40x40"}
                        alt="Cover"
                        className="rounded-2 me-2"
                        style={{ width: "40px", height: "40px", objectFit: "cover" }}
                      />
                      <span className="fw-medium text-dark">{license.trackName}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`badge rounded-pill px-3 py-1 ${
                        license.licenseType.includes("Commercial") ? "bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25" 
                        : license.licenseType.includes("Extended") ? "bg-warning bg-opacity-10 text-warning border border-warning border-opacity-50"
                        : "bg-info bg-opacity-10 text-info border border-info border-opacity-25"
                      }`}
                    >
                      {license.licenseType}
                    </span>
                  </td>
                  <td>
                    {license.watermarkId === "Không áp dụng" ? (
                      <span className="text-muted small fst-italic">Không áp dụng</span>
                    ) : (
                      <code className="text-secondary bg-light px-2 py-1 rounded">{license.watermarkId}</code>
                    )}
                  </td>
                  <td>
                    <div className="small text-dark mb-1">Cấp: {formatDate(license.issuedAt)}</div>
                    <div className="small text-muted">
                      Hết: {license.expiredAt ? formatDate(license.expiredAt) : "Vĩnh viễn"}
                    </div>
                  </td>
                  <td>
                    <span className="fw-semibold text-success">{formatVND(license.price)}</span>
                  </td>
                  <td className="text-center">
                    {license.licenseStatus === "ACTIVE" ? (
                      <span className="text-success small fw-bold"><i className="bi bi-shield-check me-1"></i> Hợp lệ</span>
                    ) : license.licenseStatus === "EXPIRED" ? (
                      <span className="text-secondary small fw-bold"><i className="bi bi-clock-history me-1"></i> Hết hạn</span>
                    ) : (
                      <span className="text-danger small fw-bold"><i className="bi bi-x-circle me-1"></i> Đã thu hồi</span>
                    )}
                  </td>
                  <td className="pe-4 text-end">
                    <div className="dropdown">
                      <button className="btn btn-sm btn-light text-secondary rounded-circle" type="button" data-bs-toggle="dropdown">
                        <i className="bi bi-three-dots-vertical"></i>
                      </button>
                      <ul className="dropdown-menu dropdown-menu-end shadow border-0">
                        <li>
                          <button 
                            className="dropdown-item py-2" 
                            onClick={() => handleDownloadPDF(license.orderDetailId)}
                            disabled={isDownloading === license.orderDetailId}
                          >
                            {isDownloading === license.orderDetailId ? (
                              <><span className="spinner-border spinner-border-sm me-2 text-secondary"></span> Đang tải...</>
                            ) : (
                              <><i className="bi bi-file-earmark-pdf me-2 text-secondary"></i> Tải chứng chỉ PDF</>
                            )}
                          </button>
                        </li>
                        <li><hr className="dropdown-divider" /></li>
                        <li>
                          <a className="dropdown-item py-2 text-danger" href="#">
                            <i className="bi bi-shield-x me-2"></i> Báo cáo vi phạm
                          </a>
                        </li>
                      </ul>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Phân trang */}
      <div className="card-footer bg-white p-3 d-flex justify-content-between align-items-center border-top">
        <span className="text-muted small">
          Hiển thị {pageData?.totalElements === 0 ? 0 : (pageData?.currentPage || 0) * 10 + 1} -{" "}
          {Math.min(((pageData?.currentPage || 0) + 1) * 10, pageData?.totalElements || 0)} của {pageData?.totalElements || 0} giấy phép
        </span>
        
        {pageData && pageData.totalPages > 1 && (
          <nav>
            <ul className="pagination pagination-sm mb-0">
              <li className={`page-item ${pageData.currentPage === 0 ? "disabled" : ""}`}>
                <button className="page-link" onClick={() => onPageChange(pageData.currentPage - 1)}>
                  Trước
                </button>
              </li>
              
              {[...Array(pageData.totalPages)].map((_, i) => (
                <li key={i} className={`page-item ${pageData.currentPage === i ? "active" : ""}`}>
                  <button 
                    className={`page-link ${pageData.currentPage !== i ? "text-dark" : ""}`}
                    style={pageData.currentPage === i ? { backgroundColor: "var(--accent-color)", borderColor: "var(--accent-color)" } : {}}
                    onClick={() => onPageChange(i)}
                  >
                    {i + 1}
                  </button>
                </li>
              ))}

              <li className={`page-item ${pageData.currentPage === pageData.totalPages - 1 ? "disabled" : ""}`}>
                <button className="page-link text-dark" onClick={() => onPageChange(pageData.currentPage + 1)}>
                  Sau
                </button>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </div>
  );
};

export default LicenseTable;