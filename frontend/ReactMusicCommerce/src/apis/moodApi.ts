import type { MoodModel } from "../models/MoodModel";
import axiosClient from "./axiosClient";

export const getAllMoods = async (): Promise<MoodModel[]> => {
  const response = await axiosClient.get("/moods");
  return response.data;
};