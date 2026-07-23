import { HttpErrorResponse, HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
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

@Injectable({
  providedIn: 'root',
})
export class AuthService extends IAuthService {
  constructor(
    private http: HttpClient,
    @Inject(API_URL) private apiUrl: string,
  ) {
    super();
  }
  private handleError(error: HttpErrorResponse) {
    return throwError(() => error);
  }
  override sendEmailVerification(request: SendEmailRequest): Observable<OtpResponse> {
    return this.http
      .post<OtpResponse>(`${this.apiUrl}${AuthApi.SEND_EMAIL_VERIFICATION}`, request)
      .pipe(catchError(this.handleError));
  }

  override confirmEmailVerification(request: ConfirmEmailRequest): Observable<MessageResponse> {
    return this.http
      .post<MessageResponse>(`${this.apiUrl}${AuthApi.CONFIRM_EMAIL_VERIFICATION}`, request)
      .pipe(catchError(this.handleError));
  }

  override register(request: RegisterRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}${AuthApi.REGISTER}`, request)
      .pipe(catchError(this.handleError));
  }

  override login(request: LoginRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}${AuthApi.LOGIN}`, request)
      .pipe(catchError(this.handleError));
  }

  override forgotPassword(request: ForgotPasswordRequest): Observable<ForgotPasswordResponse> {
    return this.http
      .post<ForgotPasswordResponse>(`${this.apiUrl}${AuthApi.FORGOT_PASSWORD}`, request)
      .pipe(catchError(this.handleError));
  }

  override resetPassword(request: ResetPasswordRequest): Observable<MessageResponse> {
    return this.http
      .post<MessageResponse>(`${this.apiUrl}${AuthApi.RESET_PASSWORD}`, request)
      .pipe(catchError(this.handleError));
  }
}
