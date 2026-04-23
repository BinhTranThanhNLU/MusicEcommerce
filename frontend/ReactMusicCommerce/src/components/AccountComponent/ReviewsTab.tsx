import { useEffect, useMemo, useState } from "react";
import { getMyReviews, submitReview } from "../../apis/reviewApi";
import { getUserLibrary } from "../../apis/userApi";
import type { LibraryItemResponse } from "../../responsemodel/LibraryItemResponse";
import type { AudioTrackReviewItemResponse } from "../../responsemodel/AudioTrackReviewResponse";

type ReviewableLibraryItem = LibraryItemResponse & {
  reviewUpdatedAt?: string | null;
};

const FALLBACK_COVER_IMAGE = "/assets/img/product/product-1.webp";

const formatDateTime = (value: string | null) => {
  if (!value) {
    return "Không xác định";
  }

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
};

const resolveMediaUrl = (path: string | null) => {
  if (!path) {
    return FALLBACK_COVER_IMAGE;
  }

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  if (path.startsWith("/")) {
    return `http://localhost:8080${path}`;
  }

  return `http://localhost:8080/${path}`;
};

const renderStars = (rating: number, onPick?: (value: number) => void) => {
  return Array.from({ length: 5 }, (_, index) => {
    const value = index + 1;
    const isFilled = value <= rating;

    return (
      <button
        key={value}
        type="button"
        className="btn btn-link p-0 border-0"
        onClick={onPick ? () => onPick(value) : undefined}
        disabled={!onPick}
        aria-label={`Chọn ${value} sao`}
        style={{ cursor: onPick ? "pointer" : "default" }}
      >
        <i className={`bi ${isFilled ? "bi-star-fill" : "bi-star"} text-warning`}></i>
      </button>
    );
  });
};

