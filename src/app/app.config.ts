import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
// primeNG
import { providePrimeNG } from 'primeng/config';
import { routes } from './app.routes';

import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import Aura from '@primeuix/themes/aura';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideClientHydration(),
    provideAnimationsAsync(),
    providePrimeNG({
      license:
        'eyJpZCI6ImI1MGE5MDVjLTkyMjEtNGI4NC1hNWNhLTlhMzM5YTk5ODQ4MCIsInByb2R1Y3QiOiJwcmltZXVpIiwidGllciI6ImNvbW11bml0eSIsInR5cGUiOiJkZXYiLCJpYXQiOjE3ODM3MDI2MjksImV4cCI6MTgxNTIzODYyOX0.q_5giqQraD3llarf4dyFAhJkL_470-JAxnncT2GENU-tZtPR7b9qeR-4C78AjxKqK8kpTDViyfLgvRfIe1AZCQ',
      theme: {
        preset: Aura,
      },
    }),
  ],
};
