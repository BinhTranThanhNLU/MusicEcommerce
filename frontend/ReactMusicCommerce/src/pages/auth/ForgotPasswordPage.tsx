import { useState } from "react";
import PageTitle from "../../components/utils/PageTitle";
import { forgotPassword } from "../../apis/authApi";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { parseApiError } from "../../utils/apiError";

interface ForgotPasswordFormFieldErrors {
  email?: string;
}

const mapForgotPasswordFieldErrors = (
  backendFieldErrors: Record<string, string>,
): ForgotPasswordFormFieldErrors => {
  return {
    email: backendFieldErrors.email,
  };
};

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [error, setError] = useState<string>("");
  const [fieldErrors, setFieldErrors] = useState<ForgotPasswordFormFieldErrors>(
    {},
  );

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (fieldErrors.email)
      setFieldErrors((prev) => ({ ...prev, email: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    const newFieldErrors: ForgotPasswordFormFieldErrors = {};
    let hasError = false;

    if (!email.trim()) {
      newFieldErrors.email = "Email không được để trống";
      hasError = true;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newFieldErrors.email = "Định dạng email không hợp lệ";
      hasError = true;
    }

    if (hasError) {
      setFieldErrors(newFieldErrors);
      return;
    }

    setIsLoading(true);

    try {
      await forgotPassword({ email });

      // Thành công
      Swal.fire({
        icon: "success",
        title: "Đã gửi yêu cầu!",
        text: "Vui lòng kiểm tra hộp thư đến (hoặc thư rác) của bạn để lấy link đặt lại mật khẩu.",
        confirmButtonText: "Đóng",
        confirmButtonColor: "#007bff",
      });

      setEmail("");
    } catch (err: unknown) {
      const parsed = parseApiError(err, "Có lỗi xảy ra. Vui lòng thử lại sau!");
      const mappedFieldErrors = mapForgotPasswordFieldErrors(
        parsed.fieldErrors || {},
      );
      const hasBackendFieldErrors = Object.values(mappedFieldErrors).some(
        (value) => typeof value === "string" && value.trim().length > 0,
      );

      setFieldErrors(mappedFieldErrors);
      // Hiển thị lỗi chung ("Email không tồn tại trong hệ thống")
      setError(hasBackendFieldErrors ? "" : parsed.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="main">
      <PageTitle title="Quên mật khẩu" current="Quên mật khẩu" />

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
                    <form onSubmit={handleSubmit} noValidate>
                      {error && (
                        <div
                          className="alert alert-danger mb-4 text-start"
                          role="alert"
                        >
                          {error}
                        </div>
                      )}

                      <div className="form-floating mb-3">
                        <input
                          type="email"
                          className={`form-control ${fieldErrors.email ? "is-invalid" : ""}`}
                          id="email"
                          name="email"
                          placeholder="Email"
                          autoComplete="email"
                          value={email}
                          onChange={handleEmailChange}
                        />
                        <label htmlFor="email">Email</label>

                        {fieldErrors.email && (
                          <div className="invalid-feedback text-start mt-2 d-block">
                            {fieldErrors.email}
                          </div>
                        )}

                      </div>

                      <div className="d-grid mb-4">
                        <button
                          type="submit"
                          className="btn btn-register"
                          disabled={isLoading}
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
