import axiosClient from "./axiosClient";
import type { LoginRequest } from "../requestmodel/LoginRequest";
import type { GoogleLoginRequest } from "../requestmodel/GoogleLoginRequest";
import type { LoginResponse } from "../responsemodel/LoginResponse";
import type { RegisterRequest } from "../requestmodel/RegisterRequest";

export const loginWithEmail = async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await axiosClient.post<LoginResponse>("/auth/login", data);
    return response.data;
};

export const loginWithGoogleToken = async (data: GoogleLoginRequest): Promise<LoginResponse> => {
    const response = await axiosClient.post<LoginResponse>("/auth/google", data);
    return response.data;
};

export const registerUser = async (data: RegisterRequest): Promise<string> => {
    const response = await axiosClient.post<string>("/auth/register", data);
    return response.data;
};