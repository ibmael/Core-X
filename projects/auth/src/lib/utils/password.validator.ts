import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Password strength rules:
 *  - At least 8 characters
 *  - At least one uppercase letter (A-Z)
 *  - At least one digit (0-9)
 *  - At least one special character (!@#$%^&*...)
 */
export function passwordValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value: string = control.value ?? '';

    if (!value) return null;

    const errors: ValidationErrors = {};

    if (value.length < 8) {
      errors['minLength'] = { required: 8, actual: value.length };
    }

    if (!/[A-Z]/.test(value)) {
      errors['uppercase'] = true;
    }

    if (!/[0-9]/.test(value)) {
      errors['number'] = true;
    }

    if (!/[!@#$%^&*()\-_=+\[\]{};:'",.<>?/\\|`~]/.test(value)) {
      errors['specialChar'] = true;
    }

    return Object.keys(errors).length > 0 ? errors : null;
  };
}

/**
 * Validator that checks if two fields match (e.g. password & confirmPassword).
 * Apply this on the FormGroup, not on a single control.
 */
export function matchValidator(controlName: string, matchControlName: string): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const control = group.get(controlName);
    const matchControl = group.get(matchControlName);

    if (!control || !matchControl) return null;

    const otherErrors = { ...(matchControl.errors || {}) };
    delete otherErrors['mismatch'];

    // Don't overwrite unrelated errors (e.g. required) while the field is empty.
    if (Object.keys(otherErrors).length > 0 && !matchControl.value) {
      return null;
    }

    if (control.value !== matchControl.value) {
      matchControl.setErrors({ ...otherErrors, mismatch: true });
    } else {
      matchControl.setErrors(Object.keys(otherErrors).length ? otherErrors : null);
    }

    return null;
  };
}
