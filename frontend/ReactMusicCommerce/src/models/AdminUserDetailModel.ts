export interface AdminUserDetailModel {
  id: number;
  name: string;
  email: string;
  avatarUrl: string | null;
  role: string;
  isActive: boolean;
  isEmailVerified: boolean;
  authProvider: string | null;
  providerId: string | null;
  createdAt: string;
  updatedAt: string;
}
