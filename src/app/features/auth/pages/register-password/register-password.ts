import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  AuthService,
  AuthAdapterService,
  passwordValidator,
  matchValidator,
  RegisterRequest,
} from 'auth';

import { SharedSteps } from '../../../../shared/components/shared-steps/shared-steps';
import { AuthHeader } from '../../../../shared/components/auth-header/auth-header';
import { AuthErrorBanner } from '../../../../shared/components/auth-error-banner/auth-error-banner';
import { SharedButton } from '../../../../shared/components/shared-button/shared-button';
import { SharedPassword } from '../../../../shared/components/shared-password/shared-password';
import { UserStateService } from '../../../../core/services/user-state.service';

@Component({
  selector: 'app-register-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedSteps,
    AuthHeader,
    AuthErrorBanner,
    SharedButton,
    SharedPassword,
  ],
  templateUrl: './register-password.html',
  styleUrl: './register-password.css',
})
export class RegisterPassword implements OnInit {
  passwordForm: FormGroup;
  loading = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private authAdapter: AuthAdapterService,
    private userStateService: UserStateService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: object,
  ) {
    this.passwordForm = this.fb.group(
      {
        password: ['', [Validators.required, passwordValidator()]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: matchValidator('password', 'confirmPassword') },
    );
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const email = this.authService.getStoredEmail();
      const info = this.authService.getStoredRegisterInfo();
      if (!email || !info) {
        this.router.navigate(['/auth/register']);
      }
    }
  }

  get passwordControl() {
    return this.passwordForm.get('password');
  }

  get confirmPasswordControl() {
    return this.passwordForm.get('confirmPassword');
  }

  onSubmit(): void {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    const email = this.authService.getStoredEmail();
    const info = this.authService.getStoredRegisterInfo();

    if (!email || !info) {
      this.errorMessage = 'Missing registration information. Please start registration again.';
      return;
    }

    const payload: RegisterRequest = {
      email,
      firstName: info.firstName,
      lastName: info.lastName,
      username: info.username,
      phone: info.phone,
      password: this.passwordForm.value.password,
      confirmPassword: this.passwordForm.value.confirmPassword,
    };

    this.loading = true;
    this.errorMessage = null;

    this.authService.register(payload).subscribe({
      next: (res) => {
        const user = this.authAdapter.adapt(res);
        if (user) {
          this.userStateService.setUser(user);
        }
        this.authService.clearStoredEmail();
        this.authService.clearStoredRegisterInfo();
        this.loading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage =
          err?.error?.message || err?.message || 'Registration failed. Please try again.';
      },
    });
  }
}
