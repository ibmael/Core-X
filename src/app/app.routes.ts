import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full',
  },
  {
    path: 'auth',
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
        path: 'forget-password',
        loadComponent: () =>
          import('./components/forget-password/forget-password').then((m) => m.ForgetPassword),
      },
      {
        path: 'otp',
        loadComponent: () => import('./components/otp/otp').then((m) => m.OTP),
      },
    ],
  },
  {
    path: '**',
    loadComponent: () => import('./components/not-found/not-found').then((m) => m.NotFound),
  },
];
