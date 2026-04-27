import { Link, useNavigate } from "react-router-dom";
import PageTitle from "../../components/utils/PageTitle";
import { useState } from "react";
import type { RegisterRequest } from "../../requestmodel/RegisterRequest";
import { registerUser } from "../../apis/authApi";
import Swal from "sweetalert2";
import { parseApiError } from "../../utils/apiError";

interface RegisterFormFieldErrors {
  fullName?: string;
  email?: string;
  role?: string;
  password?: string;
  confirmPassword?: string;
}

const mapRegisterFieldErrors = (
  backendFieldErrors: Record<string, string>,
): RegisterFormFieldErrors => {
  return {
    fullName: backendFieldErrors.name,
    email: backendFieldErrors.email,
    role: backendFieldErrors.role,
    password: backendFieldErrors.password,
  };
};

const RegisterPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    role: "user",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState<string>("");
  const [fieldErrors, setFieldErrors] = useState<RegisterFormFieldErrors>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setFieldErrors((prev) => {
      const next = { ...prev };
      if (name in next) {
        delete next[name as keyof RegisterFormFieldErrors];
      }
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp!");
      setFieldErrors({ confirmPassword: "Mật khẩu xác nhận không khớp!" });
      return;
    }

    setIsLoading(true);

    try {
      // 1. Tạo cục data
      const requestData: RegisterRequest = {
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      };

      // 2. Gọi API
      await registerUser(requestData);

      // 3. Xử lý khi thành công
      Swal.fire({
        icon: "success",
        title: "Thành công!",
        text: "Tài khoản của bạn đã được tạo thành công.",
        confirmButtonText: "Đăng nhập ngay",
        confirmButtonColor: "#007bff", // đổi màu theo theme của web
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login");
        }
      });
    } catch (err: unknown) {
      const parsed = parseApiError(err, "Đăng ký thất bại. Vui lòng thử lại!");
      const mappedFieldErrors = mapRegisterFieldErrors(parsed.fieldErrors);
      const hasFieldErrors = Object.values(mappedFieldErrors).some(
        (value) => typeof value === "string" && value.trim().length > 0,
      );

      setFieldErrors(mappedFieldErrors);
      setError(hasFieldErrors ? "" : parsed.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="main">
      <PageTitle title="Đăng ký" current="Đăng ký"/>

      <section id="register" className="register section">
        <div className="container" data-aos="fade-up" data-aos-delay="100">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="registration-form-wrapper">
                <div className="form-header text-center">
                  <h2>Tạo tài khoản của bạn</h2>
                  <p>Tạo tài khoản của bạn và bắt đầu mua sắm với chúng tôi</p>
                </div>

                <div className="row">
                  <div className="col-lg-8 mx-auto">
                    {error && (
                      <div className="alert alert-danger" role="alert">
                        {error}
                      </div>
                    )}

                    <form onSubmit={handleSubmit} noValidate>
                      <div className="form-floating mb-3">
                        <input
                          type="text"
                          className={`form-control ${fieldErrors.fullName ? "is-invalid" : ""}`}
                          id="fullName"
                          name="fullName"
                          placeholder="Họ và Tên"
                          autoComplete="name"
                          value={formData.fullName}
                          onChange={handleChange}
                        />
                        <label htmlFor="fullName">Họ và Tên</label>
                        {fieldErrors.fullName && (
                          <div className="invalid-feedback">
                            {fieldErrors.fullName}
                          </div>
                        )}
                      </div>

                      <div className="form-floating mb-3">
                        <input
                          type="email"
                          className={`form-control ${fieldErrors.email ? "is-invalid" : ""}`}
                          id="email"
                          name="email"
                          placeholder="Email"
                          autoComplete="email"
                          value={formData.email}
                          onChange={handleChange}
                        />
                        <label htmlFor="email">Email</label>
                        {fieldErrors.email && (
                          <div className="invalid-feedback">{fieldErrors.email}</div>
                        )}
                      </div>

                      <div className="form-floating mb-3">
                        <select
                          className={`form-select ${fieldErrors.role ? "is-invalid" : ""}`}
                          id="role"
                          name="role"
                          aria-label="Chọn vai trò của bạn"
                          defaultValue="user"
                          value={formData.role}
                          onChange={handleChange}
                        >
                          <option value="user">Người nghe nhạc (User)</option>
                          <option value="artist">Nghệ sĩ (Artist)</option>
                        </select>
                        <label htmlFor="role">Bạn là ai?</label>
                        {fieldErrors.role && (
                          <div className="invalid-feedback">{fieldErrors.role}</div>
                        )}
                      </div>

                      <div className="row mb-3">
                        <div className="col-md-6">
                          <div className="form-floating">
                            <input
                              type={showPassword ? "text" : "password"}
                              className={`form-control ${fieldErrors.password ? "is-invalid" : ""}`}
                              id="password"
                              name="password"
                              placeholder="Password"
                              autoComplete="new-password"
                              value={formData.password}
                              onChange={handleChange}
                            />
                            <label htmlFor="password">Password</label>
                            {fieldErrors.password && (
                              <div className="invalid-feedback d-block">
                                {fieldErrors.password}
                              </div>
                            )}
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
                        </div>
                        <div className="col-md-6">
                          <div className="form-floating">
                            <input
                              type={showConfirmPassword ? "text" : "password"}
                              className={`form-control ${fieldErrors.confirmPassword ? "is-invalid" : ""}`}
                              id="confirmPassword"
                              name="confirmPassword"
                              placeholder="Confirm Password"
                              autoComplete="new-password"
                              value={formData.confirmPassword}
                              onChange={handleChange}
                            />
                            <label htmlFor="confirmPassword">
                              Xác nhận Password
                            </label>
                            {fieldErrors.confirmPassword && (
                              <div className="invalid-feedback d-block">
                                {fieldErrors.confirmPassword}
                              </div>
                            )}
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
                        </div>
                      </div>

                      <div className="form-check mb-4">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="termsCheck"
                          name="termsCheck"
                          required
                        />
                        <label
                          className="form-check-label"
                          htmlFor="termsCheck"
                        >
                          Tôi đồng ý với <a href="#">Điều khoản dịch vụ</a> và{" "}
                          <a href="#">Chính sách bảo mật</a>
                        </label>
                      </div>

                      <div className="form-check mb-4">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="marketingCheck"
                          name="marketingCheck"
                        />
                        <label
                          className="form-check-label"
                          htmlFor="marketingCheck"
                        >
                          Tôi muốn nhận thông tin tiếp thị về sản phẩm, dịch vụ
                          và chương trình khuyến mãi
                        </label>
                      </div>

                      <div className="d-grid mb-4">
                        <button
                          type="submit"
                          className="btn btn-register"
                          disabled={isLoading}
                        >
                          {isLoading ? "Đang xử lý..." : "Tạo tài khoản"}
                        </button>
                      </div>

                      <div className="login-link text-center">
                        <p>
                          Bạn đã có tài khoản?{" "}
                          <Link to="/login">Đăng nhập</Link>
                        </p>
                      </div>
                    </form>
                  </div>
                </div>

                <div className="social-login">
                  <div className="row">
                    <div className="col-lg-8 mx-auto">
                      <div className="divider">
                        <span>hoặc đăng ký với</span>
                      </div>
                      <div className="social-buttons">
                        <a href="#" className="btn btn-social">
                          <i className="bi bi-google"></i>
                          <span>Google</span>
                        </a>
                        <a href="#" className="btn btn-social">
                          <i className="bi bi-facebook"></i>
                          <span>Facebook</span>
                        </a>
                        <a href="#" className="btn btn-social">
                          <i className="bi bi-apple"></i>
                          <span>Apple</span>
                        </a>
                      </div>
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

export default RegisterPage;
