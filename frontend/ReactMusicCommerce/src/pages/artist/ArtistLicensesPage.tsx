
import "../../assets/css/artistDashboard.css";
import LicenseFilter from '../../components/ArtistLicensesComponent/LicenseFilter';
import LicenseStats from '../../components/ArtistLicensesComponent/LicenseStats';
import LicenseTable from '../../components/ArtistLicensesComponent/LicenseTable';


const ArtistLicensesPage = () => {
  return (
    <div className="container-fluid py-4 px-lg-4">
      {/* ================= TIÊU ĐỀ ================= */}
      <div className="d-flex justify-content-between align-items-end mb-4">
        <div>
          <h3 className="fw-bold mb-1" style={{ color: "var(--heading-color)" }}>Quản lý Giấy phép & Bản quyền</h3>
          <p className="text-muted mb-0">Theo dõi các giấy phép đã cấp, quản lý hợp đồng điện tử và phát hiện vi phạm.</p>
        </div>
        <div>
          <button className="btn btn-outline-dark rounded-pill px-4 me-2 shadow-sm">
            <i className="bi bi-download me-2"></i> Xuất dữ liệu
          </button>
        </div>
      </div>

      <LicenseStats />
      <LicenseFilter />
      <LicenseTable />
      
    </div>
  );
};

export default ArtistLicensesPage;