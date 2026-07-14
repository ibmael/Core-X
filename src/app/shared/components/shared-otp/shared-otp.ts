import { Component, Input, Output, EventEmitter } from '@angular/core';
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
  @Input() length: number = 6;

  @Input() value: string = '12345';
  @Output() valueChange = new EventEmitter<string>();
}
