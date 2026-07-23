import { Role } from '../enums/role.enum';

export interface AuthUser {
  id: string;

  username: string;

  email: string;

  phone: string;

  firstName: string;

  lastName: string;

  profilePhoto: string;

  emailVerified: boolean;

  phoneVerified: boolean;

  role: Role;

  createdAt: string;

  updatedAt: string;
}
