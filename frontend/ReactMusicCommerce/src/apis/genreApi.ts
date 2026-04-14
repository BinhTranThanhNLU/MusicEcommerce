import type { GenreModel } from "../models/GenreModel";
import axiosClient from "./axiosClient";

export const getAllGenres = async (): Promise<GenreModel[]> => {
  const response = await axiosClient.get("/genres");
  return response.data;
};