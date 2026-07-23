import { AuthUser } from './auth-user.response';

export interface AuthResponse {
  user: AuthUser;

  token: string;
}
