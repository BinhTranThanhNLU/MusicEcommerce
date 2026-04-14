import type { ThemeModel } from "../models/ThemeModel";
import axiosClient from "./axiosClient";

export const getAllThemes = async (): Promise<ThemeModel[]> => {
  const response = await axiosClient.get("/themes");
  return response.data;
};