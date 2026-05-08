import { useContext, useState } from "react";
import PageTitle from "../../components/utils/PageTitle";
import { SpinningLoading } from "../../components/utils/SpinningLoading";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { loginWithEmail, loginWithGoogleToken } from "../../apis/authApi";
import { GoogleLogin } from "@react-oauth/google";
import { parseApiError } from "../../utils/apiError";

interface LoginFormFieldErrors {
  email?: string;
  password?: string;
}

const mapLoginFieldErrors = (
  backendFieldErrors: Record<string, string>
): LoginFormFieldErrors => {
  return {
    email: backendFieldErrors.email,
    password: backendFieldErrors.password,
  };
};

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [error, setError] = useState<string>("");
  const [fieldErrors, setFieldErrors] = useState<LoginFormFieldErrors>({});

  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: undefined }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: undefined }));
  };

  const handleLocalLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    const newFieldErrors: LoginFormFieldErrors = {};
    let hasError = false;

    if (!email.trim()) {
      newFieldErrors.email = "Email không được để trống";
      hasError = true;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newFieldErrors.email = "Định dạng email không hợp lệ";
      hasError = true;
    }

    if (!password) {
      newFieldErrors.password = "Mật khẩu không được để trống";
      hasError = true;
    }

    if (hasError) {
      setFieldErrors(newFieldErrors);
      setError("Vui lòng kiểm tra lại các thông tin chưa hợp lệ.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await loginWithEmail({ email, password });

      if (authContext) {
        authContext.loginContext(response.user, response.token);
      }

      if (response.user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/"); 
      }
    } catch (err: unknown) {
      const parsed = parseApiError(err, "Đăng nhập thất bại. Vui lòng thử lại!");
      const mappedFieldErrors = mapLoginFieldErrors(parsed.fieldErrors || {});
      const hasBackendFieldErrors = Object.values(mappedFieldErrors).some(
        (value) => typeof value === "string" && value.trim().length > 0
      );

      setFieldErrors(mappedFieldErrors);
      setError(hasBackendFieldErrors ? "Vui lòng kiểm tra lại thông tin đăng nhập." : parsed.message);
    } finally {
      setIsLoading(false);
    }
  };

  // ----- Xử lý Đăng nhập Google -----
  const handleGoogleSuccess = async (credentialResponse: any) => {
    setIsLoading(true);
    setError("");

    try {
      const response = await loginWithGoogleToken({
        credential: credentialResponse.credential,
      });

      if (authContext) {
        authContext.loginContext(response.user, response.token);
      }

      if (response.user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } catch (err: unknown) {
      const parsed = parseApiError(err, "Đăng nhập Google thất bại. Vui lòng thử lại!");
      setError(parsed.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <SpinningLoading />;

  return (
    <main className="main">
      <PageTitle title="Đăng nhập" current="Đăng nhập" />

      <section id="login" className="login section">
        <div className="container" data-aos="fade-up" data-aos-delay="100">
          <div className="row justify-content-center">
            <div className="col-lg-8 col-md-10">
              <div
                className="auth-container"
                data-aos="fade-in"
                data-aos-delay="200"
              >
                <div className="auth-form login-form active">
                  <div className="form-header">
                    <h3>Chào mừng trở lại</h3>
                    <p>Đăng nhập vào tài khoản của bạn</p>
                  </div>

                  <form
                    className="auth-form-content"
                    onSubmit={handleLocalLogin}
                    noValidate
                  >
                    
                    {/* Báo lỗi Global (Sai pass, tài khoản bị khóa...) */}
                    {error && (
                      <div className="alert alert-danger mb-4" role="alert">
                        {error}
                      </div>
                    )}

                    <div className="input-group mb-3 position-relative">
                      <span className="input-icon">
                        <i className="bi bi-envelope"></i>
                      </span>
                      <input
                        type="email"
                        className={`form-control ${fieldErrors.email ? "is-invalid" : ""}`}
                        placeholder="Email"
                        autoComplete="email"
                        value={email}
                        onChange={handleEmailChange}
                      />
                      {fieldErrors.email && (
                        <div className="invalid-feedback d-block w-100 mt-2 text-start">
                          {fieldErrors.email}
                        </div>
                      )}
                    </div>

                    <div className="input-group mb-3 position-relative">
                      <span className="input-icon">
                        <i className="bi bi-lock"></i>
                      </span>
                      <input
                        type={showPassword ? "text" : "password"}
                        className={`form-control ${fieldErrors.password ? "is-invalid" : ""}`}
                        placeholder="Password"
                        autoComplete="current-password"
                        value={password}
                        onChange={handlePasswordChange}
                      />
                      <span className="password-toggle">
                        <span
                          onClick={() => setShowPassword(!showPassword)}
                          style={{ cursor: "pointer" }}
                        >
                          <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                        </span>
                      </span>
                      {fieldErrors.password && (
                        <div className="invalid-feedback d-block w-100 mt-2 text-start">
                          {fieldErrors.password}
                        </div>
                      )}
                    </div>

                    <div className="form-options mb-4">
                      <div className="remember-me">
                        <input type="checkbox" id="rememberLogin" />
                        <label htmlFor="rememberLogin">Remember me</label>
                      </div>
                      <Link to="/forgot-password" className="forgot-password">
                        Quên mật khẩu?
                      </Link>
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
                        theme="outline"
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