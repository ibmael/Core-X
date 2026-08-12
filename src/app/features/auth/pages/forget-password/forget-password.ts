import { Component, inject, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'auth';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { SharedInput } from '../../../../shared/components/shared-input/shared-input';
import { AuthHeader } from '../../../../shared/components/auth-header/auth-header';
import { AuthErrorBanner } from '../../../../shared/components/auth-error-banner/auth-error-banner';
import { SharedButton } from '../../../../shared/components/shared-button/shared-button';

@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    SharedInput,
    AuthHeader,
    AuthErrorBanner,
    SharedButton,
  ],
  templateUrl: './forget-password.html',
  styleUrl: './forget-password.css',
})
export class ForgetPassword {
  forgetForm: FormGroup;
  loading = false;
  errorMessage: string | null = null;
  private destroyRef = inject(DestroyRef);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.forgetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  get emailControl() {
    return this.forgetForm.get('email');
  }

  onSubmit(): void {
    if (this.forgetForm.invalid) {
      this.forgetForm.markAllAsTouched();
      return;
    }

    const email = this.forgetForm.value.email;
    this.loading = true;
    this.errorMessage = null;

    const redirectUrl =
      typeof window !== 'undefined'
        ? `${window.location.origin}/auth/new-password`
        : 'http://localhost:4200/auth/new-password';

    this.authService.forgotPassword({ email, redirectUrl })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
      next: () => {
        this.authService.setStoredEmail(email);
        this.loading = false;
        this.router.navigate(['/auth/password-reset']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage =
          err?.error?.message || err?.message || 'Failed to request password reset.';
      },
    });
  }
}
