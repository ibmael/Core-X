import { Injectable } from '@angular/core';

import { Adaptor } from '../interfaces/adaptor.interface';
import { AuthResponse } from '../models/responses/auth.response';
import { AuthUser } from '../models/responses/auth-user.response';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthAdapterService implements Adaptor<AuthResponse, AuthUser> {
  constructor(private authService: AuthService) {}

  adapt(response: AuthResponse): AuthUser {
    const token = response?.payload?.token || response?.token;

    if (token && typeof token === 'string' && token.trim() !== '') {
      this.authService.storeToken(token.trim());
    }

    const user = response?.payload?.user || response?.user;
    return user as AuthUser;
  }
}
