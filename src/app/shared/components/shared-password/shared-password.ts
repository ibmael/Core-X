import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-shared-password',
  imports: [CommonModule],
  templateUrl: './shared-password.html',
  styleUrl: './shared-password.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SharedPassword),
      multi: true,
    },
  ],
})
export class SharedPassword implements ControlValueAccessor {
  @Input() id!: string;
  @Input() label!: string;
  @Input() placeholder = '********';
  @Input() hasError = false;
  @Input() errorMessage = '';

  showPassword = false;
  value = '';
  disabled = false;

  onChange: (value: string) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(val: string): void {
    this.value = val || '';
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

  onInput(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.value = val;
    this.onChange(val);
  }

  toggleVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}
