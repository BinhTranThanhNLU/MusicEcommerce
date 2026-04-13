const ArtistHeader = () => {
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
              placeholder="Tìm kiếm bài hát, đơn hàng..."
            />
          </div>
        </div>
      </div>

      <div className="d-flex align-items-center">
        <button className="btn btn-light position-relative me-3 border-0 rounded-circle">
          <i className="bi bi-bell fs-5"></i>
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
            3
          </span>
        </button>
        <div className="dropdown">
          <a
            href="#"
            className="d-flex align-items-center text-decoration-none dropdown-toggle"
            data-bs-toggle="dropdown"
          >
            <img
              src="../../assets/img/artist-avatar.png"
              alt="User"
              className="rounded-circle me-2"
              style={{ width: "40px", height: "40px", objectFit: "cover" }}
            />
            <span className="d-none d-md-block text-dark fw-medium">
              Sơn Tùng M-TP
            </span>
          </a>
          <ul className="dropdown-menu dropdown-menu-end shadow border-0 mt-2">
            <li>
              <a className="dropdown-item" href="#">
                Hồ sơ
              </a>
            </li>
            <li>
              <a className="dropdown-item" href="#">
                Cài đặt
              </a>
            </li>
            <li>
              <hr className="dropdown-divider" />
            </li>
            <li>
              <a className="dropdown-item text-danger" href="#">
                Đăng xuất
              </a>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default ArtistHeader;
