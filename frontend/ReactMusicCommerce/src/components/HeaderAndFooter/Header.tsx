import { useEffect, useState } from "react";
import type { GenreModel } from "../../models/GenreModel";
import { getAllGenres } from "../../apis/genreApi";
import { Link } from "react-router-dom";
import { ErrorMessage } from "../utils/ErrorMessage";
import type { MoodModel } from "../../models/MoodModel";
import type { ThemeModel } from "../../models/ThemeModel";
import { getAllMoods } from "../../apis/moodApi";
import { getAllThemes } from "../../apis/themeApi";

const Header = () => {
  const [genres, setGenres] = useState<GenreModel[]>([]);
  const [moods, setMoods] = useState<MoodModel[]>([]);
  const [themes, setThemes] = useState<ThemeModel[]>([]);
  const [httpError, setHttpError] = useState<string | null>(null);

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

  if (httpError) return <ErrorMessage message={httpError} />;

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
