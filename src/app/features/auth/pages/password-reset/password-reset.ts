import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from 'auth';

@Component({
  selector: 'app-password-reset',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './password-reset.html',
  styleUrl: './password-reset.css',
})
export class PasswordReset implements OnInit {
  email: string = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    const stored = this.authService.getStoredEmail();
    if (stored) {
      this.email = stored;
    }
  }
}
