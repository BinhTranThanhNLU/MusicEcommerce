import PageTitle from "../../components/utils/PageTitle";
import { Link } from "react-router-dom";

interface ErrorPageProps {
  code?: string;
  title?: string;
  message?: string;
}

const ErrorPage = ({
  code = "404",
  title = "Ồ! Không tìm thấy trang",
  message = "Trang bạn đang tìm kiếm có thể đã bị xóa, đã đổi tên hoặc tạm thời không khả dụng.",
}: ErrorPageProps) => {
  return (
    <main className="main">
      <PageTitle title={`Lỗi ${code}`} current={`Lỗi ${code}`} />

      <section id="error-page" className="error-404 section">
        <div className="container" data-aos="fade-up" data-aos-delay="100">
          <div className="text-center">
            <div className="error-icon mb-4" data-aos="zoom-in" data-aos-delay="200">
              <i className="bi bi-exclamation-circle"></i>
            </div>

            {/* Hiển thị mã lỗi động (404, 403, 500...) */}
            <h1 className="error-code mb-4" data-aos="fade-up" data-aos-delay="300">
              {code}
            </h1>

            {/* Hiển thị tiêu đề động */}
            <h2 className="error-title mb-3" data-aos="fade-up" data-aos-delay="400">
              {title}
            </h2>

            {/* Hiển thị lời nhắn động */}
            <p className="error-text mb-4" data-aos="fade-up" data-aos-delay="500">
              {message}
            </p>

            {/* Khung search (có thể giữ hoặc ẩn tùy ý, ở đây mình giữ lại) */}
            <div className="search-box mb-4" data-aos="fade-up" data-aos-delay="600">
              <form action="#" className="search-form">
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Tìm kiếm trang..."
                  />
                  <button className="btn search-btn" type="submit">
                    <i className="bi bi-search"></i>
                  </button>
                </div>
              </form>
            </div>

            <div className="error-action" data-aos="fade-up" data-aos-delay="700">
              <Link to="/" className="btn btn-primary">
                Quay lại Trang chủ
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ErrorPage;