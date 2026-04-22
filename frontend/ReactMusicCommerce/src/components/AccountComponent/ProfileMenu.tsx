const ProfileMenu = () => {
  return (
    <div className="col-lg-3">
      <div className="profile-menu collapse d-lg-block" id="profileMenu">
        {/* User Info */}
        <div className="user-info" data-aos="fade-right">
          <div className="user-avatar">
            <img
              src="../../assets/img/person/avatar-default.webp"
              alt="Profile"
              loading="lazy"
            />
            <span className="status-badge">
              <i className="bi bi-shield-check"></i>
            </span>
          </div>
          <h4>Trần Thanh Bình</h4>
          <div className="user-status">
            <i className="bi bi-music-note-beamed"></i>
            <span>Người dùng (Thành viên)</span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="menu-nav">
          <ul className="nav flex-column" role="tablist">
            <li className="nav-item">
              <a
                className="nav-link active"
                data-bs-toggle="tab"
                href="#library"
              >
                <i className="bi bi-music-note-list"></i>
                <span>Thư viện nhạc cá nhân</span>
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" data-bs-toggle="tab" href="#orders">
                <i className="bi bi-receipt"></i>
                <span>Lịch sử giao dịch</span>
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" data-bs-toggle="tab" href="#reviews">
                <i className="bi bi-star"></i>
                <span>Đánh giá của tôi</span>
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" data-bs-toggle="tab" href="#settings">
                <i className="bi bi-gear"></i>
                <span>Cài đặt tài khoản</span>
              </a>
            </li>
          </ul>

          <div className="menu-footer">
            <a href="#" className="help-link">
              <i className="bi bi-question-circle"></i>
              <span>Trung tâm trợ giúp</span>
            </a>
            <a href="#" className="logout-link">
              <i className="bi bi-box-arrow-right"></i>
              <span>Thoát</span>
            </a>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default ProfileMenu;
