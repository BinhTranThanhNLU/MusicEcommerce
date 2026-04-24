export interface ReviewSummaryResponse {
  averageRating: number;
  reviewCount: number;
  fiveStarCount: number;
  fourStarCount: number;
  threeStarCount: number;
  twoStarCount: number;
  oneStarCount: number;
}

export interface AudioTrackReviewItemResponse {
  reviewId: number;
  audioId: number;
  audioTitle: string;
  coverImage: string | null;
  userId: number;
  userName: string;
  userAvatarUrl: string | null;
  rating: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
  mine: boolean;
}

export interface AudioTrackReviewResponse {
  summary: ReviewSummaryResponse;
  reviews: AudioTrackReviewItemResponse[];
  myReview: AudioTrackReviewItemResponse | null;
  canReview: boolean;
}