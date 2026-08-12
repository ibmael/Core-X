import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService, Role } from 'auth';
import { UserStateService } from '../services/user-state.service';

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const userStateService = inject(UserStateService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  // On Server (SSR), localStorage is unavailable. Pass guard on server
  // and let client-side hydration perform the authorization check.
  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  if (!authService.isAuthenticated()) {
    return router.createUrlTree(['/auth/login']);
  }

  const user = userStateService.currentUser();
  const role = user?.role as string | undefined;
  const isAdmin = role === Role.ADMIN || role === 'admin' || role === 'ADMIN';

  if (user && isAdmin) {
    return true;
  }

  return router.createUrlTree(['/dashboard']);
};
