import { Injectable, signal, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AuthUser } from 'auth';

const USER_KEY = 'auth_user_data';

@Injectable({
  providedIn: 'root',
})
export class UserStateService {
  readonly currentUser = signal<AuthUser | null>(null);

  constructor(@Inject(PLATFORM_ID) private platformId: object) {
    if (isPlatformBrowser(this.platformId)) {
      const stored = localStorage.getItem(USER_KEY);
      if (stored) {
        try {
          this.currentUser.set(JSON.parse(stored));
        } catch {
          localStorage.removeItem(USER_KEY);
        }
      }
    }
  }

  setUser(user: AuthUser): void {
    this.currentUser.set(user);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
  }

  clearUser(): void {
    this.currentUser.set(null);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(USER_KEY);
    }
  }
}
