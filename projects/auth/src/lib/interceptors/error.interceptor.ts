import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

import { SKIP_ERROR } from '../tokens/skip-error.token';

/**
 * Intercepts all HTTP errors and shows a Toastr message.
 * To suppress the toast on a specific request, attach the SKIP_ERROR context token:
 *
 * ```ts
 * this.http.post('/api/login', body, {
 *   context: new HttpContext().set(SKIP_ERROR, true),
 * });
 * ```
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastr = inject(ToastrService);

  return next(req).pipe(
    catchError((error) => {
      const skipError = req.context.get(SKIP_ERROR);

      if (!skipError) {
        // Try to extract message from common API response shapes
        const message: string =
          error?.error?.message ||
          error?.error?.error ||
          error?.message ||
          'Something went wrong. Please try again.';

        toastr.error(message, 'Error');
      }

      return throwError(() => error);
    }),
  );
};
