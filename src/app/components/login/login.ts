import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { AuthHeader } from '../../shared/components/auth-header/auth-header';
import { AuthFooterLink } from '../../shared/components/auth-footer-link/auth-footer-link';
import { SharedButton } from '../../shared/components/shared-button/shared-button';
import { SharedInput } from '../../shared/components/shared-input/shared-input';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  imports: [
    InputTextModule,
    PasswordModule,
    ButtonModule,
    FormsModule,
    AuthHeader,
    AuthFooterLink,
    SharedButton,
    SharedInput,
    CommonModule,
    RouterLink,
  ],
})
export class Login {
  usernameValue: string = '';
  passwordValue: string = '';
  isLoading: boolean = false;

  onSubmit() {}
}