const ReviewsTab = () => {
  const [libraryItems, setLibraryItems] = useState<ReviewableLibraryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [editingOrderDetailId, setEditingOrderDetailId] = useState<number | null>(null);
  const [draftRating, setDraftRating] = useState(5);
  const [draftComment, setDraftComment] = useState("");
  const [submittingOrderDetailId, setSubmittingOrderDetailId] = useState<number | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadReviews = async () => {
      try {
        setIsLoading(true);
        setErrorMessage(null);

        const [libraryResult, myReviewsResult] = await Promise.allSettled([
          getUserLibrary(),
          getMyReviews(),
        ]);

        if (!isMounted) {
          return;
        }

        if (libraryResult.status !== "fulfilled") {
          throw libraryResult.reason;
        }

        const myReviews: AudioTrackReviewItemResponse[] =
          myReviewsResult.status === "fulfilled" ? myReviewsResult.value : [];

        const reviewByAudioId = new Map<number, AudioTrackReviewItemResponse>();
        myReviews.forEach((review) => {
          reviewByAudioId.set(review.audioId, review);
        });

        const mergedItems: ReviewableLibraryItem[] = libraryResult.value.map((item) => {
          const fallbackReview = reviewByAudioId.get(item.audioId);

          return {
            ...item,
            reviewId: item.reviewId ?? fallbackReview?.reviewId ?? null,
            reviewRating: item.reviewRating ?? fallbackReview?.rating ?? null,
            reviewComment: item.reviewComment ?? fallbackReview?.comment ?? null,
            reviewSubmitted: item.reviewSubmitted ?? (fallbackReview ? true : false),
            reviewUpdatedAt: fallbackReview?.updatedAt ?? null,
          };
        });

        setLibraryItems(mergedItems);

        if (myReviewsResult.status === "rejected") {
          setErrorMessage("Đã tải thư viện, nhưng chưa đồng bộ được lịch sử đánh giá cũ.");
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage("Không tải được danh sách đánh giá. Vui lòng thử lại.");
          setLibraryItems([]);
        }
        console.error("Failed to load reviewable library items:", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadReviews();

    return () => {
      isMounted = false;
    };
  }, []);

  const hasItems = useMemo(() => libraryItems.length > 0, [libraryItems]);

  const handleStartEdit = (item: ReviewableLibraryItem) => {
    setSuccessMessage(null);
    setEditingOrderDetailId(item.orderDetailId);
    setDraftRating(item.reviewRating && item.reviewRating > 0 ? item.reviewRating : 5);
    setDraftComment(item.reviewComment ?? "");
  };

  const handleCancelEdit = () => {
    setEditingOrderDetailId(null);
    setDraftRating(5);
    setDraftComment("");
  };

  const handleSaveReview = async (item: ReviewableLibraryItem) => {
    if (!draftComment.trim()) {
      setErrorMessage("Vui lòng nhập nội dung bình luận trước khi lưu.");
      return;
    }

    try {
      setErrorMessage(null);
      setSuccessMessage(null);
      setSubmittingOrderDetailId(item.orderDetailId);
      const saved = await submitReview(item.audioId, {
        rating: draftRating,
        comment: draftComment.trim(),
      });

      setLibraryItems((prev) =>
        prev.map((libraryItem) => {
          if (libraryItem.audioId !== item.audioId) {
            return libraryItem;
          }

          return {
            ...libraryItem,
            reviewId: saved.reviewId,
            reviewRating: saved.rating,
            reviewComment: saved.comment,
            reviewSubmitted: true,
            reviewUpdatedAt: saved.updatedAt,
          };
        }),
      );

      setSuccessMessage("Đánh giá đã được lưu thành công.");
      handleCancelEdit();
    } catch (error) {
      const message = error instanceof Error
        ? error.message
        : "Không thể cập nhật đánh giá. Vui lòng thử lại.";
      setErrorMessage(message);
      console.error("Failed to submit review:", error);
    } finally {
      setSubmittingOrderDetailId(null);
    }
  };

  return (
    <div className="tab-pane fade" id="reviews">
      <div className="section-header" data-aos="fade-up">
        <h2>Đánh giá của tôi</h2>
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

      <div className="reviews-grid">
        {isLoading ? (
          <div className="bg-white border rounded-4 p-4 text-center shadow-sm">
            <div className="spinner-border text-primary mb-3" role="status" aria-hidden="true" />
            <p className="mb-0 text-muted">Đang tải đánh giá của bạn...</p>
          </div>
        ) : !hasItems ? (
          <div className="bg-white border rounded-4 p-4 text-center shadow-sm">
            <i className="bi bi-chat-square-text fs-1 text-muted d-block mb-3"></i>
            <h5 className="mb-2">Chưa có bài nào trong thư viện</h5>
            <p className="text-muted mb-0">Sau khi mua nhạc, bạn có thể vào đây để đánh giá.</p>
          </div>
        ) : (
          libraryItems.map((item, index) => {
            const isEditing = editingOrderDetailId === item.orderDetailId;
            const isSubmitting = submittingOrderDetailId === item.orderDetailId;
            const currentRating = item.reviewRating && item.reviewRating > 0 ? item.reviewRating : 0;
            const isReviewed = Boolean(item.reviewSubmitted) || currentRating > 0;

            return (
              <div
                key={item.orderDetailId}
                className="review-card p-3 border rounded mb-3 bg-white shadow-sm"
                data-aos="fade-up"
                data-aos-delay={100 + index * 100}
              >
                <div className="review-header d-flex mb-3">
                  <img
                    src={resolveMediaUrl(item.coverImage)}
                    alt={item.title}
                    className="rounded"
                    width="60"
                    height="60"
                    loading="lazy"
                    style={{ objectFit: "cover" }}
                    onError={(event) => {
                      event.currentTarget.src = FALLBACK_COVER_IMAGE;
                    }}
                  />
                  <div className="ms-3 review-meta flex-grow-1">
                    <h5 className="mb-1">{item.title}</h5>
                    <p className="text-muted small mb-1">Nghệ sĩ: {item.artistName}</p>
                    <div className="d-flex align-items-center gap-2 rating text-warning">
                      {isEditing ? renderStars(draftRating, setDraftRating) : renderStars(currentRating)}
                      <span className="text-dark ms-1">
                        {isEditing
                          ? `(${draftRating}.0)`
                          : isReviewed
                            ? `(${currentRating}.0)`
                            : "(Chưa đánh giá)"}
                      </span>
                    </div>
                    <small className="text-muted">
                      {item.reviewUpdatedAt
                        ? `Đánh giá lúc ${formatDateTime(item.reviewUpdatedAt)}`
                        : `Mua lúc ${formatDateTime(item.purchasedAt)}`}
                    </small>
                  </div>
                </div>

                <div className="review-content">
                  {isEditing ? (
                    <textarea
                      className="form-control"
                      rows={4}
                      maxLength={1000}
                      value={draftComment}
                      onChange={(event) => setDraftComment(event.target.value)}
                      placeholder="Chia sẻ cảm nhận của bạn về bản nhạc..."
                    />
                  ) : (
                    <p className="mb-0">{item.reviewComment || "(Chưa có bình luận)"}</p>
                  )}
                </div>

                <div className="review-footer d-flex justify-content-end gap-2 mt-3">
                  {isEditing ? (
                    <>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary"
                        onClick={handleCancelEdit}
                        disabled={isSubmitting}
                      >
                        Hủy
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-primary"
                        onClick={() => handleSaveReview(item)}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Đang lưu..." : "Lưu đánh giá"}
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => handleStartEdit(item)}
                    >
                      {isReviewed ? "Chỉnh sửa đánh giá" : "Viết đánh giá"}
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ReviewsTab;
