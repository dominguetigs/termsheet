import { AbstractControl } from '@angular/forms';

export function extractFormControlValues<T extends Record<string, any>>(controls: {
  [key in keyof T]: AbstractControl<string, any>;
}) {
  const values = {};

  for (const [key, formControl] of Object.entries(controls)) {
    Object.assign(values, {
      [key]: formControl.value,
    });
  }

  return values;
}
