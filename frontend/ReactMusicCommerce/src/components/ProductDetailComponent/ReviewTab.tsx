import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getReviewsByAudioTrack, submitReview } from "../../apis/reviewApi";
import { AuthContext } from "../../context/AuthContext";
import type { AudioTrackReviewItemResponse } from "../../responsemodel/AudioTrackReviewResponse";

interface ReviewTabProps {
  audioId: number;
}

const FALLBACK_AVATAR = "/assets/img/person/person-m-7.webp";
const REVIEWS_PAGE_SIZE = 5;

const resolveMediaUrl = (path: string | null) => {
  if (!path) {
    return FALLBACK_AVATAR;
  }

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  if (path.startsWith("/")) {
    return `http://localhost:8080${path}`;
  }

  return `http://localhost:8080/${path}`;
};

const formatDateTime = (value: string) => {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
};

const renderDisplayStars = (rating: number) => {
  const safeRating = Math.max(0, Math.min(5, rating));

  return Array.from({ length: 5 }, (_, index) => {
    const position = index + 1;
    const iconClass = safeRating >= position
      ? "bi-star-fill"
      : safeRating >= position - 0.5
        ? "bi-star-half"
        : "bi-star";

    return <i key={position} className={`bi ${iconClass}`}></i>;
  });
};

const renderInputStars = (rating: number, onPick: (value: number) => void) => {
  return Array.from({ length: 5 }, (_, index) => {
    const value = index + 1;
    const isFilled = value <= rating;

    return (
      <button
        key={value}
        type="button"
        className="btn btn-link p-0 border-0"
        onClick={() => onPick(value)}
        aria-label={`Chọn ${value} sao`}
        style={{ cursor: "pointer" }}
      >
        <i className={`bi ${isFilled ? "bi-star-fill" : "bi-star"} text-warning`}></i>
      </button>
    );
  });
};

