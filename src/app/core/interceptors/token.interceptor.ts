import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from 'auth';

/**
 * Automatically attaches the auth token to every outgoing HTTP request.
 * SSR-safe: only reads localStorage on the browser.
 */
export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const platformId = inject(PLATFORM_ID);

  if (isPlatformBrowser(platformId)) {
    const token = authService.getToken();

    if (
      token &&
      typeof token === 'string' &&
      token !== 'undefined' &&
      token !== 'null' &&
      token.trim() !== ''
    ) {
      const cleanToken = token.startsWith('Bearer ') ? token.slice(7).trim() : token.trim();

      const cloned = req.clone({
        setHeaders: {
          token: cleanToken,
          Authorization: `Bearer ${cleanToken}`,
        },
      });
      return next(cloned);
    }
  }

  return next(req);
};
