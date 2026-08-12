import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withEnabledBlockingInitialNavigation } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideToastr } from 'ngx-toastr';
import { providePrimeNG } from 'primeng/config';
import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

import { routes } from './app.routes';
import { provideAuth, errorInterceptor, successInterceptor } from 'auth';
import { tokenInterceptor } from './core/interceptors/token.interceptor';

const AppPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#155dfc',
      600: '#1248cc',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
      950: '#172554',
    },
  },
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withEnabledBlockingInitialNavigation()),
    provideHttpClient(
      withFetch(),
      withInterceptors([tokenInterceptor, errorInterceptor, successInterceptor]),
    ),
    provideAnimationsAsync(),
    provideToastr({
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
      timeOut: 4000,
    }),
    provideAuth({
      apiUrl: 'https://exam-app.elevate-bootcamp.cloud',
    }),
    providePrimeNG({
      license:
        'eyJpZCI6ImI1MGE5MDVjLTkyMjEtNGI4NC1hNWNhLTlhMzM5YTk5ODQ4MCIsInByb2R1Y3QiOiJwcmltZXVpIiwidGllciI6ImNvbW11bml0eSIsInR5cGUiOiJkZXYiLCJpYXQiOjE3ODM3MDI2MjksImV4cCI6MTgxNTIzODYyOX0.q_5giqQraD3llarf4dyFAhJkL_470-JAxnncT2GENU-tZtPR7b9qeR-4C78AjxKqK8kpTDViyfLgvRfIe1AZCQ',
      theme: {
        preset: AppPreset,
      },
    }),
  ],
};
