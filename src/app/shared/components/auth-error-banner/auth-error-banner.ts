import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-auth-error-banner',
  imports: [],
  templateUrl: './auth-error-banner.html',
  styleUrl: './auth-error-banner.css',
})
export class AuthErrorBanner {
  @Input() message = 'Something went wrong';
}
