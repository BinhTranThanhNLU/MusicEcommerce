import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCurrentUser } from "../../apis/userApi";
import { AuthContext } from "../../context/AuthContext";
import type { UserModel } from "../../models/UserModel";

const ArtistHeader = () => {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  const [artistUser, setArtistUser] = useState<UserModel | null>(authContext?.user ?? null);

  useEffect(() => {
    const fetchArtistProfile = async () => {
      try {
        const latestUser = await getCurrentUser();
        setArtistUser(latestUser);
      } catch {
        setArtistUser(authContext?.user ?? null);
      }
    };

    void fetchArtistProfile();
  }, [authContext?.user]);

  const handleLogout = () => {
    authContext?.logoutContext();
    navigate("/home");
  };

  return (
    <header className="header bg-white shadow-sm p-3 d-flex justify-content-between align-items-center sticky-top">
      <div className="d-flex align-items-center">
        <button className="btn btn-light me-3 border-0" type="button" aria-label="Toggle sidebar">
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
        <button className="btn btn-light position-relative me-3 border-0 rounded-circle" type="button">
          <i className="bi bi-bell fs-5"></i>
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
            3
          </span>
        </button>

        <div className="dropdown">
          <button
            type="button"
            className="btn d-flex align-items-center text-decoration-none dropdown-toggle border-0 p-0"
            data-bs-toggle="dropdown"
          >
            {artistUser?.avatarUrl ? (
              <img
                src={artistUser.avatarUrl}
                alt="User"
                className="rounded-circle me-2"
                style={{ width: "40px", height: "40px", objectFit: "cover" }}
              />
            ) : (
              <span
                className="rounded-circle bg-light d-inline-flex justify-content-center align-items-center me-2"
                style={{ width: "40px", height: "40px" }}
              >
                <i className="bi bi-person"></i>
              </span>
            )}
            <span className="d-none d-md-block text-dark fw-medium">
              {artistUser?.name || "Nghệ sĩ"}
            </span>
          </button>
          <ul className="dropdown-menu dropdown-menu-end shadow border-0 mt-2">
            <li>
              <Link className="dropdown-item" to="/account?tab=settings">
                Hồ sơ
              </Link>
            </li>
            <li>
              <Link className="dropdown-item" to="/account?tab=settings">
                Cài đặt
              </Link>
            </li>
            <li>
              <hr className="dropdown-divider" />
            </li>
            <li>
              <button className="dropdown-item text-danger" type="button" onClick={handleLogout}>
                Đăng xuất
              </button>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default ArtistHeader;
