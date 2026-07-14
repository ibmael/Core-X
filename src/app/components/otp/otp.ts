import { Component } from '@angular/core';
import { SharedOtp } from '../../shared/components/shared-otp/shared-otp';
import { RouterLink } from '@angular/router';
import { SharedSteps } from '../../shared/components/shared-steps/shared-steps';
@Component({
  selector: 'app-otp',
  standalone: true,
  imports: [SharedOtp, RouterLink, SharedSteps],
  templateUrl: './otp.html',
  styleUrl: './otp.css',
})
export class OTP {
  otpValue: string = '12345';
}
