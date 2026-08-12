import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { tap } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { HttpContextToken } from '@angular/common/http';

/**
 * Attach to a request if you want the interceptor to automatically
 * show a success toast with a custom message.
 *
 * Leave unset (default: null) to handle success in the component manually.
 *
 * Usage:
 * ```ts
 * this.http.post('/api/something', body, {
 *   context: new HttpContext().set(SUCCESS_MESSAGE, 'Saved successfully!'),
 * });
 * ```
 */
export const SUCCESS_MESSAGE = new HttpContextToken<string | null>(() => null);

/**
 * Success interceptor — by default does NOT show any toast.
 * Only shows a success toast if the request carries a SUCCESS_MESSAGE context token.
 * This gives the component full control over success handling.
 */
export const successInterceptor: HttpInterceptorFn = (req, next) => {
  const toastr = inject(ToastrService);

  return next(req).pipe(
    tap({
      next: () => {
        const successMessage = req.context.get(SUCCESS_MESSAGE);

        if (successMessage) {
          toastr.success(successMessage);
        }
      },
    }),
  );
};
