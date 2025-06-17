import { ROLES } from "@/constants/roles";

export interface LoginData {
  login: string;
  password: string;
}

export interface RegistrationUserData {
  login: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  username: string;
  user_role: ROLES;
}
