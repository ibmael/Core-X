import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auth-error-banner',
  imports: [CommonModule],
  templateUrl: './auth-error-banner.html',
  styleUrl: './auth-error-banner.css',
})
export class AuthErrorBanner {
  @Input() message: string | null = null;
}
