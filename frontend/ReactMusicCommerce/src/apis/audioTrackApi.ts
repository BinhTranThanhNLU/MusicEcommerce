import type { AudioTrackModel } from "../models/AudioTrackModel";
import type { AudioTrackPageResponse } from "../responsemodel/AudioTrackPageResponse";
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