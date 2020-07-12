import {
  FieldValues,
  UseFormMethods,
  UseFormOptions,
} from 'react-hook-form/dist/types/form';
export declare function usePreservedForm<
  FormValues extends FieldValues = FieldValues,
  ValidationContext extends object = object
>(
  formName: string,
  optionsParam?: UseFormOptions<FormValues, ValidationContext>,
): UseFormMethods<FormValues>;
