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
    this.authService.storeToken(response.token);
    return response.user;
  }
}
