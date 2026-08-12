import { HttpContextToken } from '@angular/common/http';

/**
 * Attach this to any request where you want to suppress
 * the global error toast from the ErrorInterceptor.
 *
 * Usage:
 * ```ts
 * this.http.get('/api/something', {
 *   context: new HttpContext().set(SKIP_ERROR, true),
 * });
 * ```
 */
export const SKIP_ERROR = new HttpContextToken<boolean>(() => false);
