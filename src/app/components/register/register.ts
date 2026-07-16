import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { AuthHeader } from '../../shared/components/auth-header/auth-header';
import { SharedButton } from '../../shared/components/shared-button/shared-button';
import { AuthFooterLink } from '../../shared/components/auth-footer-link/auth-footer-link';
import { AuthErrorBanner } from '../../shared/components/auth-error-banner/auth-error-banner';
import { SharedInput } from '../../shared/components/shared-input/shared-input';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    AuthHeader,
    SharedButton,
    AuthFooterLink,
    AuthErrorBanner,
    SharedInput,
  ],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {}
