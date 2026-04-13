import "../../assets/css/artistDashboard.css";

const ArtistSidebar = () => {
  return (
    <aside
      className={`sidebar bg-white shadow-sm `}
    >
      <div className="sidebar-header p-3 d-flex align-items-center justify-content-between border-bottom">
        <a
          href="/"
          className="logo d-flex align-items-center text-decoration-none"
        >
          {/* Thay bằng Logo của bạn */}
          <span className="fs-4 fw-bold ms-2 text-dark">
            Music <span className="text-primary">Market</span>
          </span>
        </a>
      </div>

      <ul className="sidebar-menu nav flex-column p-3">
        <li className="nav-item mb-2">
          <a
            href="#"
            className="nav-link active rounded d-flex align-items-center text-dark bg-light fw-medium"
          >
            <i className="bi bi-grid-1x2-fill me-3 fs-5 text-primary"></i> Tổng
            quan
          </a>
        </li>
        <li className="nav-item mb-2">
          <a
            href="#"
            className="nav-link rounded d-flex align-items-center text-secondary"
          >
            <i className="bi bi-music-note-list me-3 fs-5"></i> Kho nhạc của tôi
          </a>
        </li>
        <li className="nav-item mb-2">
          <a
            href="#"
            className="nav-link rounded d-flex align-items-center text-secondary"
          >
            <i className="bi bi-upload me-3 fs-5"></i> Tải nhạc lên
          </a>
        </li>
        <li className="nav-item mb-2">
          <a
            href="#"
            className="nav-link rounded d-flex align-items-center text-secondary"
          >
            <i className="bi bi-file-earmark-text me-3 fs-5"></i> Quản lý giấy
            phép
          </a>
        </li>
        <li className="nav-item mb-2">
          <a
            href="#"
            className="nav-link rounded d-flex align-items-center text-secondary"
          >
            <i className="bi bi-wallet2 me-3 fs-5"></i> Doanh thu & Rút tiền
          </a>
        </li>
        <li className="nav-item mb-4">
          <a
            href="#"
            className="nav-link rounded d-flex align-items-center text-secondary"
          >
            <i className="bi bi-gear me-3 fs-5"></i> Cài đặt cửa hàng
          </a>
        </li>
      </ul>
    </aside>
  );
};

export default ArtistSidebar;
