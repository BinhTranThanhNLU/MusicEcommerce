import React, { useState, useEffect } from "react";
import "../../assets/css/artistDashboard.css";
import LicenseStats from "../../components/ArtistLicensesComponent/LicenseStats";
import LicenseFilter from "../../components/ArtistLicensesComponent/LicenseFilter";
import LicenseTable from "../../components/ArtistLicensesComponent/LicenseTable";
import { getMyLicenses, getMyLicenseStats } from "../../apis/artistApi";
import type { ArtistLicenseStatsModel } from "../../models/ArtistLicenseStatsModel";
import type { ArtistLicensePageResponse } from "../../responsemodel/ArtistLicensePageResponse";

const ArtistLicensesPage = () => {

  const [stats, setStats] = useState<ArtistLicenseStatsModel | null>(null);
  const [pageData, setPageData] = useState<ArtistLicensePageResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [filters, setFilters] = useState({
    page: 0,
    size: 10,
    search: "",
    licenseType: "all",
    status: "all",
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getMyLicenseStats();
        setStats(data);
      } catch (error) {
        console.error("Lỗi khi tải thống kê:", error);
      }
    };
    fetchStats();
  }, []);

  useEffect(() => {
    const fetchLicenses = async () => {
      setIsLoading(true);
      try {
        const data = await getMyLicenses(
          filters.page,
          filters.size,
          filters.search,
          filters.licenseType,
          filters.status
        );
        setPageData(data);
      } catch (error) {
        console.error("Lỗi khi tải danh sách giấy phép:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLicenses();
  }, [filters]);

  const handleFilterChange = (key: string, value: string | number) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      ...(key !== "page" && { page: 0 }), // Nếu đổi filter thì quay về trang 1
    }));
  };

  return (
    <div className="container-fluid py-4 px-lg-4">
      {/* ================= TIÊU ĐỀ ================= */}
      <div className="d-flex justify-content-between align-items-end mb-4">
        <div>
          <h3 className="fw-bold mb-1" style={{ color: "var(--heading-color)" }}>
            Quản lý Giấy phép & Bản quyền
          </h3>
          <p className="text-muted mb-0">
            Theo dõi các giấy phép đã cấp, quản lý hợp đồng điện tử và phát hiện vi phạm.
          </p>
        </div>
        <div>
          <button className="btn btn-outline-dark rounded-pill px-4 me-2 shadow-sm">
            <i className="bi bi-download me-2"></i> Xuất dữ liệu
          </button>
        </div>
      </div>

      <LicenseStats stats={stats} />
      <LicenseFilter filters={filters} onFilterChange={handleFilterChange} />
      <LicenseTable 
        pageData={pageData} 
        isLoading={isLoading} 
        onPageChange={(newPage) => handleFilterChange("page", newPage)} 
      />
    </div>
  );
};

export default ArtistLicensesPage;