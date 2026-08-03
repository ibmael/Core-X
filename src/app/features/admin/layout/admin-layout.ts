import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from 'auth';
import { UserStateService } from '../../../core/services/user-state.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css',
})
export class AdminLayout {
  private authService = inject(AuthService);
  private userStateService = inject(UserStateService);
  private router = inject(Router);

  currentUser = this.userStateService.currentUser;

  adminNavItems = [
    { label: 'Diplomas', icon: 'fa-graduation-cap', route: '/admin/diplomas', active: true },
    { label: 'Students', icon: 'fa-user-graduate', route: '/admin/students', active: false },
    { label: 'Courses', icon: 'fa-book-open', route: '/admin/courses', active: false },
    { label: 'Exams', icon: 'fa-file-signature', route: '/admin/exams', active: false },
    { label: 'Instructors', icon: 'fa-chalkboard-user', route: '/admin/instructors', active: false },
    { label: 'Settings', icon: 'fa-gear', route: '/admin/settings', active: false },
  ];

  getUserInitials(): string {
    const user = this.currentUser();
    if (!user) return 'A';
    const first = user.firstName ? user.firstName.charAt(0) : '';
    const last = user.lastName ? user.lastName.charAt(0) : '';
    return (first + last).toUpperCase() || 'A';
  }

  logout(): void {
    this.userStateService.clearUser();
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
