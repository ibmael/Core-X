import { Observable } from 'rxjs';

import { LoginRequest } from '../models/requests/login.request';
import { RegisterRequest } from '../models/requests/register.request';
import { SendEmailRequest } from '../models/requests/send-email.request';
import { ConfirmEmailRequest } from '../models/requests/confirm-email.request';
import { ForgotPasswordRequest } from '../models/requests/forgot-password.request';
import { ResetPasswordRequest } from '../models/requests/reset-password.request';
import { AuthResponse } from '../models/responses/auth.response';
import { OtpResponse } from '../models/responses/otp.response';
import { MessageResponse } from '../models/responses/message.response';
import { ForgotPasswordResponse } from '../models/responses/forgot-password.response';

export abstract class IAuthService {
  abstract sendEmailVerification(request: SendEmailRequest): Observable<OtpResponse>;

  abstract confirmEmailVerification(request: ConfirmEmailRequest): Observable<MessageResponse>;

  abstract register(request: RegisterRequest): Observable<AuthResponse>;

  abstract login(request: LoginRequest): Observable<AuthResponse>;

  abstract forgotPassword(request: ForgotPasswordRequest): Observable<ForgotPasswordResponse>;

  abstract resetPassword(request: ResetPasswordRequest): Observable<MessageResponse>;
}
