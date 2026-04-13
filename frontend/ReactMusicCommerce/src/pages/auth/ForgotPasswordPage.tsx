import PageTitle from "../../components/layouts/PageTitle";

const ForgotPasswordPage = () => {
  return (
    <main className="main">
      <PageTitle />

      <section id="register" className="register section">
        <div className="container" data-aos="fade-up" data-aos-delay="100">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="registration-form-wrapper">
                <div className="form-header text-center">
                  <h2>Quên mật khẩu</h2>
                  <p>Hãy nhập email của bạn</p>
                </div>

                <div className="row">
                  <div className="col-lg-8 mx-auto">
                    <form action="register.php" method="post">
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

                      <div className="d-grid mb-4">
                        <button type="submit" className="btn btn-register">
                          Gửi yêu cầu
                        </button>
                      </div>
                    </form>
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

export default ForgotPasswordPage;
