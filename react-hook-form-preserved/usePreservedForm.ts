import React, { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FieldValues, UseFormReturn, UseFormProps } from 'react-hook-form';

/*
  Preserves react-hook-form between unmount/mount cycles.
 */
export function usePreservedForm<
  FormValues extends FieldValues = FieldValues,
  ValidationContext extends object = object
>(
  formName: string,
  optionsParam?: UseFormProps<FormValues, ValidationContext>,
): UseFormReturn<FormValues> {
  const options = optionsParam ?? {};
  const getValuesRef = React.useRef<(() => FieldValues) | null>(null);

  const saveValuesFactory = useCallback(
    () => () => {
      if (getValuesRef.current) {
        const currentValues = getValuesRef.current();
        localStorage.setItem(formName, JSON.stringify(currentValues));
      }
    },
    [formName],
  );
  // preserve values on unmount
  React.useEffect(saveValuesFactory, []);
  const jsonInitialValues = localStorage.getItem(formName);

  if (jsonInitialValues) {
    options.defaultValues = JSON.parse(jsonInitialValues);
  }
  const form = useForm(options);
  const handleChange = useCallback((fieldName) => {
    saveValuesFactory()();
  }, []);

  const fields = form.control.fieldsRef.current;
  useEffect(() => {
    for (const key in fields) {
      const fieldRef = fields[key]!._f.ref as any;
      fieldRef.addEventListener('blur', handleChange);
      fieldRef.addEventListener('input', handleChange);
      fieldRef.addEventListener('reset', handleChange);
    }

    return () => {
      for (const key in fields) {
        const fieldRef = fields[key]!._f.ref as any;
        fieldRef.removeEventListener('input', handleChange);
        fieldRef.removeEventListener('blur', handleChange);
        fieldRef.removeEventListener('reset', handleChange);
      }
    };
  }, [fields]);

  // eslint-disable-next-line
  saveValuesFactory()();

  // Save getValues reference on each rerender
  React.useEffect(() => {
    getValuesRef.current = form.getValues;
  }, [form.getValues]);

  const reset = form.reset;
  form.reset = useCallback(
    (props) => {
      reset(props);
      const saveValuesFunction = saveValuesFactory();
      saveValuesFunction();
    },
    [reset, saveValuesFactory],
  );

  return form;
}
