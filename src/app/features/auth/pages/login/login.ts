import { Component, inject, DestroyRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService, AuthAdapterService } from 'auth';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { AuthHeader } from '../../../../shared/components/auth-header/auth-header';
import { AuthFooterLink } from '../../../../shared/components/auth-footer-link/auth-footer-link';
import { AuthErrorBanner } from '../../../../shared/components/auth-error-banner/auth-error-banner';
import { SharedButton } from '../../../../shared/components/shared-button/shared-button';
import { SharedInput } from '../../../../shared/components/shared-input/shared-input';
import { SharedPassword } from '../../../../shared/components/shared-password/shared-password';

import { UserStateService } from '../../../../core/services/user-state.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    AuthHeader,
    AuthFooterLink,
    AuthErrorBanner,
    SharedButton,
    SharedInput,
    SharedPassword,
  ],
})
export class Login {
  private destroyRef = inject(DestroyRef);

  loginForm: FormGroup;
  loading = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private authAdapter: AuthAdapterService,
    private userStateService: UserStateService,
    private router: Router,
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  get usernameControl() {
    return this.loginForm.get('username');
  }

  get passwordControl() {
    return this.loginForm.get('password');
  }

  onLogin(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = null;

    this.authService.login(this.loginForm.value)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
      next: (res) => {
        const user = this.authAdapter.adapt(res);
        if (user) {
          this.userStateService.setUser(user);
        }

        this.loading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage =
          err?.error?.message || err?.message || 'Login failed. Please check your credentials.';
      },
    });
  }
}
