import axiosClient from "./axiosClient";
import type { ReviewRequest } from "../requestmodel/ReviewRequest";
import type {
  AudioTrackReviewItemResponse,
  AudioTrackReviewResponse,
} from "../responsemodel/AudioTrackReviewResponse";

export const getReviewsByAudioTrack = async (audioId: number): Promise<AudioTrackReviewResponse> => {
  const response = await axiosClient.get<AudioTrackReviewResponse>(`/reviews/audio-tracks/${audioId}`);
  return response.data;
};

export const getMyReviews = async (): Promise<AudioTrackReviewItemResponse[]> => {
  const response = await axiosClient.get<AudioTrackReviewItemResponse[]>("/reviews/me");
  return response.data;
};

export const getMyReviewForAudioTrack = async (audioId: number): Promise<AudioTrackReviewItemResponse> => {
  const response = await axiosClient.get<AudioTrackReviewItemResponse>(`/reviews/audio-tracks/${audioId}/me`);
  return response.data;
};

export const submitReview = async (
  audioId: number,
  payload: ReviewRequest,
): Promise<AudioTrackReviewItemResponse> => {
  const response = await axiosClient.post<AudioTrackReviewItemResponse>(
    `/reviews/audio-tracks/${audioId}`,
    payload,
  );
  return response.data;
};