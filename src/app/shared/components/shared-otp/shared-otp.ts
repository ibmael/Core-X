import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputOtpModule } from 'primeng/inputotp';

@Component({
  selector: 'app-shared-otp',
  imports: [CommonModule, FormsModule, InputOtpModule],
  templateUrl: './shared-otp.html',
  styleUrl: './shared-otp.css',
})
export class SharedOtp {
  @Input() length = 6;
  @Input() hasError = false;
  value = '';
}
