import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AuthHeader } from '../../shared/components/auth-header/auth-header';
import { AuthFooterLink } from '../../shared/components/auth-footer-link/auth-footer-link';
import { AuthErrorBanner } from '../../shared/components/auth-error-banner/auth-error-banner';
import { SharedButton } from '../../shared/components/shared-button/shared-button';
import { SharedInput } from '../../shared/components/shared-input/shared-input';
import { SharedPassword } from '../../shared/components/shared-password/shared-password';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  imports: [
    CommonModule,
    RouterLink,
    AuthHeader,
    AuthFooterLink,
    AuthErrorBanner,
    SharedButton,
    SharedInput,
    SharedPassword,
  ],
})
export class Login {}
