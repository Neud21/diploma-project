import { ROLES } from "@/constants/roles";

export interface IUser {
  username: string | null;
  token: string | null;
  user_role: ROLES;
}
