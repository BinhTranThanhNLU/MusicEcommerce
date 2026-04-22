const ReviewTab = () => {
  return (
    <div
      className="tab-pane fade"
      id="ecommerce-product-details-5-customer-reviews"
    >
      <div className="reviews-content">
        <div className="reviews-header">
          <div className="rating-overview">
            <div className="average-score">
              <div className="score-display">4.6</div>
              <div className="score-stars">
                <i className="bi bi-star-fill"></i>
                <i className="bi bi-star-fill"></i>
                <i className="bi bi-star-fill"></i>
                <i className="bi bi-star-fill"></i>
                <i className="bi bi-star-half"></i>
              </div>
              <div className="total-reviews">127 đánh giá của khách hàng</div>
            </div>

            <div className="rating-distribution">
              <div className="rating-row">
                <span className="stars-label">5★</span>
                <div className="progress-container">
                  <div className="progress-fill" style={{ width: "68%" }}></div>
                </div>
                <span className="count-label">86</span>
              </div>
              <div className="rating-row">
                <span className="stars-label">4★</span>
                <div className="progress-container">
                  <div className="progress-fill" style={{ width: "22%" }}></div>
                </div>
                <span className="count-label">28</span>
              </div>
              <div className="rating-row">
                <span className="stars-label">3★</span>
                <div className="progress-container">
                  <div className="progress-fill" style={{ width: "6%" }}></div>
                </div>
                <span className="count-label">8</span>
              </div>
              <div className="rating-row">
                <span className="stars-label">2★</span>
                <div className="progress-container">
                  <div className="progress-fill" style={{ width: "3%" }}></div>
                </div>
                <span className="count-label">4</span>
              </div>
              <div className="rating-row">
                <span className="stars-label">1★</span>
                <div className="progress-container">
                  <div className="progress-fill" style={{ width: "1%" }}></div>
                </div>
                <span className="count-label">1</span>
              </div>
            </div>
          </div>

          <div className="write-review-cta">
            <h4>Chia sẻ trải nghiệm của bạn</h4>
            <p>Giúp những người khác đưa ra quyết định đúng đắn</p>
            <button className="btn review-btn">Viết đánh giá</button>
          </div>
        </div>

        <div className="customer-reviews-list">
          <div className="review-card">
            <div className="reviewer-profile">
              <img
                src="../../assets/img/person/person-f-3.webp"
                alt="Khách hàng"
                className="profile-pic"
              />
              <div className="profile-details">
                <div className="customer-name">Sarah Martinez</div>
                <div className="review-meta">
                  <div className="review-stars">
                    <i className="bi bi-star-fill"></i>
                    <i className="bi bi-star-fill"></i>
                    <i className="bi bi-star-fill"></i>
                    <i className="bi bi-star-fill"></i>
                    <i className="bi bi-star-fill"></i>
                  </div>
                  <span className="review-date">28 Tháng 3, 2024</span>
                </div>
              </div>
            </div>
            <h5 className="review-headline">
              Chất lượng tuyệt vời và rất thoải mái
            </h5>
            <div className="review-text">
              <p>
                Sản phẩm có thiết kế đẹp, chất liệu tốt và đi rất êm chân. Tôi
                rất hài lòng với trải nghiệm này.
              </p>
            </div>
            <div className="review-actions">
              <button className="action-btn">
                <i className="bi bi-hand-thumbs-up"></i> Hữu ích (12)
              </button>
              <button className="action-btn">
                <i className="bi bi-chat-dots"></i> Trả lời
              </button>
            </div>
          </div>

          <div className="review-card">
            <div className="reviewer-profile">
              <img
                src="../../assets/img/person/person-m-5.webp"
                alt="Khách hàng"
                className="profile-pic"
              />
              <div className="profile-details">
                <div className="customer-name">David Chen</div>
                <div className="review-meta">
                  <div className="review-stars">
                    <i className="bi bi-star-fill"></i>
                    <i className="bi bi-star-fill"></i>
                    <i className="bi bi-star-fill"></i>
                    <i className="bi bi-star-fill"></i>
                    <i className="bi bi-star"></i>
                  </div>
                  <span className="review-date">15 Tháng 3, 2024</span>
                </div>
              </div>
            </div>
            <h5 className="review-headline">Giá tốt, chất lượng ổn</h5>
            <div className="review-text">
              <p>
                Giày đẹp và chất lượng tốt so với giá. Tuy nhiên, lúc đầu hơi
                cứng, cần vài ngày để làm mềm.
              </p>
            </div>
            <div className="review-actions">
              <button className="action-btn">
                <i className="bi bi-hand-thumbs-up"></i> Hữu ích (8)
              </button>
              <button className="action-btn">
                <i className="bi bi-chat-dots"></i> Trả lời
              </button>
            </div>
          </div>

          <div className="review-card">
            <div className="reviewer-profile">
              <img
                src="assets/img/person/person-f-7.webp"
                alt="Khách hàng"
                className="profile-pic"
              />
              <div className="profile-details">
                <div className="customer-name">Emily Rodriguez</div>
                <div className="review-meta">
                  <div className="review-stars">
                    <i className="bi bi-star-fill"></i>
                    <i className="bi bi-star-fill"></i>
                    <i className="bi bi-star-fill"></i>
                    <i className="bi bi-star-fill"></i>
                    <i className="bi bi-star-fill"></i>
                  </div>
                  <span className="review-date">22 Tháng 2, 2024</span>
                </div>
              </div>
            </div>
            <h5 className="review-headline">
              Hoàn hảo cho những buổi tập luyện
            </h5>
            <div className="review-text">
              <p>
                Giày bám tốt, hỗ trợ bàn chân khi vận động mạnh. Rất phù hợp cho
                thể thao và đi chơi hàng ngày.
              </p>
            </div>
            <div className="review-actions">
              <button className="action-btn">
                <i className="bi bi-hand-thumbs-up"></i> Hữu ích (15)
              </button>
              <button className="action-btn">
                <i className="bi bi-chat-dots"></i> Trả lời
              </button>
            </div>
          </div>

          <div className="load-more-section">
            <button className="btn load-more-reviews">Xem thêm đánh giá</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewTab;
