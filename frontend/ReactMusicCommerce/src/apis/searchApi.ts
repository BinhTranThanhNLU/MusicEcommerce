import type {
  AudioTrackAdvancedSearchRequest,
  AudioTrackSearchDocument,
  AudioTrackSearchResponse,
} from "../models/Search";
import axiosClient from "./axiosClient";

export const fullTextSearchTracks = async (
  q: string,
  page: number,
  size: number,
): Promise<AudioTrackSearchResponse> => {
  const response = await axiosClient.get("/v1/search/full-text", {
    params: { q, page, size },
  });
  return response.data;
};

export const fuzzySearchTracks = async (
  q: string,
  page: number,
  size: number,
): Promise<AudioTrackSearchResponse> => {
  const response = await axiosClient.get("/v1/search/fuzzy", {
    params: { q, page, size },
  });
  return response.data;
};

export const phraseSearchTracks = async (
  q: string,
  page: number,
  size: number,
): Promise<AudioTrackSearchResponse> => {
  const response = await axiosClient.get("/v1/search/phrase", {
    params: { q, page, size },
  });
  return response.data;
};

export const semanticSearchTracks = async (
  q: string,
  size: number,
): Promise<AudioTrackSearchResponse> => {
  const response = await axiosClient.get("/v1/search/semantic", {
    params: { q, size },
  });
  return response.data;
};

export const melodySearchTracks = async (
  audio: File,
  size: number,
): Promise<AudioTrackSearchResponse> => {
  const formData = new FormData();
  formData.append("audio", audio);

  const response = await axiosClient.post("/v1/search/melody", formData, {
    params: { size },
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const hybridSearchTracks = async (
  q: string,
  page: number,
  size: number,
): Promise<AudioTrackSearchResponse> => {
  const response = await axiosClient.get("/v1/search/hybrid", {
    params: { q, page, size },
  });
  return response.data;
};

export const advancedSearchTracks = async (
  request: AudioTrackAdvancedSearchRequest,
): Promise<AudioTrackSearchResponse> => {
  const response = await axiosClient.post("/v1/search/advanced", request);
  return response.data;
};

export const filterSearchTracks = async (
  request: AudioTrackAdvancedSearchRequest,
): Promise<AudioTrackSearchResponse> => {
  const response = await axiosClient.post("/v1/search/filter", request);
  return response.data;
};

export const autocompleteTrackSearch = async (
  q: string,
  limit = 8,
): Promise<AudioTrackSearchDocument[]> => {
  const response = await axiosClient.get("/v1/search/autocomplete", {
    params: { q, limit },
  });
  return response.data;
};