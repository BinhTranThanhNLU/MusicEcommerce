import { useContext, useState } from "react";
import PageTitle from "../../components/layouts/PageTitle";
import { ErrorMessage } from "../../components/utils/ErrorMessage";
import { SpinningLoading } from "../../components/utils/SpinningLoading";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { loginWithEmail, loginWithGoogleToken } from "../../apis/authApi";
import { GoogleLogin } from "@react-oauth/google";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [httpError, setHttpError] = useState<string | null>(null);

  // Dùng hook để lấy hàm loginContext từ kho chứa chung
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  // ----- Xử lý Đăng nhập Truyền thống -----
  const handleLocalLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setHttpError(null);

    try {
      const response = await loginWithEmail({ email, password });

      // Thành công -> Lưu vào Context và chuyển trang
      if (authContext) {
        authContext.loginContext(response.user, response.token);
      }
      navigate("/"); // Chuyển về trang chủ
    } catch (error: any) {
      setHttpError(error.message || "Đăng nhập thất bại. Vui lòng thử lại!");
    } finally {
      setIsLoading(false);
    }
  };

  // ----- Xử lý Đăng nhập Google -----
  const handleGoogleSuccess = async (credentialResponse: any) => {
    setIsLoading(true);
    setHttpError(null);

    try {
      // credentialResponse.credential chính là cái ID Token Google trả về
      const response = await loginWithGoogleToken({
        credential: credentialResponse.credential,
      });

      if (authContext) {
        authContext.loginContext(response.user, response.token);
      }
      navigate("/");
    } catch (error: any) {
      setHttpError(
        error.message || "Đăng nhập Google thất bại. Vui lòng thử lại!",
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <SpinningLoading />;
  if (httpError) return <ErrorMessage message={httpError} />;

  return (
    <main className="main">
      <PageTitle />

      <section id="login" className="login section">
        <div className="container" data-aos="fade-up" data-aos-delay="100">
          <div className="row justify-content-center">
            <div className="col-lg-8 col-md-10">
              <div
                className="auth-container"
                data-aos="fade-in"
                data-aos-delay="200"
              >
                {/* Login Form */}
                <div className="auth-form login-form active">
                  <div className="form-header">
                    <h3>Chào mừng trở lại</h3>
                    <p>Đăng nhập vào tài khoản của bạn</p>
                  </div>

                  <form
                    className="auth-form-content"
                    onSubmit={handleLocalLogin}
                  >
                    <div className="input-group mb-3">
                      <span className="input-icon">
                        <i className="bi bi-envelope"></i>
                      </span>
                      <input
                        type="email"
                        className="form-control"
                        placeholder="Email"
                        required
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>

                    <div className="input-group mb-3">
                      <span className="input-icon">
                        <i className="bi bi-lock"></i>
                      </span>
                      <input
                        type="password"
                        className="form-control"
                        placeholder="Password"
                        required
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <span className="password-toggle">
                        <i className="bi bi-eye"></i>
                      </span>
                    </div>

                    <div className="form-options mb-4">
                      <div className="remember-me">
                        <input type="checkbox" id="rememberLogin" />
                        <label htmlFor="rememberLogin">Remember me</label>
                      </div>
                      <a href="#" className="forgot-password">
                        Quên mật khẩu?
                      </a>
                    </div>

                    <button
                      type="submit"
                      className="auth-btn primary-btn mb-3"
                      disabled={isLoading}
                    >
                      {isLoading ? "Đang xử lý..." : "Đăng nhập"}
                      <i className="bi bi-arrow-right"></i>
                    </button>

                    <div className="divider">
                      <span>hoặc</span>
                    </div>

                    <div className="d-flex justify-content-center mb-3">
                      <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        useOneTap
                        theme="outline" // Tùy chỉnh màu sắc nút
                        text="continue_with"
                      />
                    </div>

                    <div className="switch-form">
                      <span>Bạn chưa có tài khoản?</span>
                      <Link to="/register" className="switch-btn">
                        Tạo tài khoản
                      </Link>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default LoginPage;
