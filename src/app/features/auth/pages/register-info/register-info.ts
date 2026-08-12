import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'auth';

import { SharedSteps } from '../../../../shared/components/shared-steps/shared-steps';
import { SharedInput } from '../../../../shared/components/shared-input/shared-input';
import { AuthHeader } from '../../../../shared/components/auth-header/auth-header';
import { AuthErrorBanner } from '../../../../shared/components/auth-error-banner/auth-error-banner';
import { SharedButton } from '../../../../shared/components/shared-button/shared-button';

@Component({
  selector: 'app-register-info',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedSteps,
    SharedInput,
    AuthHeader,
    AuthErrorBanner,
    SharedButton,
  ],
  templateUrl: './register-info.html',
  styleUrl: './register-info.css',
})
export class RegisterInfo implements OnInit {
  infoForm: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: object,
  ) {
    this.infoForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      username: ['', [Validators.required]],
      phone: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const storedEmail = this.authService.getStoredEmail();
      if (!storedEmail) {
        this.router.navigate(['/auth/register']);
        return;
      }
      const existing = this.authService.getStoredRegisterInfo();
      if (existing) {
        this.infoForm.patchValue(existing);
      }
    }
  }

  get firstNameControl() {
    return this.infoForm.get('firstName');
  }
  get lastNameControl() {
    return this.infoForm.get('lastName');
  }
  get usernameControl() {
    return this.infoForm.get('username');
  }
  get phoneControl() {
    return this.infoForm.get('phone');
  }

  onSubmit(): void {
    if (this.infoForm.invalid) {
      this.infoForm.markAllAsTouched();
      return;
    }

    this.authService.setStoredRegisterInfo(this.infoForm.value);
    this.router.navigate(['/auth/register-password']);
  }
}
