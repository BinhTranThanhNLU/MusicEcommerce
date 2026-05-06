import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getAdminUserDetail,
  getAdminUserOrders,
  getAdminUserTracks,
  toggleUserStatus,
} from "../../apis/adminApi";
import type { AdminUserDetailModel } from "../../models/AdminUserDetailModel";
import type { AccountOrderResponse } from "../../responsemodel/AccountOrderResponse";
import type { AudioTrackModel } from "../../models/AudioTrackModel";
import { parseApiError } from "../../utils/apiError";

type DetailTab = "overview" | "security" | "orders" | "tracks";

const formatDateTime = (iso?: string | null): string => {
  if (!iso) {
    return "-";
  }

  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleString("vi-VN");
};

const getRoleMeta = (role: string) => {
  if (role === "artist") {
    return {
      className: "bg-primary bg-opacity-10 text-primary border border-primary",
      iconClass: "bi bi-music-note-list",
      label: "Nghệ sĩ",
    };
  }

  if (role === "admin") {
    return {
      className: "bg-dark text-white",
      iconClass: "bi bi-shield-lock",
      label: "Quản trị viên",
    };
  }

  return {
    className: "bg-light text-dark border",
    iconClass: "bi bi-person",
    label: "Người nghe",
  };
};

const AdminUserDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [user, setUser] = useState<AdminUserDetailModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<DetailTab>("overview");

  const [orders, setOrders] = useState<AccountOrderResponse[]>([]);
  const [ordersPage, setOrdersPage] = useState(0);
  const [ordersTotalPages, setOrdersTotalPages] = useState(0);
  const [ordersTotalItems, setOrdersTotalItems] = useState(0);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState<string | null>(null);

  const [tracks, setTracks] = useState<AudioTrackModel[]>([]);
  const [tracksPage, setTracksPage] = useState(0);
  const [tracksTotalPages, setTracksTotalPages] = useState(0);
  const [tracksTotalItems, setTracksTotalItems] = useState(0);
  const [tracksLoading, setTracksLoading] = useState(false);
  const [tracksError, setTracksError] = useState<string | null>(null);

  const userId = useMemo(() => {
    if (!id) {
      return null;
    }

    const parsed = Number(id);
    if (!Number.isInteger(parsed) || parsed <= 0) {
      return null;
    }

    return parsed;
  }, [id]);

  const fetchUserDetail = useCallback(async () => {
    if (!userId) {
      setErrorMessage("ID người dùng không hợp lệ.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    try {
      const detail = await getAdminUserDetail(userId);
      setUser(detail);
    } catch (error) {
      setErrorMessage(parseApiError(error, "Không thể tải chi tiết người dùng.").message);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchUserDetail();
  }, [fetchUserDetail]);

  useEffect(() => {
    if (!userId || activeTab !== "orders") {
      return;
    }

    let isMounted = true;

    const loadOrders = async () => {
      setOrdersLoading(true);
      setOrdersError(null);

      try {
        const response = await getAdminUserOrders(userId, ordersPage, 10);
        if (!isMounted) {
          return;
        }
        setOrders(response.orders ?? []);
        setOrdersTotalItems(response.totalItems ?? 0);
        setOrdersTotalPages(response.totalPages ?? 0);
      } catch (error) {
        if (!isMounted) {
          return;
        }
        setOrders([]);
        setOrdersError(parseApiError(error, "Không thể tải lịch sử đơn hàng.").message);
      } finally {
        if (isMounted) {
          setOrdersLoading(false);
        }
      }
    };

    loadOrders();

    return () => {
      isMounted = false;
    };
  }, [activeTab, userId, ordersPage]);

  useEffect(() => {
    if (!userId || activeTab !== "tracks") {
      return;
    }

    let isMounted = true;

    const loadTracks = async () => {
      setTracksLoading(true);
      setTracksError(null);

      try {
        const response = await getAdminUserTracks(userId, tracksPage, 10);
        if (!isMounted) {
          return;
        }
        setTracks(response.tracks ?? []);
        setTracksTotalItems(response.totalItems ?? 0);
        setTracksTotalPages(response.totalPages ?? 0);
      } catch (error) {
        if (!isMounted) {
          return;
        }
        setTracks([]);
        setTracksError(parseApiError(error, "Không thể tải danh sách tác phẩm.").message);
      } finally {
        if (isMounted) {
          setTracksLoading(false);
        }
      }
    };

    loadTracks();

    return () => {
      isMounted = false;
    };
  }, [activeTab, userId, tracksPage]);

  const handleToggleStatus = async () => {
    if (!user) {
      return;
    }

    const nextStatus = !user.isActive;
    const confirmed = window.confirm(
      nextStatus
        ? `Bạn có chắc muốn mở khóa tài khoản ${user.name}?`
        : `Bạn có chắc muốn khóa tài khoản ${user.name}?`,
    );

    if (!confirmed) {
      return;
    }

    setUpdatingStatus(true);
    try {
      await toggleUserStatus(user.id, nextStatus);
      setUser((prev) => (prev ? { ...prev, isActive: nextStatus } : prev));
    } catch (error) {
      alert(parseApiError(error, "Không thể cập nhật trạng thái tài khoản.").message);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleTabChange = (tab: DetailTab) => {
    setActiveTab(tab);
    if (tab === "orders") {
      setOrdersPage(0);
    }
    if (tab === "tracks") {
      setTracksPage(0);
    }
  };

  if (loading) {
    return (
      <div className="container-fluid py-4 px-lg-4 text-center text-muted">
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container-fluid py-4 px-lg-4">
        <div className="card border-0 shadow-sm rounded-4 p-4 text-center">
          <h5 className="text-danger fw-bold mb-2">Không thể tải hồ sơ người dùng</h5>
          <p className="text-muted mb-3">{errorMessage || "Không tìm thấy người dùng."}</p>
          <div className="d-flex justify-content-center gap-2">
            <button className="btn btn-light" onClick={() => navigate(-1)}>
              Quay lại
            </button>
            <button className="btn btn-primary" onClick={fetchUserDetail}>
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  const roleMeta = getRoleMeta(user.role);

  return (
    <div className="container-fluid py-4 px-lg-4">
      <div className="d-flex align-items-center mb-4">
        <button
          className="btn btn-light rounded-circle me-3 shadow-sm"
          onClick={() => navigate(-1)}
          style={{ width: "40px", height: "40px" }}
        >
          <i className="bi bi-arrow-left" />
        </button>
        <div>
          <h3 className="fw-bold mb-1" style={{ color: "#0f172a" }}>
            Hồ sơ chi tiết người dùng
          </h3>
          <p className="text-muted mb-0">Xem và quản lý trạng thái tài khoản.</p>
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-4 mb-4 overflow-hidden">
        <div className="card-body p-4 d-flex align-items-center flex-wrap gap-4">
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt="Avatar"
              className="rounded-circle shadow-sm"
              style={{ width: "100px", height: "100px", objectFit: "cover" }}
            />
          ) : (
            <div
              className="rounded-circle shadow-sm d-flex justify-content-center align-items-center text-white display-5 fw-bold"
              style={{
                width: "100px",
                height: "100px",
                backgroundColor: user.isActive ? "#0d9488" : "#64748b",
              }}
            >
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}

          <div className="flex-grow-1">
            <h4 className="fw-bold mb-2">{user.name}</h4>
            <div className="d-flex flex-wrap gap-3 mb-2 text-muted">
              <span>
                <i className="bi bi-envelope me-2" />
                {user.email}
              </span>
              <span>
                <i className="bi bi-calendar3 me-2" />
                Tham gia: {formatDateTime(user.createdAt)}
              </span>
            </div>
            <div className="d-flex gap-2 mt-2 flex-wrap">
              <span className={`badge rounded-pill px-3 py-2 ${roleMeta.className}`}>
                <i className={`${roleMeta.iconClass} me-1`} />
                {roleMeta.label}
              </span>
              {user.isActive ? (
                <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-3 py-2">
                  Hoạt động
                </span>
              ) : (
                <span className="badge bg-danger bg-opacity-10 text-danger rounded-pill px-3 py-2">
                  Đã khóa
                </span>
              )}
              {user.isEmailVerified ? (
                <span className="badge bg-info bg-opacity-10 text-info rounded-pill px-3 py-2">
                  Email đã xác minh
                </span>
              ) : (
                <span className="badge bg-warning bg-opacity-10 text-warning rounded-pill px-3 py-2">
                  Chưa xác minh email
                </span>
              )}
            </div>
          </div>

          <div>
            <button
              className={`btn rounded-pill px-4 ${user.isActive ? "btn-outline-danger" : "btn-outline-success"}`}
              onClick={handleToggleStatus}
              disabled={updatingStatus}
            >
              <i className={`bi ${user.isActive ? "bi-lock" : "bi-unlock"} me-2`} />
              {updatingStatus
                ? "Đang xử lý..."
                : user.isActive
                  ? "Khóa tài khoản"
                  : "Mở khóa tài khoản"}
            </button>
          </div>
        </div>
      </div>

      <ul className="nav nav-pills mb-4 gap-2">
        <li className="nav-item">
          <button
            className={`nav-link rounded-pill px-4 ${activeTab === "overview" ? "active shadow-sm" : "bg-white text-muted border"}`}
            style={activeTab === "overview" ? { backgroundColor: "#4f46e5" } : {}}
            onClick={() => handleTabChange("overview")}
          >
            Thông tin chung
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link rounded-pill px-4 ${activeTab === "security" ? "active shadow-sm" : "bg-white text-muted border"}`}
            style={activeTab === "security" ? { backgroundColor: "#4f46e5" } : {}}
            onClick={() => handleTabChange("security")}
          >
            Bảo mật & xác thực
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link rounded-pill px-4 ${activeTab === "orders" ? "active shadow-sm" : "bg-white text-muted border"}`}
            style={activeTab === "orders" ? { backgroundColor: "#4f46e5" } : {}}
            onClick={() => handleTabChange("orders")}
          >
            Đơn hàng & giao dịch
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link rounded-pill px-4 ${activeTab === "tracks" ? "active shadow-sm" : "bg-white text-muted border"}`}
            style={activeTab === "tracks" ? { backgroundColor: "#4f46e5" } : {}}
            onClick={() => handleTabChange("tracks")}
          >
            Tác phẩm âm nhạc
          </button>
        </li>
      </ul>

      <div className="card border-0 shadow-sm rounded-4">
        <div className="card-body p-4">
          {activeTab === "overview" && (
            <div className="row g-3">
              <div className="col-md-6">
                <div className="border rounded-3 p-3 h-100">
                  <div className="text-muted small mb-1">Mã người dùng</div>
                  <div className="fw-semibold">#{user.id}</div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="border rounded-3 p-3 h-100">
                  <div className="text-muted small mb-1">Vai trò</div>
                  <div className="fw-semibold text-capitalize">{user.role}</div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="border rounded-3 p-3 h-100">
                  <div className="text-muted small mb-1">Ngày tạo</div>
                  <div className="fw-semibold">{formatDateTime(user.createdAt)}</div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="border rounded-3 p-3 h-100">
                  <div className="text-muted small mb-1">Cập nhật gần nhất</div>
                  <div className="fw-semibold">{formatDateTime(user.updatedAt)}</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="row g-3">
              <div className="col-md-6">
                <div className="border rounded-3 p-3 h-100">
                  <div className="text-muted small mb-1">Nhà cung cấp đăng nhập</div>
                  <div className="fw-semibold text-capitalize">{user.authProvider || "local"}</div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="border rounded-3 p-3 h-100">
                  <div className="text-muted small mb-1">Provider ID</div>
                  <div className="fw-semibold" style={{ wordBreak: "break-all" }}>
                    {user.providerId || "-"}
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="border rounded-3 p-3 h-100">
                  <div className="text-muted small mb-1">Trạng thái tài khoản</div>
                  <div className={`fw-semibold ${user.isActive ? "text-success" : "text-danger"}`}>
                    {user.isActive ? "Đang hoạt động" : "Đã bị khóa"}
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="border rounded-3 p-3 h-100">
                  <div className="text-muted small mb-1">Xác minh email</div>
                  <div className={`fw-semibold ${user.isEmailVerified ? "text-success" : "text-warning"}`}>
                    {user.isEmailVerified ? "Đã xác minh" : "Chưa xác minh"}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "orders" && (
            <div>
              {ordersError ? (
                <div className="alert alert-warning mb-3" role="alert">
                  {ordersError}
                </div>
              ) : null}

              {ordersLoading ? (
                <div className="text-center py-5 text-muted">
                  <div className="spinner-border text-primary" role="status" />
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-5 text-muted">
                  Người dùng chưa có đơn hàng nào.
                </div>
              ) : (
                <>
                  <div className="table-responsive">
                    <table className="table align-middle table-hover">
                      <thead className="table-light">
                        <tr>
                          <th>Mã đơn</th>
                          <th>Ngày tạo</th>
                          <th>Thanh toán</th>
                          <th>Tổng tiền</th>
                          <th>Số sản phẩm</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order) => (
                          <tr key={order.orderId}>
                            <td className="fw-semibold">#{order.orderId}</td>
                            <td>{formatDateTime(order.createdAt)}</td>
                            <td>
                              <span className="badge bg-light text-dark border text-uppercase">
                                {order.paymentStatus}
                              </span>
                            </td>
                            <td className="fw-semibold">
                              {new Intl.NumberFormat("vi-VN").format(order.totalAmount)} đ
                            </td>
                            <td>{order.totalItems}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <span className="text-muted small">
                      Hiển thị {orders.length > 0 ? ordersPage * 10 + 1 : 0}-
                      {Math.min((ordersPage + 1) * 10, ordersTotalItems)} / {ordersTotalItems}
                    </span>
                    <div className="btn-group btn-group-sm">
                      <button
                        className="btn btn-outline-secondary"
                        disabled={ordersPage === 0}
                        onClick={() => setOrdersPage((prev) => Math.max(0, prev - 1))}
                      >
                        Trước
                      </button>
                      <button className="btn btn-outline-secondary" disabled>
                        {ordersPage + 1} / {ordersTotalPages || 1}
                      </button>
                      <button
                        className="btn btn-outline-secondary"
                        disabled={ordersPage >= (ordersTotalPages || 1) - 1}
                        onClick={() => setOrdersPage((prev) => prev + 1)}
                      >
                        Sau
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === "tracks" && (
            <div>
              {tracksError ? (
                <div className="alert alert-warning mb-3" role="alert">
                  {tracksError}
                </div>
              ) : null}

              {tracksLoading ? (
                <div className="text-center py-5 text-muted">
                  <div className="spinner-border text-primary" role="status" />
                </div>
              ) : tracks.length === 0 ? (
                <div className="text-center py-5 text-muted">
                  Người dùng chưa có tác phẩm nào hoặc không phải artist.
                </div>
              ) : (
                <>
                  <div className="table-responsive">
                    <table className="table align-middle table-hover">
                      <thead className="table-light">
                        <tr>
                          <th>Tác phẩm</th>
                          <th>Loại</th>
                          <th>Ngày tải lên</th>
                          <th>Lượt nghe</th>
                          <th>Giá từ</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tracks.map((track) => (
                          <tr key={track.id}>
                            <td>
                              <div className="d-flex align-items-center gap-2">
                                {track.coverImage ? (
                                  <img
                                    src={track.coverImage}
                                    alt={track.title}
                                    style={{ width: "44px", height: "44px", objectFit: "cover" }}
                                    className="rounded"
                                  />
                                ) : null}
                                <div>
                                  <div className="fw-semibold">{track.title}</div>
                                  <small className="text-muted">#{track.id}</small>
                                </div>
                              </div>
                            </td>
                            <td className="text-capitalize">{track.audioType}</td>
                            <td>{formatDateTime(track.uploadDate)}</td>
                            <td>{track.playCount}</td>
                            <td className="fw-semibold">
                              {new Intl.NumberFormat("vi-VN").format(track.startingPrice)} đ
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <span className="text-muted small">
                      Hiển thị {tracks.length > 0 ? tracksPage * 10 + 1 : 0}-
                      {Math.min((tracksPage + 1) * 10, tracksTotalItems)} / {tracksTotalItems}
                    </span>
                    <div className="btn-group btn-group-sm">
                      <button
                        className="btn btn-outline-secondary"
                        disabled={tracksPage === 0}
                        onClick={() => setTracksPage((prev) => Math.max(0, prev - 1))}
                      >
                        Trước
                      </button>
                      <button className="btn btn-outline-secondary" disabled>
                        {tracksPage + 1} / {tracksTotalPages || 1}
                      </button>
                      <button
                        className="btn btn-outline-secondary"
                        disabled={tracksPage >= (tracksTotalPages || 1) - 1}
                        onClick={() => setTracksPage((prev) => prev + 1)}
                      >
                        Sau
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminUserDetailPage;