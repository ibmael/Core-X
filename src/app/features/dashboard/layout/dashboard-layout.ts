import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { DrawerModule } from 'primeng/drawer';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { Bars } from '@primeicons/angular/bars';
import { AuthService } from 'auth';
import { UserStateService } from '../../../core/services/user-state.service';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, DrawerModule, MenuModule, Bars],
  templateUrl: './dashboard-layout.html',
  styleUrl: './dashboard-layout.css',
})
export class DashboardLayout {
  private authService = inject(AuthService);
  private userStateService = inject(UserStateService);
  private router = inject(Router);

  currentUser = this.userStateService.currentUser;
  photoFailed = signal(false);
  showProfileDropdown = signal(false);
  isMobileSidebarOpen = signal(false);

  navItems = [
    { label: 'Diplomas', icon: './icons/graduation-cap.svg', route: '/dashboard/diplomas' },
    { label: 'Account Settings', icon: './icons/user-round.svg', route: '/dashboard/account' },
  ];

  profileMenuItems: MenuItem[] = [
    {
      label: 'Account',
      icon: 'pi pi-user',
      command: () => {
        this.closeDropdown();
        this.closeMobileSidebar();
        this.router.navigate(['/dashboard/account']);
      },
    },
    {
      label: 'Dashboard',
      icon: 'pi pi-th-large',
      command: () => {
        this.closeDropdown();
        this.closeMobileSidebar();
        this.router.navigate(['/dashboard/diplomas']);
      },
    },
    { separator: true },
    {
      label: 'Logout',
      icon: 'pi pi-sign-out',
      styleClass: 'text-red-500 font-semibold',
      command: () => this.logout(),
    },
  ];

  toggleProfileDropdown(): void {
    this.showProfileDropdown.update((v) => !v);
  }

  closeDropdown(): void {
    this.showProfileDropdown.set(false);
  }

  toggleMobileSidebar(): void {
    this.isMobileSidebarOpen.update((v) => !v);
  }

  closeMobileSidebar(): void {
    this.isMobileSidebarOpen.set(false);
  }

  getImageUrl(url: string | undefined | null): string {
    return url?.trim() || '';
  }

  getUserInitials(): string {
    const user = this.currentUser();
    if (!user) return 'U';
    const first = user.firstName ? user.firstName.charAt(0) : '';
    const last = user.lastName ? user.lastName.charAt(0) : '';
    return (first + last).toUpperCase() || 'U';
  }

  logout(): void {
    this.closeDropdown();
    this.closeMobileSidebar();
    this.userStateService.clearUser();
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
