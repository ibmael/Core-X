import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Static, public pages — pre-rendered at build time for best performance
  {
    path: 'auth/**',
    renderMode: RenderMode.Prerender,
  },
  // All dynamic/authenticated pages — rendered on the client
  // This prevents SSR from trying to access localStorage/sessionStorage
  // and hanging the Node.js connection waiting for guards that check auth state.
  {
    path: '**',
    renderMode: RenderMode.Client,
  },
];
