import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { catchError, Observable, throwError } from 'rxjs';

import { IAuthService } from '../abstract/auth.abstract';
import { AuthApi } from '../api/auth-api';
import { API_URL } from '../tokens/api-url.token';

import { SendEmailRequest } from '../models/requests/send-email.request';
import { ConfirmEmailRequest } from '../models/requests/confirm-email.request';
import { RegisterRequest } from '../models/requests/register.request';
import { LoginRequest } from '../models/requests/login.request';
import { ForgotPasswordRequest } from '../models/requests/forgot-password.request';
import { ResetPasswordRequest } from '../models/requests/reset-password.request';
import { AuthResponse } from '../models/responses/auth.response';
import { OtpResponse } from '../models/responses/otp.response';
import { MessageResponse } from '../models/responses/message.response';
import { ForgotPasswordResponse } from '../models/responses/forgot-password.response';

const TOKEN_KEY = 'auth_token';
const PENDING_EMAIL_KEY = 'auth_pending_email';

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

  storeToken(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(TOKEN_KEY, token);
    }
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(TOKEN_KEY);
    }
    return null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(TOKEN_KEY);
      sessionStorage.removeItem(PENDING_EMAIL_KEY);
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
}
