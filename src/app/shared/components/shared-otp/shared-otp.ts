import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { InputOtpModule } from 'primeng/inputotp';

@Component({
  selector: 'app-shared-otp',
  imports: [CommonModule, FormsModule, InputOtpModule],
  templateUrl: './shared-otp.html',
  styleUrl: './shared-otp.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SharedOtp),
      multi: true,
    },
  ],
})
export class SharedOtp implements ControlValueAccessor {
  @Input() length = 6;
  @Input() hasError = false;

  value = '';
  disabled = false;

  onChange: (value: string) => void = () => {};
  onTouched: () => void = () => {};

  onModelChange(val: any): void {
    const strVal = val != null ? String(val) : '';
    if (this.value !== strVal) {
      this.value = strVal;
      this.onChange(this.value);
      this.onTouched();
    }
  }

  writeValue(val: any): void {
    this.value = val != null ? String(val) : '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
