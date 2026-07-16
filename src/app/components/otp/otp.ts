import { Component } from '@angular/core';
import { SharedOtp } from '../../shared/components/shared-otp/shared-otp';
import { RouterLink } from '@angular/router';
import { SharedSteps } from '../../shared/components/shared-steps/shared-steps';
import { AuthErrorBanner } from '../../shared/components/auth-error-banner/auth-error-banner';
import { SharedButton } from '../../shared/components/shared-button/shared-button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-otp',
  standalone: true,
  imports: [CommonModule, SharedOtp, RouterLink, SharedSteps, AuthErrorBanner, SharedButton],
  templateUrl: './otp.html',
  styleUrl: './otp.css',
})
export class OTP {}
