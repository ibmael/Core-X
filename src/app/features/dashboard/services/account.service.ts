import { Injectable, inject, Inject } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL, SKIP_ERROR } from 'auth';
import {
  ChangePasswordRequest,
  RequestEmailChangeRequest,
  ConfirmEmailChangeRequest,
} from '../models/account.model';

@Injectable({ providedIn: 'root' })
export class AccountService {
  private http = inject(HttpClient);

  constructor(@Inject(API_URL) private apiUrl: string) {}

  private getSkipErrorContext(): HttpContext {
    return new HttpContext().set(SKIP_ERROR, true);
  }

  requestEmailChange(payload: RequestEmailChangeRequest): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.apiUrl}/api/profile/change-email/request`,
      payload,
      { context: this.getSkipErrorContext() },
    );
  }

  confirmEmailChange(payload: ConfirmEmailChangeRequest): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.apiUrl}/api/profile/change-email/confirm`,
      payload,
      { context: this.getSkipErrorContext() },
    );
  }

  changePassword(payload: ChangePasswordRequest): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(
      `${this.apiUrl}/api/profile/change-password`,
      payload,
      { context: this.getSkipErrorContext() },
    );
  }

  deleteAccount(password: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/api/profile/account`, {
      body: { password },
      context: this.getSkipErrorContext(),
    });
  }
}
