import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'auth';

import { SharedOtp } from '../../../../shared/components/shared-otp/shared-otp';
import { SharedSteps } from '../../../../shared/components/shared-steps/shared-steps';
import { AuthErrorBanner } from '../../../../shared/components/auth-error-banner/auth-error-banner';
import { SharedButton } from '../../../../shared/components/shared-button/shared-button';
import { AuthHeader } from '../../../../shared/components/auth-header/auth-header';

@Component({
  selector: 'app-otp',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    SharedOtp,
    SharedSteps,
    AuthErrorBanner,
    SharedButton,
    AuthHeader,
  ],
  templateUrl: './otp.html',
  styleUrl: './otp.css',
})
export class OTP implements OnInit, OnDestroy {
  email: string = '';
  otpForm: FormGroup;
  loading = false;
  errorMessage: string | null = null;
  resendLoading = false;
  timerCount = 60;
  timerInterval: any;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: object,
  ) {
    this.otpForm = this.fb.group({
      code: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get otpControl(): FormControl {
    return this.otpForm.get('code') as FormControl;
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const storedEmail = this.authService.getStoredEmail();
      if (!storedEmail) {
        this.router.navigate(['/auth/register']);
        return;
      }
      this.email = storedEmail;
      this.startTimer();
    }
  }

  ngOnDestroy(): void {
    this.clearTimer();
  }

  startTimer(): void {
    this.clearTimer();
    this.timerCount = 60;
    this.timerInterval = setInterval(() => {
      if (this.timerCount > 0) {
        this.timerCount--;
      } else {
        this.clearTimer();
      }
    }, 1000);
  }

  clearTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  onResendCode(): void {
    if (this.timerCount > 0 || this.resendLoading) return;

    this.resendLoading = true;
    this.errorMessage = null;

    this.authService.sendEmailVerification({ email: this.email }).subscribe({
      next: () => {
        this.resendLoading = false;
        this.startTimer();
      },
      error: (err) => {
        this.resendLoading = false;
        this.errorMessage = err?.error?.message || err?.message || 'Failed to resend code.';
      },
    });
  }

  onVerify(): void {
    if (this.loading) return;

    const rawVal = this.otpControl.value;
    const codeStr = rawVal != null ? String(rawVal) : '';

    if (codeStr.length < 6) {
      this.otpControl.markAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = null;

    this.authService
      .confirmEmailVerification({ email: this.email, code: codeStr })
      .subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/auth/register-info']);
        },
        error: (err) => {
          this.loading = false;
          this.errorMessage =
            err?.error?.message || err?.message || 'Invalid or expired OTP code.';
        },
      });
  }
}
