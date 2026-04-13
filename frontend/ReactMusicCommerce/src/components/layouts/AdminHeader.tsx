const AdminHeader = () => {
  return (
    <header className="header bg-white shadow-sm p-3 d-flex justify-content-between align-items-center sticky-top">
      <div className="d-flex align-items-center">
        <button className="btn btn-light me-3 border-0">
          <i className="bi bi-list fs-4"></i>
        </button>
        <div className="search-bar d-none d-md-block">
          <div className="input-group">
            <span className="input-group-text bg-light border-0">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className="form-control bg-light border-0"
              placeholder="Tìm kiếm user, bài hát, giao dịch..."
              style={{ width: "300px" }}
            />
          </div>
        </div>
      </div>

      <div className="d-flex align-items-center">
        <button className="btn btn-light position-relative me-3 border-0 rounded-circle">
          <i className="bi bi-bell fs-5"></i>
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill" style={{ backgroundColor: "#ef4444" }}>
            5
          </span>
        </button>
        <div className="dropdown">
          <a href="#" className="d-flex align-items-center text-decoration-none dropdown-toggle" data-bs-toggle="dropdown">
            <div className="rounded-circle me-2 d-flex justify-content-center align-items-center text-white" style={{ width: "40px", height: "40px", backgroundColor: "#4f46e5" }}>
              <i className="bi bi-person-workspace fs-5"></i>
            </div>
            <span className="d-none d-md-block text-dark fw-medium">
              Super Admin
            </span>
          </a>
          <ul className="dropdown-menu dropdown-menu-end shadow border-0 mt-2">
            <li><a className="dropdown-item" href="#">Hồ sơ quản trị</a></li>
            <li><a className="dropdown-item" href="#">Nhật ký hoạt động</a></li>
            <li><hr className="dropdown-divider" /></li>
            <li><a className="dropdown-item text-danger" href="#">Đăng xuất</a></li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;