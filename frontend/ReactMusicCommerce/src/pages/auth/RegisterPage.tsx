import PageTitle from "../../components/layouts/PageTitle";

const RegisterPage = () => {
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
                    <form action="register.php" method="post">
                      <div className="form-floating mb-3">
                        <input
                          type="text"
                          className="form-control"
                          id="fullName"
                          name="fullName"
                          placeholder="Họ và Tên"
                          required
                          autoComplete="name"
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
                        />
                        <label htmlFor="email">Email</label>
                      </div>

                      <div className="row mb-3">
                        <div className="col-md-6">
                          <div className="form-floating">
                            <input
                              type="password"
                              className="form-control"
                              id="password"
                              name="password"
                              placeholder="Password"
                              required
                              minLength={8}
                              autoComplete="new-password"
                            />
                            <label htmlFor="password">Password</label>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-floating">
                            <input
                              type="password"
                              className="form-control"
                              id="confirmPassword"
                              name="confirmPassword"
                              placeholder="Confirm Password"
                              required
                              minLength={8}
                              autoComplete="new-password"
                            />
                            <label htmlFor="confirmPassword">
                              Xác nhận Password
                            </label>
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
                        <button type="submit" className="btn btn-register">
                          Tạo tài khoản
                        </button>
                      </div>

                      <div className="login-link text-center">
                        <p>
                          Bạn đã có tài khoản? <a href="#">Đăng nhập</a>
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
