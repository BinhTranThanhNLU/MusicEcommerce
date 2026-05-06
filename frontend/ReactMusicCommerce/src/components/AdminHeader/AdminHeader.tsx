import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCurrentUser } from "../../apis/userApi";
import { AuthContext } from "../../context/AuthContext";
import type { UserModel } from "../../models/UserModel";

const AdminHeader = () => {

  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  const [adminUser, setAdminUser] = useState<UserModel | null>(authContext?.user ?? null);

  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        const latestUser = await getCurrentUser();
        setAdminUser(latestUser);
      } catch {
        setAdminUser(authContext?.user ?? null);
      }
    };

    void fetchAdminProfile();
  }, [authContext?.user]);

  const handleLogout = () => {
    authContext?.logoutContext();
    navigate("/login");
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
              placeholder="Tìm kiếm user, bài hát, giao dịch..."
              style={{ width: "300px" }}
            />
          </div>
        </div>
      </div>

      <div className="d-flex align-items-center">
        <button className="btn btn-light position-relative me-3 border-0 rounded-circle" type="button">
          <i className="bi bi-bell fs-5"></i>
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill" style={{ backgroundColor: "#ef4444" }}>
            5
          </span>
        </button>
        
        <div className="dropdown">
          <button 
            type="button" 
            className="btn d-flex align-items-center text-decoration-none dropdown-toggle border-0 p-0" 
            data-bs-toggle="dropdown"
          >
            {/* Kiểm tra xem admin có avatar hay không */}
            {adminUser?.avatarUrl ? (
              <img
                src={adminUser.avatarUrl}
                alt="Admin"
                className="rounded-circle me-2 shadow-sm"
                style={{ width: "40px", height: "40px", objectFit: "cover" }}
              />
            ) : (
              <div className="rounded-circle me-2 d-flex justify-content-center align-items-center text-white shadow-sm" style={{ width: "40px", height: "40px", backgroundColor: "#4f46e5" }}>
                <i className="bi bi-person-workspace fs-5"></i>
              </div>
            )}
            
            <span className="d-none d-md-block text-dark fw-medium">
              {adminUser?.name || "Super Admin"}
            </span>
          </button>
          
          <ul className="dropdown-menu dropdown-menu-end shadow border-0 mt-2">
            <li>
              <Link className="dropdown-item" to="/account?tab=settings">
                Hồ sơ quản trị
              </Link>
            </li>
            <li>
              <Link className="dropdown-item" to="#">
                Nhật ký hoạt động
              </Link>
            </li>
            <li><hr className="dropdown-divider" /></li>
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

export default AdminHeader;