import PageTitle from "../../components/layouts/PageTitle";

const LoginPage = () => {
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

                  <form className="auth-form-content">
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

                    <button type="submit" className="auth-btn primary-btn mb-3">
                      Đăng nhập
                      <i className="bi bi-arrow-right"></i>
                    </button>

                    <div className="divider">
                      <span>hoặc</span>
                    </div>

                    <button type="button" className="auth-btn social-btn">
                      <i className="bi bi-google"></i>
                      Tiếp tục với Google
                    </button>

                    <div className="switch-form">
                      <span>Bạn chưa có tài khoản?</span>
                      <button
                        type="button"
                        className="switch-btn"
                        data-target="register"
                      >
                        Tạo tài khoản
                      </button>
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
