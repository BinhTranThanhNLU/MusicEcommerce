import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import PageTitle from "../../components/utils/PageTitle";
import { resetPassword } from "../../apis/authApi";
import Swal from "sweetalert2";
import { parseApiError } from "../../utils/apiError";

interface ResetPasswordFormFieldErrors {
  newPassword?: string;
  confirmPassword?: string;
}

const mapResetPasswordFieldErrors = (
  backendFieldErrors: Record<string, string>,
): ResetPasswordFormFieldErrors => {
  return {
    // Backend có thể trả về lỗi ở field 'newPassword' hoặc 'password' tùy cách bạn code RequestDTO
    newPassword: backendFieldErrors.newPassword || backendFieldErrors.password,
    confirmPassword: backendFieldErrors.confirmPassword,
  };
};

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

  const [error, setError] = useState<string>("");
  const [fieldErrors, setFieldErrors] = useState<ResetPasswordFormFieldErrors>(
    {},
  );

  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value);
    if (fieldErrors.newPassword)
      setFieldErrors((prev) => ({ ...prev, newPassword: undefined }));
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setConfirmPassword(e.target.value);
    if (fieldErrors.confirmPassword)
      setFieldErrors((prev) => ({ ...prev, confirmPassword: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    if (!token) {
      Swal.fire({
        icon: "error",
        title: "Lỗi đường dẫn",
        text: "Đường dẫn không hợp lệ hoặc thiếu token xác thực.",
        confirmButtonColor: "#dc3545",
      });
      return;
    }

    const newFieldErrors: ResetPasswordFormFieldErrors = {};
    let hasError = false;

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!newPassword) {
      newFieldErrors.newPassword = "Mật khẩu không được để trống";
      hasError = true;
    } else if (!passwordRegex.test(newPassword)) {
      newFieldErrors.newPassword =
        "Mật khẩu phải từ 8 ký tự, gồm ít nhất 1 chữ hoa, 1 thường, 1 số và 1 ký tự đặc biệt.";
      hasError = true;
    }

    if (newPassword !== confirmPassword) {
      newFieldErrors.confirmPassword = "Mật khẩu xác nhận không khớp!";
      hasError = true;
    }

    if (hasError) {
      setFieldErrors(newFieldErrors);
      return; // Dừng lại, không gọi API
    }

    setIsLoading(true);

    try {
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
    } catch (err: unknown) {
      const parsed = parseApiError(
        err,
        "Link đã hết hạn hoặc không hợp lệ. Vui lòng thử lại!",
      );
      const mappedFieldErrors = mapResetPasswordFieldErrors(
        parsed.fieldErrors || {},
      );
      const hasBackendFieldErrors = Object.values(mappedFieldErrors).some(
        (value) => typeof value === "string" && value.trim().length > 0,
      );

      setFieldErrors(mappedFieldErrors);
      setError(
        hasBackendFieldErrors
          ? "Vui lòng kiểm tra lại thông tin."
          : parsed.message,
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="main">
      <PageTitle title="Thay đổi mật khẩu" current="Thay đổi mật khẩu" />

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
                      <form onSubmit={handleSubmit} noValidate>
                        {error && (
                          <div
                            className="alert alert-danger mb-4 text-start"
                            role="alert"
                          >
                            {error}
                          </div>
                        )}

                        <div className="form-floating position-relative mb-3">
                          <input
                            type={showPassword ? "text" : "password"}
                            className={`form-control ${fieldErrors.newPassword ? "is-invalid" : ""}`}
                            id="newPassword"
                            name="newPassword"
                            placeholder="Mật khẩu mới"
                            value={newPassword}
                            onChange={handleNewPasswordChange}
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

                          {fieldErrors.newPassword && (
                            <div className="invalid-feedback d-block w-100 mt-2 text-start">
                              {fieldErrors.newPassword}
                            </div>
                          )}
                        </div>

                        <div className="form-floating position-relative mb-4">
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            className={`form-control ${fieldErrors.confirmPassword ? "is-invalid" : ""}`}
                            id="confirmPassword"
                            name="confirmPassword"
                            placeholder="Xác nhận mật khẩu"
                            value={confirmPassword}
                            onChange={handleConfirmPasswordChange}
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

                          {fieldErrors.confirmPassword && (
                            <div className="invalid-feedback d-block w-100 mt-2 text-start">
                              {fieldErrors.confirmPassword}
                            </div>
                          )}
                          
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
