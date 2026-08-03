import { Routes } from '@angular/router';

export const dashboardRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layout/dashboard-layout').then((m) => m.DashboardLayout),
    children: [
      // Default: redirect to diplomas
      { path: '', redirectTo: 'diplomas', pathMatch: 'full' },

      // Diplomas list
      {
        path: 'diplomas',
        loadComponent: () =>
          import('./pages/diplomas/diplomas-page').then((m) => m.DiplomasPage),
      },

      // Exams for a specific diploma
      {
        path: 'diplomas/:diplomaId/exams',
        loadComponent: () =>
          import('./pages/diploma-exams/diploma-exams').then((m) => m.DiplomaExamsPage),
      },

      // Exam questions
      {
        path: 'diplomas/:diplomaId/exams/:examId',
        loadComponent: () =>
          import('./pages/exam-questions/exam-questions').then((m) => m.ExamQuestionsPage),
      },

      // Account settings
      {
        path: 'account',
        loadComponent: () =>
          import('./pages/account/account').then((m) => m.AccountPage),
      },
    ],
  },
];
