import { Routes } from '@angular/router';
import { guestGuard } from 'auth';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    canActivate: [guestGuard],
    loadComponent: () => import('./components/auth-layout/auth-layout').then((m) => m.AuthLayout),
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      },
      {
        path: 'login',
        loadComponent: () => import('./components/login/login').then((m) => m.Login),
      },
      {
        path: 'register',
        loadComponent: () => import('./components/register/register').then((m) => m.Register),
      },
      {
        path: 'otp',
        loadComponent: () => import('./components/otp/otp').then((m) => m.OTP),
      },
      {
        path: 'register-info',
        loadComponent: () =>
          import('./components/register-info/register-info').then((m) => m.RegisterInfo),
      },
      {
        path: 'register-password',
        loadComponent: () =>
          import('./components/register-password/register-password').then(
            (m) => m.RegisterPassword,
          ),
      },
      {
        path: 'forget-password',
        loadComponent: () =>
          import('./components/forget-password/forget-password').then((m) => m.ForgetPassword),
      },
      {
        path: 'password-reset',
        loadComponent: () =>
          import('./components/password-reset/password-reset').then((m) => m.PasswordReset),
      },
      {
        path: 'new-password',
        loadComponent: () =>
          import('./components/new-password/new-password').then((m) => m.NewPassword),
      },
    ],
  },
  {
    path: '**',
    loadComponent: () => import('./components/not-found/not-found').then((m) => m.NotFound),
  },
];
