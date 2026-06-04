export interface SendOtpResponse {
    message: string;
    email: string;
    expiresInMinutes: number;
}