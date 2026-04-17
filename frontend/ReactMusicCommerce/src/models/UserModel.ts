export interface UserModel {
    id: number;
    name: string;
    email: string;
    avatarUrl: string;
    role: string;
    authProvider: string;
    isEmailVerified: boolean;
}