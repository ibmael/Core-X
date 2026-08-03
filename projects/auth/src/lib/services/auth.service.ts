import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { catchError, map, Observable, throwError } from 'rxjs';

import { IAuthService } from '../abstract/auth.abstract';
import { AuthApi } from '../api/auth-api';
import { API_URL } from '../tokens/api-url.token';

import { SendEmailRequest } from '../models/requests/send-email.request';
import { ConfirmEmailRequest } from '../models/requests/confirm-email.request';
import { RegisterRequest } from '../models/requests/register.request';
import { LoginRequest } from '../models/requests/login.request';
import { ForgotPasswordRequest } from '../models/requests/forgot-password.request';
import { ResetPasswordRequest } from '../models/requests/reset-password.request';
import { UpdateProfileRequest } from '../models/requests/update-profile.request';
import { AuthResponse } from '../models/responses/auth.response';
import { OtpResponse } from '../models/responses/otp.response';
import { MessageResponse } from '../models/responses/message.response';
import { ForgotPasswordResponse } from '../models/responses/forgot-password.response';
import { ProfileResponse } from '../models/responses/profile.response';
import { AuthUser } from '../models/responses/auth-user.response';

const TOKEN_KEY = 'auth_token';
const PENDING_EMAIL_KEY = 'auth_pending_email';
const PENDING_INFO_KEY = 'auth_pending_info';

@Injectable({
  providedIn: 'root',
})
export class AuthService extends IAuthService {
  constructor(
    private http: HttpClient,
    @Inject(API_URL) private apiUrl: string,
    @Inject(PLATFORM_ID) private platformId: object,
  ) {
    super();
  }

  // error handling
  private handleError = (error: HttpErrorResponse) => throwError(() => error);

  // ─── Token Storage (SSR-safe) ────────────────────────────────────────────────

  saveToken(token: string): void {
    this.storeToken(token);
  }

  storeToken(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      if (
        token &&
        typeof token === 'string' &&
        token !== 'undefined' &&
        token !== 'null' &&
        token.trim() !== ''
      ) {
        localStorage.setItem(TOKEN_KEY, token.trim());
      } else {
        localStorage.removeItem(TOKEN_KEY);
      }
    }
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      const val = localStorage.getItem(TOKEN_KEY);
      if (!val || val === 'undefined' || val === 'null' || val.trim() === '') {
        return null;
      }
      return val.trim();
    }
    return null;
  }

  removeToken(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(TOKEN_KEY);
    }
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(TOKEN_KEY);
      sessionStorage.removeItem(PENDING_EMAIL_KEY);
      sessionStorage.removeItem(PENDING_INFO_KEY);
    }
  }

  // ─── Register Flow ────────────────

  setStoredEmail(email: string): void {
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.setItem(PENDING_EMAIL_KEY, email);
    }
  }

  getStoredEmail(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return sessionStorage.getItem(PENDING_EMAIL_KEY);
    }
    return null;
  }

  clearStoredEmail(): void {
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.removeItem(PENDING_EMAIL_KEY);
    }
  }

  setStoredRegisterInfo(info: {
    firstName: string;
    lastName: string;
    username: string;
    phone: string;
  }): void {
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.setItem(PENDING_INFO_KEY, JSON.stringify(info));
    }
  }

  getStoredRegisterInfo(): {
    firstName: string;
    lastName: string;
    username: string;
    phone: string;
  } | null {
    if (isPlatformBrowser(this.platformId)) {
      const data = sessionStorage.getItem(PENDING_INFO_KEY);
      if (!data) return null;
      try {
        return JSON.parse(data);
      } catch {
        sessionStorage.removeItem(PENDING_INFO_KEY);
        return null;
      }
    }
    return null;
  }

  clearStoredRegisterInfo(): void {
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.removeItem(PENDING_INFO_KEY);
    }
  }

  // ─── API Calls ───────────────────────────────────────────────────────────────

  // send email verification
  override sendEmailVerification(request: SendEmailRequest): Observable<OtpResponse> {
    return this.http
      .post<OtpResponse>(`${this.apiUrl}${AuthApi.SEND_EMAIL_VERIFICATION}`, request)
      .pipe(catchError(this.handleError));
  }
  // confirm email verification
  override confirmEmailVerification(request: ConfirmEmailRequest): Observable<MessageResponse> {
    return this.http
      .post<MessageResponse>(`${this.apiUrl}${AuthApi.CONFIRM_EMAIL_VERIFICATION}`, request)
      .pipe(catchError(this.handleError));
  }

  // register
  override register(request: RegisterRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}${AuthApi.REGISTER}`, request)
      .pipe(catchError(this.handleError));
  }

  // login
  override login(request: LoginRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}${AuthApi.LOGIN}`, request)
      .pipe(catchError(this.handleError));
  }

  // forgot password
  override forgotPassword(request: ForgotPasswordRequest): Observable<ForgotPasswordResponse> {
    return this.http
      .post<ForgotPasswordResponse>(`${this.apiUrl}${AuthApi.FORGOT_PASSWORD}`, request)
      .pipe(catchError(this.handleError));
  }

  // reset password
  override resetPassword(request: ResetPasswordRequest): Observable<MessageResponse> {
    return this.http
      .post<MessageResponse>(`${this.apiUrl}${AuthApi.RESET_PASSWORD}`, request)
      .pipe(catchError(this.handleError));
  }

  // get profile
  override getProfile(): Observable<ProfileResponse> {
    return this.http.get<ProfileResponse | { payload?: { user?: AuthUser }; user?: AuthUser }>(
      `${this.apiUrl}${AuthApi.PROFILE}`,
    ).pipe(
      map((res) => {
        const user =
          (res as ProfileResponse)?.user ??
          (res as { payload?: { user?: AuthUser } })?.payload?.user;
        if (!user) {
          throw new HttpErrorResponse({
            status: 500,
            statusText: 'Invalid profile response',
            url: `${this.apiUrl}${AuthApi.PROFILE}`,
          });
        }
        return { user };
      }),
      catchError(this.handleError),
    );
  }

  // update profile
  override updateProfile(request: UpdateProfileRequest): Observable<ProfileResponse> {
    return this.http.patch<ProfileResponse | { payload?: { user?: AuthUser }; user?: AuthUser }>(
      `${this.apiUrl}${AuthApi.PROFILE}`,
      request,
    ).pipe(
      map((res) => {
        const user =
          (res as ProfileResponse)?.user ??
          (res as { payload?: { user?: AuthUser } })?.payload?.user;
        if (!user) {
          throw new HttpErrorResponse({
            status: 500,
            statusText: 'Invalid profile response',
            url: `${this.apiUrl}${AuthApi.PROFILE}`,
          });
        }
        return { user };
      }),
      catchError(this.handleError),
    );
  }
}
