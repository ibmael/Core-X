import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';

import { routes } from './app.routes';
import { provideAuth, errorInterceptor, successInterceptor } from 'auth';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([errorInterceptor, successInterceptor])),
    provideAnimations(),
    provideToastr({
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
      timeOut: 4000,
    }),
    provideAuth({
      apiUrl: 'https://exam.singleclic.net/api/v1',
    }),
    providePrimeNG({
      license:
        'eyJpZCI6ImI1MGE5MDVjLTkyMjEtNGI4NC1hNWNhLTlhMzM5YTk5ODQ4MCIsInByb2R1Y3QiOiJwcmltZXVpIiwidGllciI6ImNvbW11bml0eSIsInR5cGUiOiJkZXYiLCJpYXQiOjE3ODM3MDI2MjksImV4cCI6MTgxNTIzODYyOX0.q_5giqQraD3llarf4dyFAhJkL_470-JAxnncT2GENU-tZtPR7b9qeR-4C78AjxKqK8kpTDViyfLgvRfIe1AZCQ',
      theme: {
        preset: Aura,
      },
    }),
  ],
};
