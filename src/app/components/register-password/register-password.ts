import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { SharedSteps } from '../../shared/components/shared-steps/shared-steps';
import { AuthHeader } from '../../shared/components/auth-header/auth-header';
import { AuthErrorBanner } from '../../shared/components/auth-error-banner/auth-error-banner';
import { SharedButton } from '../../shared/components/shared-button/shared-button';
import { SharedPassword } from '../../shared/components/shared-password/shared-password';

@Component({
  selector: 'app-register-password',
  imports: [
    CommonModule,
    RouterLink,
    SharedSteps,
    AuthHeader,
    AuthErrorBanner,
    SharedButton,
    SharedPassword,
  ],
  templateUrl: './register-password.html',
  styleUrl: './register-password.css',
})
export class RegisterPassword {}
