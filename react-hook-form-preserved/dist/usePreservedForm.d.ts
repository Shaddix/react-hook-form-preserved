import { FieldValues, UseFormReturn, UseFormProps } from 'react-hook-form';
export declare function usePreservedForm<
  FormValues extends FieldValues = FieldValues,
  ValidationContext extends object = object
>(
  formName: string,
  optionsParam?: UseFormProps<FormValues, ValidationContext>,
): UseFormReturn<FormValues>;
