const Header = () => {
  return (
    <header id="header" className="header sticky-top">
      {/* Main Header */}
      <div className="main-header">
        <div className="container-fluid container-xl">
          <div className="d-flex py-3 align-items-center justify-content-between">
            {/* Logo */}
            <a href="index.html" className="logo d-flex align-items-center">
              <img
                src="/assets/img/music-logo.png"
                alt=""
                style={{ maxHeight: "65px", width: "auto" }}
              />
              <h1 className="sitename">Music Market</h1>
            </a>

            {/* Search */}
            <form className="search-form desktop-search-form">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Tìm kiếm nhạc..."
                />
                <button className="btn" type="submit">
                  <i className="bi bi-search"></i>
                </button>
              </div>
            </form>

            {/* Actions */}
            <div className="header-actions d-flex align-items-center justify-content-end">
              {/* Wishlist */}
              <a
                href="pages/user/account.html"
                className="header-action-btn d-none d-md-block"
              >
                <i className="bi bi-heart"></i>
                <span className="badge">0</span>
              </a>

              {/* Cart */}
              <a href="pages/cart/cart.html" className="header-action-btn">
                <i className="bi bi-cart3"></i>
                <span className="badge">3</span>
              </a>
              {/* Account */}
              <div className="dropdown account-dropdown">
                <button className="header-action-btn" data-bs-toggle="dropdown">
                  <i className="bi bi-person"></i>
                </button>
                <div className="dropdown-menu">
                  <div className="dropdown-header">
                    <h6>
                      Chào mừng{" "}
                      <span className="sitename">
                        đến với Cửa hàng SportShoe
                      </span>
                    </h6>
                    <p className="mb-0">Quản lý tài khoản &amp; đơn hàng</p>
                  </div>
                  <div className="dropdown-body">
                    <a
                      className="dropdown-item d-flex align-items-center"
                      href="pages/user/account.html"
                    >
                      <i className="bi bi-person-circle me-2"></i>
                      <span>Hồ sơ của tôi</span>
                    </a>
                    <a
                      className="dropdown-item d-flex align-items-center"
                      href="pages/user/account.html"
                    >
                      <i className="bi bi-bag-check me-2"></i>
                      <span>Đơn hàng của tôi</span>
                    </a>
                    <a
                      className="dropdown-item d-flex align-items-center"
                      href="pages/user/account.html"
                    >
                      <i className="bi bi-heart me-2"></i>
                      <span>Danh sách mong muốn của tôi</span>
                    </a>
                    <a
                      className="dropdown-item d-flex align-items-center"
                      href="pages/user/account.html"
                    >
                      <i className="bi bi-gear me-2"></i>
                      <span>Cài đặt</span>
                    </a>
                  </div>
                  <div className="dropdown-footer">
                    <a
                      href="pages/auth/register.html"
                      className="btn btn-primary w-100 mb-2"
                    >
                      Đăng nhập
                    </a>
                    <a
                      href="pages/auth/register.html"
                      className="btn btn-outline-primary w-100"
                    >
                      Đăng ký
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="header-nav">
        <div className="container-fluid container-xl position-relative">
          <nav id="navmenu" className="navmenu">
            <ul>
              {/* 1. TRANG CHỦ */}
              <li>
                <a href="/" className="active">
                  Trang chủ
                </a>
              </li>

              {/* 2. THỂ LOẠI (Menu chính - Mở rộng nhiều loại nhạc) */}
              <li className="dropdown">
                <a href="/genres">
                  <span>Thể loại</span>{" "}
                  <i className="bi bi-chevron-down toggle-dropdown"></i>
                </a>
                <ul>
                  {/* Nhóm Nhạc Việt */}
                  <li className="dropdown">
                    <a href="#">
                      <span>Nhạc Việt Nam</span>{" "}
                      <i className="bi bi-chevron-right"></i>
                    </a>
                    <ul>
                      <li>
                        <a href="/genre/v-pop">V-Pop / Nhạc Trẻ</a>
                      </li>
                      <li>
                        <a href="/genre/bolero">Bolero / Trữ Tình</a>
                      </li>
                      <li>
                        <a href="/genre/rap-viet">Rap Việt / Hip-hop</a>
                      </li>
                      <li>
                        <a href="/genre/indie-viet">Indie / Underground</a>
                      </li>
                      <li>
                        <a href="/genre/remix-viet">Vinahouse / Remix</a>
                      </li>
                    </ul>
                  </li>

                  {/* Nhóm Quốc Tế */}
                  <li className="dropdown">
                    <a href="#">
                      <span>Nhạc Quốc Tế</span>{" "}
                      <i className="bi bi-chevron-right"></i>
                    </a>
                    <ul>
                      <li>
                        <a href="/genre/us-uk">US-UK (Pop/R&B)</a>
                      </li>
                      <li>
                        <a href="/genre/k-pop">K-Pop</a>
                      </li>
                      <li>
                        <a href="/genre/c-pop">C-Pop (Nhạc Hoa)</a>
                      </li>
                      <li>
                        <a href="/genre/latin">Latin</a>
                      </li>
                    </ul>
                  </li>

                  {/* Nhóm Sôi Động / Hiện đại */}
                  <li>
                    <a href="/genre/edm">EDM / Electronic</a>
                  </li>
                  <li>
                    <a href="/genre/rock">Rock / Alternative</a>
                  </li>

                  {/* Nhóm Thư giãn / Tập trung - Phù hợp với tính năng tìm theo ngữ nghĩa/tâm trạng trong tiểu luận */}
                  <li>
                    <a href="/genre/lofi">Lo-fi / Study</a>
                  </li>
                  <li>
                    <a href="/genre/acoustic">Acoustic / Guitar</a>
                  </li>
                  <li>
                    <a href="/genre/jazz">Jazz / Blues</a>
                  </li>
                  <li>
                    <a href="/genre/classical">Cổ điển / Không lời</a>
                  </li>
                </ul>
              </li>

              {/* 3. KHÁM PHÁ (Bảng xếp hạng & Mới) */}
              <li className="dropdown">
                <a href="/discover">
                  <span>Khám phá</span>{" "}
                  <i className="bi bi-chevron-down toggle-dropdown"></i>
                </a>
                <ul>
                  <li>
                    <a href="/chart/trending">Bảng xếp hạng (Trending)</a>
                  </li>
                  <li>
                    <a href="/chart/new-release">Mới phát hành</a>
                  </li>
                  <li>
                    <a href="/chart/top-paid">Top bài hát bán chạy</a>
                  </li>
                  {/* Mục tìm kiếm theo tâm trạng/ngữ nghĩa như tiểu luận yêu cầu */}
                  <li>
                    <a href="/mood">Gợi ý theo tâm trạng</a>
                  </li>
                </ul>
              </li>

              {/* 4. BẢN QUYỀN (Dịch vụ) - Quan trọng với đề tài */}
              <li className="dropdown">
                <a href="/license">
                  <span>Bản quyền & Giá</span>{" "}
                  <i className="bi bi-chevron-down toggle-dropdown"></i>
                </a>
                <ul>
                  <li>
                    <a href="/license/personal">Gói Cá nhân (Nghe/Tải)</a>
                  </li>
                  <li>
                    <a href="/license/commercial">
                      Gói Thương mại (Content Creator)
                    </a>
                  </li>
                  <li>
                    <a href="/license/enterprise">Gói Doanh nghiệp</a>
                  </li>
                </ul>
              </li>

              {/* 5. DÀNH CHO NGHỆ SĨ */}
              <li>
                <a href="/artist-portal">Kênh Nghệ sĩ</a>
              </li>

              {/* 6. TIN TỨC & LIÊN HỆ */}
              <li>
                <a href="/news">Tin tức</a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
