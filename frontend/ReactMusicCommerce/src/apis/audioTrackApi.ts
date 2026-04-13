import type { AudioTrackModel } from "../models/AudioTrackModel";
import axiosClient from "./axiosClient";

export const getAllAudioTracks = async (): Promise<AudioTrackModel[]> => {
    const response = await axiosClient.get("/audio-tracks");
    return response.data;
}