import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shared-password',
  imports: [CommonModule],
  templateUrl: './shared-password.html',
  styleUrl: './shared-password.css',
})
export class SharedPassword {
  @Input() id!: string;
  @Input() label!: string;
  @Input() placeholder = '********';
  @Input() hasError = false;
  @Input() errorMessage = '';

  showPassword = false;

  toggleVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}
