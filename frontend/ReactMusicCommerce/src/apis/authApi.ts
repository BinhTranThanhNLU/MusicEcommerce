import axiosClient from "./axiosClient";
import type { LoginRequest } from "../requestmodel/LoginRequest";
import type { GoogleLoginRequest } from "../requestmodel/GoogleLoginRequest";
import type { LoginResponse } from "../responsemodel/LoginResponse";
import type { RegisterRequest } from "../requestmodel/RegisterRequest";
import type { ForgotPasswordRequest } from "../requestmodel/ForgotPasswordRequest";
import type { ResetPasswordRequest } from "../requestmodel/ResetPasswordRequest";

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

export const forgotPassword = async (data: ForgotPasswordRequest): Promise<string> => {
    const response = await axiosClient.post<string>("/auth/forgot-password", data);
    return response.data;
};

export const resetPassword = async (data: ResetPasswordRequest): Promise<string> => {
    const response = await axiosClient.post<string>("/auth/reset-password", data);
    return response.data;
};