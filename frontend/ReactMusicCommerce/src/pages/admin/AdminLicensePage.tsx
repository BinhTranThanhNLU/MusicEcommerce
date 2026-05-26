import { useEffect, useState } from "react";
import AdminLicenseFilter from "../../components/AdminLicenseComponent/AdminLicenseFilter";
import AdminLicenseTable from "../../components/AdminLicenseComponent/AdminLicenseTable";
import AdminLicenseDetailModal from "../../components/AdminLicenseComponent/AdminLicenseDetailModal";
import { getAdminLicenseDetail, getAdminLicenses, revokeAdminLicense } from "../../apis/adminApi";
import type { AdminLicenseModel } from "../../models/AdminLicenseModel";
import type { AdminLicensePageResponse } from "../../responsemodel/AdminLicensePageResponse";

const PAGE_SIZE = 10;

const AdminLicensePage = () => {
  const [pageData, setPageData] = useState<AdminLicensePageResponse | null>(null);
  const [licenses, setLicenses] = useState<AdminLicenseModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedLicense, setSelectedLicense] = useState<AdminLicenseModel | null>(null);
  const [selectedLicenseLoading, setSelectedLicenseLoading] = useState(false);
  const [confirmRevokeId, setConfirmRevokeId] = useState<number | null>(null);
  const [filters, setFilters] = useState({
    page: 0,
    size: PAGE_SIZE,
    search: "",
    licenseType: "all",
    status: "all",
  });

  const fetchLicenses = async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const data = await getAdminLicenses(
        filters.page,
        filters.size,
        filters.search,
        filters.licenseType,
        filters.status,
      );

      setPageData(data);
      setLicenses(data.licenses ?? []);
    } catch (error) {
      console.error("Lỗi khi tải danh sách giấy phép:", error);
      setErrorMessage("Không thể tải danh sách giấy phép lúc này. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchLicenses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const handleFilterChange = (key: string, value: string | number) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      ...(key !== "page" && { page: 0 }),
    }));
  };

  const handleViewLicense = async (orderDetailId: number) => {
    setSelectedLicenseLoading(true);
    setErrorMessage("");

    try {
      const data = await getAdminLicenseDetail(orderDetailId);
      setSelectedLicense(data);
    } catch (error) {
      console.error("Lỗi khi tải chi tiết giấy phép:", error);
      setErrorMessage("Không thể tải chi tiết giấy phép lúc này. Vui lòng thử lại sau.");
    } finally {
      setSelectedLicenseLoading(false);
    }
  };

  const handleRevokeLicense = async (orderDetailId: number) => {
    const confirmed = window.confirm("Bạn có chắc muốn thu hồi giấy phép này không?");
    if (!confirmed) {
      return;
    }

    setErrorMessage("");

    try {
      await revokeAdminLicense(orderDetailId);
      if (selectedLicense?.orderDetailId === orderDetailId) {
        const refreshed = await getAdminLicenseDetail(orderDetailId);
        setSelectedLicense(refreshed);
      }
      await fetchLicenses();
    } catch (error) {
      console.error("Lỗi khi thu hồi giấy phép:", error);
      setErrorMessage("Không thể thu hồi giấy phép lúc này. Vui lòng thử lại sau.");
    } finally {
      setConfirmRevokeId(null);
    }
  };

  const totalItems = pageData?.totalItems ?? 0;
  const totalPages = pageData?.totalPages ?? 0;
  const currentPage = pageData?.currentPage ?? filters.page;

  return (
    <div className="container-fluid py-4 px-lg-4">
      <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-end gap-3 mb-4">
        <div>
          <h3 className="fw-bold mb-1" style={{ color: "#0f172a" }}>
            Quản lý giấy phép
          </h3>
          <p className="text-muted mb-0">
            Theo dõi, lọc và thu hồi giấy phép đã phát hành trong hệ thống.
          </p>
        </div>
        <div className="d-flex align-items-center gap-2">
          <button
            type="button"
            className="btn btn-outline-secondary rounded-pill px-3"
            onClick={() => void fetchLicenses()}
          >
            <i className="bi bi-arrow-clockwise me-2"></i>
            Làm mới
          </button>
        </div>
      </div>

      <AdminLicenseFilter
        filters={filters}
        onFilterChange={handleFilterChange}
        onRefresh={() => void fetchLicenses()}
      />

      {errorMessage && (
        <div className="alert alert-danger rounded-4 mb-4" role="alert">
          {errorMessage}
        </div>
      )}

      <AdminLicenseTable
        licenses={licenses}
        loading={loading}
        page={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        pageSize={filters.size}
        onView={handleViewLicense}
        onRevoke={(orderDetailId) => setConfirmRevokeId(orderDetailId)}
        onPageChange={(newPage) => {
          if (typeof newPage === "function") {
            setFilters((prev) => ({ ...prev, page: newPage(prev.page) }));
            return;
          }

          handleFilterChange("page", newPage);
        }}
      />

      <AdminLicenseDetailModal
        license={selectedLicense}
          loading={selectedLicenseLoading}
        onClose={() => setSelectedLicense(null)}
        onRevoke={(orderDetailId) => void handleRevokeLicense(orderDetailId)}
      />

      {confirmRevokeId !== null && (
        <div className="modal d-block" tabIndex={-1} role="dialog" style={{ backgroundColor: "rgba(15, 23, 42, 0.55)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow rounded-4">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold">Xác nhận thu hồi</h5>
                <button type="button" className="btn-close" onClick={() => setConfirmRevokeId(null)} />
              </div>
              <div className="modal-body text-muted">
                Giấy phép #{confirmRevokeId} sẽ được chuyển sang trạng thái thu hồi.
              </div>
              <div className="modal-footer border-0 pt-0">
                <button type="button" className="btn btn-light" onClick={() => setConfirmRevokeId(null)}>
                  Hủy
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => void handleRevokeLicense(confirmRevokeId)}
                >
                  Thu hồi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLicensePage;

