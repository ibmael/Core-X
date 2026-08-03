import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'auth';

import { AuthHeader } from '../../../../shared/components/auth-header/auth-header';
import { SharedButton } from '../../../../shared/components/shared-button/shared-button';
import { AuthFooterLink } from '../../../../shared/components/auth-footer-link/auth-footer-link';
import { AuthErrorBanner } from '../../../../shared/components/auth-error-banner/auth-error-banner';
import { SharedInput } from '../../../../shared/components/shared-input/shared-input';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AuthHeader,
    SharedButton,
    AuthFooterLink,
    AuthErrorBanner,
    SharedInput,
  ],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  registerForm: FormGroup;
  loading = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  get emailControl() {
    return this.registerForm.get('email');
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const email = this.registerForm.value.email;
    this.loading = true;
    this.errorMessage = null;

    this.authService.sendEmailVerification({ email }).subscribe({
      next: () => {
        this.authService.setStoredEmail(email);
        this.loading = false;
        this.router.navigate(['/auth/otp']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage =
          err?.error?.message || err?.message || 'Failed to send verification code.';
      },
    });
  }
}
