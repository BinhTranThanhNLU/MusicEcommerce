import type { AudioTrackModel } from "../models/AudioTrackModel";
import type { UpdateAudioTrackRequest } from "../requestmodel/UpdateAudioTrackRequest";
import type { AudioTrackPageResponse } from "../responsemodel/AudioTrackPageResponse";
import type { AudioTrackPlayCountResponse } from "../responsemodel/AudioTrackPlayCountResponse";
import type { CreateAudioTrackRequest } from "../requestmodel/CreateAudioTrackRequest";
import type { AudioTrackDTO } from "../responsemodel/AudioTrackDTO";
import axiosClient from "./axiosClient";

export const getAllAudioTracks = async (): Promise<AudioTrackModel[]> => {
    const response = await axiosClient.get("/audio-tracks");
    return response.data;
}

export const getTracksByGenre = async (idGenre: number,params: any): Promise<AudioTrackPageResponse> => {
  const response = await axiosClient.get(`/audio-tracks/genre/${idGenre}`, {params,});
  return response.data;
};

export const getTracksByMood = async (idMood: number,  params: any): Promise<AudioTrackPageResponse> => {
    const response = await axiosClient.get(`/audio-tracks/mood/${idMood}`, {params});
    return response.data;
}

export const getTracksByTheme = async (idTheme: number, params: any): Promise<AudioTrackPageResponse> => {
    const response = await axiosClient.get(`/audio-tracks/theme/${idTheme}`, {params});
    return response.data;
}

export const getAudioTrackById = async (id: number): Promise<AudioTrackModel> => {
  const response = await axiosClient.get(`/audio-tracks/${id}`);
  return response.data;
};

export const updateAudioTrack = async (
  id: number,
  request: UpdateAudioTrackRequest,
): Promise<AudioTrackModel> => {
  const response = await axiosClient.put(`/audio-tracks/${id}`, request);
  return response.data;
};

export const deleteAudioTrack = async (id: number): Promise<string> => {
  const response = await axiosClient.delete(`/audio-tracks/${id}`);
  return response.data;
};

export const getTracksByArtist = async (artistId: number, params?: any): Promise<AudioTrackPageResponse> => {
  const response = await axiosClient.get(`/audio-tracks/artist/${artistId}`, { params });
  return response.data;
};

export const incrementPreviewPlayCount = async (
  audioId: number,
): Promise<AudioTrackPlayCountResponse> => {
  const response = await axiosClient.post(`/audio-tracks/${audioId}/preview-play`);
  return response.data;
};

export const uploadAudioTrack = async (
  metadata: CreateAudioTrackRequest,
  originalFile: File,
  coverImage: File
): Promise<AudioTrackDTO> => {
  const formData = new FormData();
  formData.append("metadata", new Blob([JSON.stringify(metadata)], { type: "application/json" }));
  formData.append("originalFile", originalFile);
  formData.append("coverImage", coverImage);

  // Thêm cấu hình headers vào đây để ép Axios dùng multipart/form-data
  const response = await axiosClient.post("/audio-tracks/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};