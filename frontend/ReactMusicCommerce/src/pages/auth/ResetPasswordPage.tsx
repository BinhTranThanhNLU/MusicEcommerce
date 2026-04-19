import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import PageTitle from "../../components/utils/PageTitle";
import { resetPassword } from "../../apis/authApi"; // Chú ý sửa lại đường dẫn nếu cần
import Swal from "sweetalert2";

const ResetPasswordPage = () => {
  // Lấy token từ thanh URL
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  // State quản lý con mắt ẩn/hiện mật khẩu
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Kiểm tra xem có token trên URL
    if (!token) {
      Swal.fire({
        icon: "error",
        title: "Lỗi đường dẫn",
        text: "Đường dẫn không hợp lệ hoặc thiếu token xác thực.",
        confirmButtonColor: "#dc3545",
      });
      return;
    }

    // Kiểm tra mật khẩu khớp nhau
    if (newPassword !== confirmPassword) {
      Swal.fire({
        icon: "warning",
        title: "Cảnh báo",
        text: "Mật khẩu xác nhận không khớp!",
        confirmButtonColor: "#f39c12",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Gọi API đặt lại mật khẩu
      await resetPassword({ token, newPassword });

      Swal.fire({
        icon: "success",
        title: "Thành công!",
        text: "Mật khẩu của bạn đã được thay đổi. Bạn có thể đăng nhập ngay bây giờ.",
        confirmButtonText: "Đăng nhập",
        confirmButtonColor: "#007bff",
      }).then(() => {
        navigate("/login");
      });
    } catch (err: any) {
      const errorMessage =
        err.response?.data ||
        "Link đã hết hạn hoặc không hợp lệ. Vui lòng thử lại!";
      Swal.fire({
        icon: "error",
        title: "Thất bại",
        text: errorMessage,
        confirmButtonColor: "#dc3545",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="main">
      <PageTitle />

      <section id="reset-password" className="register section">
        <div className="container" data-aos="fade-up" data-aos-delay="100">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="registration-form-wrapper">
                <div className="form-header text-center">
                  <h2>Đặt lại mật khẩu</h2>
                  <p>Vui lòng nhập mật khẩu mới cho tài khoản của bạn</p>
                </div>

                <div className="row">
                  <div className="col-lg-8 mx-auto">
                    {!token ? (
                      <div
                        className="alert alert-danger text-center"
                        role="alert"
                      >
                        <strong>Lỗi:</strong> Không tìm thấy mã xác thực. Vui
                        lòng truy cập lại từ đường link trong email của bạn.
                      </div>
                    ) : (
                      // Form đổi mật khẩu hiển thị khi có token
                      <form onSubmit={handleSubmit}>
                        <div className="form-floating position-relative mb-3">
                          <input
                            type={showPassword ? "text" : "password"}
                            className="form-control"
                            id="newPassword"
                            name="newPassword"
                            placeholder="Mật khẩu mới"
                            required
                            minLength={8}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                          />
                          <label htmlFor="newPassword">Mật khẩu mới</label>
                          <i
                            className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"} position-absolute top-50 end-0 translate-middle-y pe-3`}
                            style={{
                              cursor: "pointer",
                              zIndex: 10,
                              fontSize: "1.2rem",
                              color: "#6c757d",
                            }}
                            onClick={() => setShowPassword(!showPassword)}
                          ></i>
                        </div>

                        <div className="form-floating position-relative mb-4">
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            className="form-control"
                            id="confirmPassword"
                            name="confirmPassword"
                            placeholder="Xác nhận mật khẩu"
                            required
                            minLength={8}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                          />
                          <label htmlFor="confirmPassword">
                            Xác nhận mật khẩu mới
                          </label>
                          <i
                            className={`bi ${showConfirmPassword ? "bi-eye-slash" : "bi-eye"} position-absolute top-50 end-0 translate-middle-y pe-3`}
                            style={{
                              cursor: "pointer",
                              zIndex: 10,
                              fontSize: "1.2rem",
                              color: "#6c757d",
                            }}
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                          ></i>
                        </div>

                        <div className="d-grid mb-4">
                          <button
                            type="submit"
                            className="btn btn-register"
                            disabled={
                              isLoading || !newPassword || !confirmPassword
                            }
                          >
                            {isLoading ? "Đang xử lý..." : "Lưu mật khẩu mới"}
                          </button>
                        </div>
                      </form>
                    )}

                    <div className="text-center mt-3">
                      <Link
                        to="/login"
                        className="text-decoration-none text-muted"
                      >
                        <i className="bi bi-arrow-left me-1"></i> Quay lại đăng
                        nhập
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="decorative-elements">
                  <div className="circle circle-1"></div>
                  <div className="circle circle-2"></div>
                  <div className="circle circle-3"></div>
                  <div className="square square-1"></div>
                  <div className="square square-2"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ResetPasswordPage;
