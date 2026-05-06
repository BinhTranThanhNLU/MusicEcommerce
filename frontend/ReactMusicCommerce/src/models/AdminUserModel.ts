export interface AdminUserModel {
  id: number;
  name: string;
  email: string;
  avatarUrl: string | null;
  role: string;
  isActive: boolean;
  createdAt: string;
}