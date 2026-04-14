import type { AudioTrackModel } from "../models/AudioTrackModel";
import type { AudioTrackPageResponse } from "../models/AudioTrackPageResponse";
import axiosClient from "./axiosClient";

export const getAllAudioTracks = async (): Promise<AudioTrackModel[]> => {
    const response = await axiosClient.get("/audio-tracks");
    return response.data;
}

export const getTracksByGenre = async (idGenre: number, page: number): Promise<AudioTrackPageResponse> => {
    const response = await axiosClient.get(`/audio-tracks/genre/${idGenre}`, {params: {page}});
    return response.data;
}

export const getTracksByMood = async (idMood: number, page: number): Promise<AudioTrackPageResponse> => {
    const response = await axiosClient.get(`/audio-tracks/mood/${idMood}`, {params: {page}});
    return response.data;
}

export const getTracksByTheme = async (idTheme: number, page: number): Promise<AudioTrackPageResponse> => {
    const response = await axiosClient.get(`/audio-tracks/theme/${idTheme}`, {params: {page}});
    return response.data;
}