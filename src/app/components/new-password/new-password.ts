import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { SharedButton } from '../../shared/components/shared-button/shared-button';
import { SharedPassword } from '../../shared/components/shared-password/shared-password';
import { AuthErrorBanner } from '../../shared/components/auth-error-banner/auth-error-banner';

@Component({
  selector: 'app-new-password',
  imports: [CommonModule, RouterLink, SharedButton, SharedPassword, AuthErrorBanner],
  templateUrl: './new-password.html',
  styleUrl: './new-password.css',
})
export class NewPassword {}
