import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { SharedInput } from '../../shared/components/shared-input/shared-input';
import { AuthHeader } from '../../shared/components/auth-header/auth-header';
import { AuthErrorBanner } from '../../shared/components/auth-error-banner/auth-error-banner';
import { SharedButton } from '../../shared/components/shared-button/shared-button';

@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    SharedInput,
    AuthHeader,
    AuthErrorBanner,
    SharedButton,
  ],
  templateUrl: './forget-password.html',
  styleUrl: './forget-password.css',
})
export class ForgetPassword {}
