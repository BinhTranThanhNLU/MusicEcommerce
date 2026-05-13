export interface AdminReviewTrendPointDTO {
  label: string;
  reviewCount?: number;
  averageRating?: number;
}

export interface AdminReviewDistributionPointDTO {
  label?: string;
  rating?: number;
  count: number;
  percentage?: number;
}

export interface AdminReviewDashboardDTO {
  period?: string;
  points?: number;
  averageRating?: number;
  totalReviews?: number;
  reviewTrend?: AdminReviewTrendPointDTO[];
  trend?: AdminReviewTrendPointDTO[];
  ratingDistribution?: AdminReviewDistributionPointDTO[];
  starDistribution?: AdminReviewDistributionPointDTO[];
}