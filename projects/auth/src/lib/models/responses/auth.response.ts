import { AuthUser } from './auth-user.response';

export interface AuthResponse {
  status?: boolean;
  code?: number;
  message?: string;
  payload?: {
    user: AuthUser;
    token: string;
  };
  user?: AuthUser;
  token?: string;
}
