import { useContext, useEffect, useRef, useState, type FormEvent } from "react";
import type { GenreModel } from "../../models/GenreModel";
import { getAllGenres } from "../../apis/genreApi";
import { Link, useNavigate } from "react-router-dom";
import { ErrorMessage } from "../utils/ErrorMessage";
import type { MoodModel } from "../../models/MoodModel";
import type { ThemeModel } from "../../models/ThemeModel";
import { getAllMoods } from "../../apis/moodApi";
import { getAllThemes } from "../../apis/themeApi";
import { AuthContext } from "../../context/AuthContext";
import { CART_ITEMS_UPDATED_EVENT } from "../../utils/cartStorage";
import { getCart } from "../../apis/cartApi";
import type { AudioTrackSearchDocument } from "../../models/Search";
import { autocompleteTrackSearch } from "../../apis/audioTrackApi";


const Header = () => {
  const [genres, setGenres] = useState<GenreModel[]>([]);
  const [moods, setMoods] = useState<MoodModel[]>([]);
  const [themes, setThemes] = useState<ThemeModel[]>([]);
  const [httpError, setHttpError] = useState<string | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [suggestions, setSuggestions] = useState<AudioTrackSearchDocument[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearchingSuggestion, setIsSearchingSuggestion] = useState(false);

  const searchBoxRef = useRef<HTMLDivElement | null>(null);

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

  useEffect(() => {
    const syncCartCount = async () => {
      try {
        const cart = await getCart();
        setCartCount(cart.totalItems);
      } catch {
        setCartCount(0);
      }
    };

    void syncCartCount();
    window.addEventListener(CART_ITEMS_UPDATED_EVENT, syncCartCount);

    return () => {
      window.removeEventListener(CART_ITEMS_UPDATED_EVENT, syncCartCount);
    };
  }, []);

  useEffect(() => {
    const currentKeyword = searchKeyword.trim();

    if (currentKeyword.length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = window.setTimeout(async () => {
      try {
        setIsSearchingSuggestion(true);
        const data = await autocompleteTrackSearch(currentKeyword, 6);
        setSuggestions(data);
      } catch {
        setSuggestions([]);
      } finally {
        setIsSearchingSuggestion(false);
      }
    }, 300);

    return () => {
      window.clearTimeout(timer);
    };
  }, [searchKeyword]);

  useEffect(() => {
    const closeSuggestionsOnOutsideClick = (event: MouseEvent) => {
      if (!searchBoxRef.current) {
        return;
      }

      const target = event.target as Node;
      if (!searchBoxRef.current.contains(target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", closeSuggestionsOnOutsideClick);
    return () => {
      document.removeEventListener("mousedown", closeSuggestionsOnOutsideClick);
    };
  }, []);

  const navigateToSmartSearch = (keyword: string) => {
    const q = keyword.trim();
    if (!q) {
      return;
    }

    const searchParams = new URLSearchParams({
      q,
      type: "semantic",
      page: "0",
      size: "12",
    });

    setShowSuggestions(false);
    navigate(`/search?${searchParams.toString()}`);
  };

  const handleHeaderSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    navigateToSmartSearch(searchKeyword);
  };

  // Hàm xử lý khi bấm nút Đăng xuất
  const handleLogout = () => {
    if (logoutContext) {
      logoutContext(); // Xóa token và user khỏi context/localStorage
    }
    navigate("/home");
  };

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
            <form
              className="search-form desktop-search-form"
              onSubmit={handleHeaderSearchSubmit}
            >
              <div className="input-group position-relative" ref={searchBoxRef}>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Tìm kiếm thông minh theo bài hát, nghệ sĩ, mô tả..."
                  value={searchKeyword}
                  onChange={(event) => {
                    setSearchKeyword(event.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => {
                    setShowSuggestions(true);
                  }}
                />
                <button className="btn" type="submit">
                  <i className="bi bi-search"></i>
                </button>

                {showSuggestions && (searchKeyword.trim().length >= 2 || isSearchingSuggestion) && (
                  <div
                    className="position-absolute bg-white border rounded-3 shadow-sm mt-1 w-100"
                    style={{ top: "100%", zIndex: 1060, maxHeight: "320px", overflowY: "auto" }}
                  >
                    {isSearchingSuggestion ? (
                      <div className="px-3 py-2 text-muted small">Đang gợi ý...</div>
                    ) : suggestions.length > 0 ? (
                      suggestions.map((item) => (
                        <button
                          key={`${item.id}-${item.title}`}
                          type="button"
                          className="dropdown-item py-2"
                          onClick={() => {
                            setSearchKeyword(item.title);
                            navigateToSmartSearch(item.title);
                          }}
                        >
                          <div className="fw-semibold text-truncate">{item.title}</div>
                          <div className="small text-muted text-truncate">
                            {item.artistName || "Không rõ nghệ sĩ"}
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="px-3 py-2 text-muted small">Không có gợi ý phù hợp</div>
                    )}
                  </div>
                )}
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
                <span className="badge">{cartCount}</span>
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
                        {/* Mục 1: Dẫn thẳng vào tab quan trọng nhất là Thư viện nhạc */}
                        <Link
                          className="dropdown-item d-flex align-items-center"
                          to="/account"
                        >
                          <i className="bi bi-music-note-list me-2"></i>
                          <span>Thư viện nhạc cá nhân</span>
                        </Link>

                        {/* Mục 2: Dẫn vào lịch sử mua hàng */}
                        <Link
                          className="dropdown-item d-flex align-items-center"
                          to="/account?tab=orders"
                        >
                          <i className="bi bi-receipt me-2"></i>
                          <span>Lịch sử giao dịch</span>
                        </Link>

                        {/* Mục 3: Cài đặt thông tin */}
                        <Link
                          className="dropdown-item d-flex align-items-center"
                          to="/account?tab=settings"
                        >
                          <i className="bi bi-gear me-2"></i>
                          <span>Cài đặt tài khoản</span>
                        </Link>

                        {/* Nếu là nghệ sĩ thì hiện thêm link Kênh nghệ sĩ */}
                        {user.role === "artist" && (
                          <Link
                            className="dropdown-item d-flex align-items-center text-primary"
                            to="/artist/dashboard"
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
