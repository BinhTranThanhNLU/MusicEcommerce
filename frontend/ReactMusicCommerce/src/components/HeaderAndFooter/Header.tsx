import { useContext, useEffect, useState } from "react";
import type { GenreModel } from "../../models/GenreModel";
import { getAllGenres } from "../../apis/genreApi";
import { Link, useNavigate } from "react-router-dom";
import { ErrorMessage } from "../utils/ErrorMessage";
import type { MoodModel } from "../../models/MoodModel";
import type { ThemeModel } from "../../models/ThemeModel";
import { getAllMoods } from "../../apis/moodApi";
import { getAllThemes } from "../../apis/themeApi";
import { AuthContext } from "../../context/AuthContext";

const Header = () => {
  const [genres, setGenres] = useState<GenreModel[]>([]);
  const [moods, setMoods] = useState<MoodModel[]>([]);
  const [themes, setThemes] = useState<ThemeModel[]>([]);
  const [httpError, setHttpError] = useState<string | null>(null);

  const authContext = useContext(AuthContext);
  const user = authContext?.user;
  const logoutContext = authContext?.logoutContext;

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [genresData, moodsData, themesData] = await Promise.all([
          getAllGenres(),
          getAllMoods(),
          getAllThemes(),
        ]);

        setGenres(genresData);
        setMoods(moodsData);
        setThemes(themesData);
      } catch (error: any) {
        setHttpError(error.message || "Error fetching");
      }
    };

    fetchData();
  }, []);

  // Hàm xử lý khi bấm nút Đăng xuất
  const handleLogout = () => {
    if (logoutContext) {
      logoutContext(); // Xóa token và user khỏi context/localStorage
    }
    navigate("/home");
  };

  if (httpError) return <ErrorMessage message={httpError} />;

  if (httpError) return <ErrorMessage message={httpError} />;

  return (
    <header id="header" className="header sticky-top">
      {/* Main Header */}
      <div className="main-header">
        <div className="container-fluid container-xl">
          <div className="d-flex py-3 align-items-center justify-content-between">
            {/* Logo */}
            <Link to="/" className="logo d-flex align-items-center">
              <img
                src="/assets/img/music-logo.png"
                alt="Music Market Logo"
                style={{ maxHeight: "65px", width: "auto" }}
              />
              <h1 className="sitename">Music Market</h1>
            </Link>

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
              <Link
                to="/account/wishlist"
                className="header-action-btn d-none d-md-block"
              >
                <i className="bi bi-heart"></i>
                <span className="badge">0</span>
              </Link>

              {/* Cart */}
              <Link to="/cart" className="header-action-btn">
                <i className="bi bi-cart3"></i>
                <span className="badge">3</span>
              </Link>

              {/* Account */}
              <div className="dropdown account-dropdown">
                <button className="header-action-btn" data-bs-toggle="dropdown">
                  {/* Nếu user có avatar thì hiện avatar, không thì hiện icon mặc định */}
                  {user && user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt="avatar"
                      style={{
                        width: "28px",
                        height: "28px",
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <i className="bi bi-person"></i>
                  )}
                </button>
                <div className="dropdown-menu dropdown-menu-end">
                  {user ? (
                    /* ----- TRẠNG THÁI ĐÃ ĐĂNG NHẬP ----- */
                    <>
                      <div className="dropdown-header">
                        <h6>
                          Xin chào,{" "}
                          <span className="sitename">{user.name}</span>
                        </h6>
                        <p
                          className="mb-0 text-muted"
                          style={{ fontSize: "0.85rem" }}
                        >
                          {user.email}
                        </p>
                      </div>
                      <div className="dropdown-body">
                        <Link
                          className="dropdown-item d-flex align-items-center"
                          to="/account/profile"
                        >
                          <i className="bi bi-person-circle me-2"></i>
                          <span>Hồ sơ của tôi</span>
                        </Link>
                        <Link
                          className="dropdown-item d-flex align-items-center"
                          to="/account/orders"
                        >
                          <i className="bi bi-bag-check me-2"></i>
                          <span>Đơn hàng & Nhạc đã mua</span>
                        </Link>

                        {/* Nếu là nghệ sĩ thì hiện thêm link Kênh nghệ sĩ */}
                        {user.role === "artist" && (
                          <Link
                            className="dropdown-item d-flex align-items-center text-primary"
                            to="/artist-portal"
                          >
                            <i className="bi bi-mic me-2"></i>
                            <span>Quản lý Kênh Nghệ Sĩ</span>
                          </Link>
                        )}
                      </div>
                      <div className="dropdown-footer">
                        <button
                          onClick={handleLogout}
                          className="btn btn-outline-danger w-100"
                        >
                          Đăng xuất
                        </button>
                      </div>
                    </>
                  ) : (
                    /* ----- TRẠNG THÁI CHƯA ĐĂNG NHẬP ----- */
                    <>
                      <div className="dropdown-header">
                        <h6>
                          Chào mừng đến với{" "}
                          <span className="sitename">Music Market</span>
                        </h6>
                        <p className="mb-0">
                          Đăng nhập để trải nghiệm mua nhạc bản quyền
                        </p>
                      </div>
                      <div className="dropdown-footer">
                        <Link
                          to="/login"
                          className="btn btn-primary w-100 mb-2"
                        >
                          Đăng nhập
                        </Link>
                        <Link
                          to="/register"
                          className="btn btn-outline-primary w-100"
                        >
                          Đăng ký
                        </Link>
                      </div>
                    </>
                  )}
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

              {/* 2.1. THỂ LOẠI */}
              <li className="dropdown">
                <a href="/genres">
                  <span>Thể loại</span>
                  <i className="bi bi-chevron-down toggle-dropdown"></i>
                </a>

                <ul>
                  {genres.map((genre) => (
                    <li key={genre.id}>
                      <Link to={`/genre/${genre.id}`}>{genre.name}</Link>
                    </li>
                  ))}
                </ul>
              </li>

              {/* 2.2. Mood */}
              <li className="dropdown">
                <a href="/genres">
                  <span>Cảm xúc</span>
                  <i className="bi bi-chevron-down toggle-dropdown"></i>
                </a>

                <ul>
                  {moods.map((mood) => (
                    <li key={mood.id}>
                      <Link to={`/mood/${mood.id}`}>{mood.name}</Link>
                    </li>
                  ))}
                </ul>
              </li>

              {/* 2.3. Theme */}
              <li className="dropdown">
                <a href="/genres">
                  <span>Chủ đề</span>
                  <i className="bi bi-chevron-down toggle-dropdown"></i>
                </a>

                <ul>
                  {themes.map((theme) => (
                    <li key={theme.id}>
                      <Link to={`/theme/${theme.id}`}>{theme.name}</Link>
                    </li>
                  ))}
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

              {/* 4. BẢN QUYỀN (Dịch vụ) */}
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
