import { useState } from "react";
import PageTitle from "../../components/layouts/PageTitle";
import { forgotPassword } from "../../apis/authApi";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Ngăn trình duyệt reload

    if (!email) return;

    setIsLoading(true);

    try {
      // Gọi API gửi yêu cầu
      await forgotPassword({ email });

      // Hiển thị popup thành công
      Swal.fire({
        icon: "success",
        title: "Đã gửi yêu cầu!",
        text: "Vui lòng kiểm tra hộp thư đến (hoặc thư rác) của bạn để lấy link đặt lại mật khẩu.",
        confirmButtonText: "Đóng",
        confirmButtonColor: "#007bff",
      });

      // Xóa rỗng ô input sau khi gửi thành công
      setEmail("");
    } catch (err: any) {
      const errorMessage =
        err.response?.data || "Có lỗi xảy ra. Vui lòng thử lại sau!";
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
                    <form onSubmit={handleSubmit}>
                      <div className="form-floating mb-3">
                        <input
                          type="email"
                          className="form-control"
                          id="email"
                          name="email"
                          placeholder="Email"
                          required
                          autoComplete="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                        <label htmlFor="email">Email</label>
                      </div>

                      <div className="d-grid mb-4">
                        <button
                          type="submit"
                          className="btn btn-register"
                          disabled={isLoading || !email}
                        >
                          {isLoading ? "Đang gửi..." : "Gửi yêu cầu"}
                        </button>
                      </div>

                      <div className="text-center mt-3">
                        <Link
                          to="/login"
                          className="text-decoration-none text-muted"
                        >
                          <i className="bi bi-arrow-left me-1"></i> Quay lại
                          Đăng nhập
                        </Link>
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
