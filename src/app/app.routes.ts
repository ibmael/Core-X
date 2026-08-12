import { Routes } from '@angular/router';
import { authGuard, guestGuard } from 'auth';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  // Root redirect → login page.
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full',
  },

  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./features/dashboard/dashboard.routes').then(
        (m) => m.dashboardRoutes,
      ),
  },

  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    loadChildren: () =>
      import('./features/admin/admin.routes').then((m) => m.adminRoutes),
  },

  {
    path: 'auth',
    loadComponent: () =>
      import('./features/auth/layout/auth-layout').then((m) => m.AuthLayout),
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      },
      {
        path: 'login',
        canActivate: [guestGuard],
        loadComponent: () =>
          import('./features/auth/pages/login/login').then((m) => m.Login),
      },
      {
        path: 'register',
        canActivate: [guestGuard],
        loadComponent: () =>
          import('./features/auth/pages/register/register').then(
            (m) => m.Register,
          ),
      },
      {
        path: 'otp',
        loadComponent: () =>
          import('./features/auth/pages/otp/otp').then((m) => m.OTP),
      },
      {
        path: 'register-info',
        loadComponent: () =>
          import('./features/auth/pages/register-info/register-info').then(
            (m) => m.RegisterInfo,
          ),
      },
      {
        path: 'register-password',
        loadComponent: () =>
          import(
            './features/auth/pages/register-password/register-password'
          ).then((m) => m.RegisterPassword),
      },
      {
        path: 'forget-password',
        loadComponent: () =>
          import(
            './features/auth/pages/forget-password/forget-password'
          ).then((m) => m.ForgetPassword),
      },
      {
        path: 'password-reset',
        loadComponent: () =>
          import(
            './features/auth/pages/password-reset/password-reset'
          ).then((m) => m.PasswordReset),
      },
      {
        path: 'new-password',
        loadComponent: () =>
          import('./features/auth/pages/new-password/new-password').then(
            (m) => m.NewPassword,
          ),
      },
    ],
  },

  {
    path: '**',
    loadComponent: () =>
      import('./features/auth/pages/not-found/not-found').then(
        (m) => m.NotFound,
      ),
  },
];
