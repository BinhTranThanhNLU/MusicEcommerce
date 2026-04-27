const AdminSidebar = () => {
  return (
    <aside
      className="sidebar shadow-sm"
      style={{ backgroundColor: "#1e293b", minHeight: "100vh", width: "260px" }}
    >
      <div className="sidebar-header p-3 d-flex align-items-center justify-content-between border-bottom" style={{ borderColor: "#334155" }}>
        <a href="/admin" className="logo d-flex align-items-center text-decoration-none">
          <div className="bg-white text-dark rounded d-flex justify-content-center align-items-center fw-bold" style={{ width: "35px", height: "35px" }}>
            A
          </div>
          <span className="fs-5 fw-bold ms-2 text-white">
            Music <span style={{ color: "#818cf8" }}>Admin</span>
          </span>
        </a>
      </div>

      <ul className="sidebar-menu nav flex-column p-3 gap-1">
        <li className="nav-item mb-1">
          <a href="#" className="nav-link rounded d-flex align-items-center fw-medium" style={{ backgroundColor: "#334155", color: "#f8fafc", borderLeft: "4px solid #818cf8" }}>
            <i className="bi bi-speedometer2 me-3 fs-5" style={{ color: "#818cf8" }}></i> Tổng quan
          </a>
        </li>
        <li className="nav-item mb-1">
          <a href="#" className="nav-link rounded d-flex align-items-center text-light opacity-75 hover-opacity-100">
            <i className="bi bi-music-note-list me-3 fs-5"></i> Kiểm duyệt bài hát
          </a>
        </li>
        <li className="nav-item mb-1">
          <a href="#" className="nav-link rounded d-flex align-items-center text-light opacity-75 hover-opacity-100">
            <i className="bi bi-people me-3 fs-5"></i> Quản lý Người dùng
          </a>
        </li>
        <li className="nav-item mb-1">
          <a href="#" className="nav-link rounded d-flex align-items-center text-light opacity-75 hover-opacity-100">
            <i className="bi bi-person-badge me-3 fs-5"></i> Quản lý Nghệ sĩ
          </a>
        </li>
        <li className="nav-item mb-1">
          <a href="#" className="nav-link rounded d-flex align-items-center text-light opacity-75 hover-opacity-100">
            <i className="bi bi-shield-check me-3 fs-5"></i> Quản lý Bản quyền
          </a>
        </li>
        <li className="nav-item mt-4 pt-4 border-top" style={{ borderColor: "#334155" }}>
          <a href="#" className="nav-link rounded d-flex align-items-center text-light opacity-75 hover-opacity-100">
            <i className="bi bi-gear me-3 fs-5"></i> Cài đặt hệ thống
          </a>
        </li>
      </ul>
    </aside>
  );
};

export default AdminSidebar;