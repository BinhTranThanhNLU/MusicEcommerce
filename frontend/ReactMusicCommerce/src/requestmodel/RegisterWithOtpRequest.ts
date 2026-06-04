export interface RegisterWithOtpRequest {
    name: string;
    email: string;
    password: string;
    role: string;
    otp: string;
}