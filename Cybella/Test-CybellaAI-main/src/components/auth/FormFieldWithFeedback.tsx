import React from "react";
import { Control, FieldPath, FieldValues } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { CheckCircle } from "lucide-react";

interface FormFieldWithFeedbackProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
  control: Control<TFieldValues>;
  name: TName;
  label: string;
  showSuccess?: boolean;
  labelClassName?: string;
  renderInput: (field: any) => React.ReactNode;
  rules?: {
    minLength?: number;
    pattern?: RegExp;
    required?: boolean;
    validate?: (value: any) => boolean | string;
  };
}

export const FormFieldWithFeedback = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({ 
  control, 
  name, 
  label,
  showSuccess = true,
  labelClassName = "text-white",
  renderInput,
  rules
}: FormFieldWithFeedbackProps<TFieldValues, TName>) => {
  
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        // Check specific rules
        const hasValue = field.value && 
          (typeof field.value === 'string' ? field.value.trim() !== '' : true);
          
        const meetsMinLength = !rules?.minLength || 
          (typeof field.value === 'string' && field.value.length >= rules.minLength);
          
        const meetsPattern = !rules?.pattern || 
          (typeof field.value === 'string' && rules.pattern.test(field.value));
          
        const isRequired = rules?.required !== false;
        
        const isValid = hasValue && 
          (!isRequired || field.value) && 
          meetsMinLength && 
          meetsPattern &&
          (!rules?.validate || rules.validate(field.value) === true);

        const showSuccessIndicator = showSuccess && 
          fieldState.isDirty && 
          !fieldState.error && 
          field.value;
          
        const displaySuccess = showSuccessIndicator && isValid;

        return (
          <FormItem className="relative">
            <FormLabel className={labelClassName}>{label}</FormLabel>
            <div className="relative">
              <FormControl>
                {renderInput(field)}
              </FormControl>
            </div>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};
