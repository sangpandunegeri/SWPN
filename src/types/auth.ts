import { UserRole } from "../config/constants";

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  role: UserRole;
  roleName: string;
  memberId?: string;
  province?: string;
  provinceId?: string;
  cityId?: string;
  cityName?: string;
  isActive: boolean;
  lastLoginAt?: string;
}

export interface AuthSession {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
}
