const ReviewsTab = () => {
  return (
    <div className="tab-pane fade" id="reviews">
      <div className="section-header" data-aos="fade-up">
        <h2>Đánh giá của tôi</h2>
      </div>

      <div className="reviews-grid">
        {/* Review Card 1 */}
        <div
          className="review-card p-3 border rounded mb-3 bg-white shadow-sm"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          <div className="review-header d-flex mb-3">
            <img
              src="../../assets/img/music/cover-1.webp"
              alt="Sản phẩm"
              className="rounded"
              width="60"
              height="60"
              loading="lazy"
            />
            <div className="ms-3 review-meta">
              <h5 className="mb-1">Lofi Chill Beats Vol 1</h5>
              <div className="rating text-warning">
                <i className="bi bi-star-fill"></i>
                <i className="bi bi-star-fill"></i>
                <i className="bi bi-star-fill"></i>
                <i className="bi bi-star-fill"></i>
                <i className="bi bi-star-fill"></i>
                <span className="text-dark ms-1">(5.0)</span>
              </div>
              <small className="text-muted">Đánh giá vào ngày 22/04/2026</small>
            </div>
          </div>
          <div className="review-content">
            <p>
              Beat lofi rất chất lượng, phù hợp hoàn hảo cho dự án video podcast
              của tui. Âm thanh sạch và tác giả mix/master rất kỹ. Sẽ tiếp tục
              ủng hộ!
            </p>
          </div>
          <div className="review-footer d-flex justify-content-end gap-2 mt-2">
            <button type="button" className="btn btn-sm btn-outline-secondary">
              Chỉnh sửa
            </button>
            <button type="button" className="btn btn-sm btn-outline-danger">
              Xóa
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewsTab;
