import { Component } from '@angular/core';
import { AuthHeader } from '../../shared/components/auth-header/auth-header';
import { SharedButton } from '../../shared/components/shared-button/shared-button';
import { AuthFooterLink } from '../../shared/components/auth-footer-link/auth-footer-link';
import { SharedInput } from '../../shared/components/shared-input/shared-input';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    AuthHeader,
    SharedButton,
    AuthFooterLink,
    SharedInput,
    RouterLink,
    FormsModule,
    CommonModule,
  ],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  emailValue: string = '';
  isLoading: boolean = false;

  constructor(private router: Router) {}

  onSubmit() {
    // if (!this.emailValue) return;

    this.isLoading = true;

    setTimeout(() => {
      this.isLoading = false;
      this.router.navigate(['/auth/otp']);
    }, 1000);
  }
}
