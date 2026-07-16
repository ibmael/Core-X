import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { SharedSteps } from '../../shared/components/shared-steps/shared-steps';
import { SharedInput } from '../../shared/components/shared-input/shared-input';
import { AuthHeader } from '../../shared/components/auth-header/auth-header';
import { AuthErrorBanner } from '../../shared/components/auth-error-banner/auth-error-banner';
import { SharedButton } from '../../shared/components/shared-button/shared-button';

@Component({
  selector: 'app-register-info',
  imports: [
    CommonModule,
    RouterLink,
    SharedSteps,
    SharedInput,
    AuthHeader,
    AuthErrorBanner,
    SharedButton,
  ],
  templateUrl: './register-info.html',
  styleUrl: './register-info.css',
})
export class RegisterInfo {}
