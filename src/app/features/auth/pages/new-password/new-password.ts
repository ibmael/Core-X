import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService, passwordValidator, matchValidator } from 'auth';

import { SharedButton } from '../../../../shared/components/shared-button/shared-button';
import { SharedPassword } from '../../../../shared/components/shared-password/shared-password';
import { AuthErrorBanner } from '../../../../shared/components/auth-error-banner/auth-error-banner';

@Component({
  selector: 'app-new-password',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    SharedButton,
    SharedPassword,
    AuthErrorBanner,
  ],
  templateUrl: './new-password.html',
  styleUrl: './new-password.css',
})
export class NewPassword implements OnInit {
  newPasswordForm: FormGroup;
  loading = false;
  errorMessage: string | null = null;
  token: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.newPasswordForm = this.fb.group(
      {
        newPassword: ['', [Validators.required, passwordValidator()]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: matchValidator('newPassword', 'confirmPassword') },
    );
  }

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParams['token'] || '';
  }

  get newPasswordControl() {
    return this.newPasswordForm.get('newPassword');
  }

  get confirmPasswordControl() {
    return this.newPasswordForm.get('confirmPassword');
  }

  onSubmit(): void {
    if (this.newPasswordForm.invalid) {
      this.newPasswordForm.markAllAsTouched();
      return;
    }

    const { newPassword, confirmPassword } = this.newPasswordForm.value;
    this.loading = true;
    this.errorMessage = null;

    this.authService
      .resetPassword({
        token: this.token,
        newPassword,
        confirmPassword,
      })
      .subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/auth/login']);
        },
        error: (err) => {
          this.loading = false;
          this.errorMessage =
            err?.error?.message || err?.message || 'Password reset failed. Please try again.';
        },
      });
  }
}
