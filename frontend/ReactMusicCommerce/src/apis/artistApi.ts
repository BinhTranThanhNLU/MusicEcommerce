import type { ArtistModel } from "../models/ArtistModel";
import axiosClient from "./axiosClient";

export const getAllArtists = async (): Promise<ArtistModel[]> => {
  const response = await axiosClient.get("/artists");
  return response.data;
};