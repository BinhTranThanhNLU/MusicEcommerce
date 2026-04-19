import { Link, useNavigate } from "react-router-dom";
import PageTitle from "../../components/utils/PageTitle";
import { useState } from "react";
import type { RegisterRequest } from "../../requestmodel/RegisterRequest";
import { registerUser } from "../../apis/authApi";
import Swal from "sweetalert2";

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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp!");
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
    } catch (err: any) {
      const errorMessage =
        err.response?.data || "Đăng ký thất bại. Vui lòng thử lại!";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="main">
      <PageTitle />

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

                    <form onSubmit={handleSubmit}>
                      <div className="form-floating mb-3">
                        <input
                          type="text"
                          className="form-control"
                          id="fullName"
                          name="fullName"
                          placeholder="Họ và Tên"
                          required
                          autoComplete="name"
                          value={formData.fullName}
                          onChange={handleChange}
                        />
                        <label htmlFor="fullName">Họ và Tên</label>
                      </div>

                      <div className="form-floating mb-3">
                        <input
                          type="email"
                          className="form-control"
                          id="email"
                          name="email"
                          placeholder="Email"
                          required
                          autoComplete="email"
                          value={formData.email}
                          onChange={handleChange}
                        />
                        <label htmlFor="email">Email</label>
                      </div>

                      <div className="form-floating mb-3">
                        <select
                          className="form-select"
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
                      </div>

                      <div className="row mb-3">
                        <div className="col-md-6">
                          <div className="form-floating">
                            <input
                              type={showPassword ? "text" : "password"}
                              className="form-control"
                              id="password"
                              name="password"
                              placeholder="Password"
                              required
                              minLength={8}
                              autoComplete="new-password"
                              value={formData.password}
                              onChange={handleChange}
                            />
                            <label htmlFor="password">Password</label>
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
                              className="form-control"
                              id="confirmPassword"
                              name="confirmPassword"
                              placeholder="Confirm Password"
                              required
                              minLength={8}
                              autoComplete="new-password"
                              value={formData.confirmPassword}
                              onChange={handleChange}
                            />
                            <label htmlFor="confirmPassword">
                              Xác nhận Password
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
