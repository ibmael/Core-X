import { InjectionToken } from '@angular/core';

/**
 * Injection token for the API base URL.
 * Must be provided explicitly via provideAuth({ apiUrl: '...' }) in app.config.ts.
 * Do NOT add a factory/default here — that would create a second, silent registration
 * that shadows (or conflicts with) the one from provideAuth().
 */
export const API_URL = new InjectionToken<string>('API_URL');