const ReviewTab = ({ audioId }: ReviewTabProps) => {
  const authContext = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [reviews, setReviews] = useState<AudioTrackReviewItemResponse[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [starCounts, setStarCounts] = useState<Record<number, number>>({
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  });
  const [myReview, setMyReview] = useState<AudioTrackReviewItemResponse | null>(null);
  const [canReview, setCanReview] = useState(false);
  const [draftRating, setDraftRating] = useState(5);
  const [draftComment, setDraftComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [visibleCount, setVisibleCount] = useState(REVIEWS_PAGE_SIZE);

  const loadReviews = useCallback(async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);

      const response = await getReviewsByAudioTrack(audioId);
      const responseMyReview = response.myReview ?? null;

      setReviews(response.reviews ?? []);
      setAverageRating(response.summary?.averageRating ?? 0);
      setReviewCount(response.summary?.reviewCount ?? 0);
      setStarCounts({
        1: response.summary?.oneStarCount ?? 0,
        2: response.summary?.twoStarCount ?? 0,
        3: response.summary?.threeStarCount ?? 0,
        4: response.summary?.fourStarCount ?? 0,
        5: response.summary?.fiveStarCount ?? 0,
      });
      setMyReview(responseMyReview);
      setCanReview(response.canReview ?? false);

      if (responseMyReview) {
        setDraftRating(responseMyReview.rating);
        setDraftComment(responseMyReview.comment ?? "");
      } else {
        setDraftRating(5);
        setDraftComment("");
      }
    } catch (error) {
      console.error("Không tải được đánh giá bài hát:", error);
      setErrorMessage("Không tải được đánh giá. Vui lòng thử lại.");
      setReviews([]);
      setAverageRating(0);
      setReviewCount(0);
      setStarCounts({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });
      setMyReview(null);
      setCanReview(false);
    } finally {
      setIsLoading(false);
    }
  }, [audioId]);

  useEffect(() => {
    setVisibleCount(REVIEWS_PAGE_SIZE);
  }, [audioId]);

  useEffect(() => {
    void loadReviews();
  }, [loadReviews]);

  const mergedReviews = useMemo(() => {
    if (!myReview) {
      return reviews;
    }

    if (reviews.some((item) => item.reviewId === myReview.reviewId)) {
      return reviews;
    }

    return [myReview, ...reviews];
  }, [myReview, reviews]);

  const displayedReviews = useMemo(
    () => mergedReviews.slice(0, visibleCount),
    [mergedReviews, visibleCount],
  );

  const hasMoreReviews = mergedReviews.length > visibleCount;
  const isLoggedIn = Boolean(authContext?.user);

  const handleSubmitReview = async () => {
    if (!canReview) {
      return;
    }

    const trimmedComment = draftComment.trim();
    if (!trimmedComment) {
      setErrorMessage("Vui lòng nhập nội dung bình luận trước khi gửi đánh giá.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      await submitReview(audioId, {
        rating: draftRating,
        comment: trimmedComment,
      });

      setSuccessMessage("Đánh giá của bạn đã được ghi nhận.");
      await loadReviews();
    } catch (error) {
      console.error("Không thể gửi đánh giá:", error);
      setErrorMessage("Không thể gửi đánh giá lúc này. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="tab-pane fade"
      id="ecommerce-product-details-5-customer-reviews"
    >
      <div className="reviews-content">
        <div className="reviews-header">
          <div className="rating-overview">
            <div className="average-score">
              <div className="score-display">{averageRating.toFixed(1)}</div>
              <div className="score-stars">{renderDisplayStars(averageRating)}</div>
              <div className="total-reviews">{reviewCount} đánh giá của khách hàng</div>
            </div>

            <div className="rating-distribution">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = starCounts[star] ?? 0;
                const progressWidth = reviewCount > 0 ? `${(count / reviewCount) * 100}%` : "0%";

                return (
                  <div className="rating-row" key={star}>
                    <span className="stars-label">{star}★</span>
                    <div className="progress-container">
                      <div className="progress-fill" style={{ width: progressWidth }}></div>
                    </div>
                    <span className="count-label">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="write-review-cta">
            <h4>Chia sẻ trải nghiệm của bạn</h4>
            {!isLoggedIn ? (
              <>
                <p>Đăng nhập để gửi đánh giá cho sản phẩm này.</p>
                <Link to="/login" className="btn review-btn">
                  Đăng nhập để đánh giá
                </Link>
              </>
            ) : !canReview ? (
              <p>Bạn cần mua sản phẩm này trước khi gửi đánh giá.</p>
            ) : (
              <>
                <p>{myReview ? "Bạn có thể cập nhật đánh giá của mình." : "Giúp người khác chọn đúng sản phẩm."}</p>
                <div className="d-flex justify-content-center gap-2 mb-3">
                  {renderInputStars(draftRating, setDraftRating)}
                </div>
                <textarea
                  className="form-control mb-3"
                  rows={3}
                  maxLength={1000}
                  value={draftComment}
                  onChange={(event) => setDraftComment(event.target.value)}
                  placeholder="Nội dung đánh giá của bạn"
                />
                <button
                  type="button"
                  className="btn review-btn"
                  onClick={handleSubmitReview}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Đang gửi..." : myReview ? "Cập nhật đánh giá" : "Gửi đánh giá"}
                </button>
              </>
            )}
          </div>
        </div>

        {errorMessage ? (
          <div className="alert alert-warning" role="alert">
            {errorMessage}
          </div>
        ) : null}

        {successMessage ? (
          <div className="alert alert-success" role="alert">
            {successMessage}
          </div>
        ) : null}

        <div className="customer-reviews-list">
          {isLoading ? (
            <div className="review-card text-center">
              <div className="spinner-border text-primary mb-3" role="status" aria-hidden="true"></div>
              <p className="mb-0">Đang tải đánh giá...</p>
            </div>
          ) : displayedReviews.length === 0 ? (
            <div className="review-card text-center">
              <p className="mb-0">Chưa có đánh giá nào cho sản phẩm này.</p>
            </div>
          ) : (
            displayedReviews.map((review) => (
              <div className="review-card" key={review.reviewId}>
                <div className="reviewer-profile">
                  <img
                    src={resolveMediaUrl(review.userAvatarUrl)}
                    alt={review.userName}
                    className="profile-pic"
                    loading="lazy"
                    onError={(event) => {
                      event.currentTarget.src = FALLBACK_AVATAR;
                    }}
                  />
                  <div className="profile-details">
                    <div className="customer-name">{review.userName}</div>
                    <div className="review-meta">
                      <div className="review-stars">{renderDisplayStars(review.rating)}</div>
                      <span className="review-date">{formatDateTime(review.updatedAt)}</span>
                    </div>
                  </div>
                </div>
                <h5 className="review-headline">Đánh giá {review.rating}.0 sao</h5>
                <div className="review-text">
                  <p>{review.comment || "Người dùng chưa để lại bình luận."}</p>
                </div>
                {review.mine ? (
                  <div className="review-actions">
                    <button type="button" className="action-btn" disabled>
                      <i className="bi bi-person-check"></i> Đánh giá của bạn
                    </button>
                  </div>
                ) : null}
              </div>
            ))
          )}

          {hasMoreReviews ? (
            <div className="load-more-section">
              <button
                type="button"
                className="btn load-more-reviews"
                onClick={() => setVisibleCount((prev) => prev + REVIEWS_PAGE_SIZE)}
              >
                Xem thêm đánh giá
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default ReviewTab;
