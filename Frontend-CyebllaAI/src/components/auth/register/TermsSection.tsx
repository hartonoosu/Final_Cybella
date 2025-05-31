import React from "react";
import { Control } from "react-hook-form";
import { Link } from "react-router-dom";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { RegisterFormValues } from "./registerFormTypes";
import { CheckCircle } from "lucide-react";

interface TermsSectionProps {
  control: Control<RegisterFormValues>;
}

const TermsSection: React.FC<TermsSectionProps> = ({ control }) => {
  return (
    <FormField
      control={control}
      name="acceptTerms"
      render={({ field, fieldState }) => (
        <FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-4 relative">
          <FormControl>
            <Checkbox 
              checked={field.value}
              onCheckedChange={field.onChange}
              className="data-[state=checked]:bg-[#9b87f5] data-[state=checked]:border-[#9b87f5]"
            />
          </FormControl>
          <div className="space-y-1 leading-none">
            <FormLabel className="text-sm font-normal text-white">
              I accept the <Link to="#" className="text-[#9b87f5] hover:underline">Terms of Service</Link> and <Link to="#" className="text-[#9b87f5] hover:underline">Privacy Policy</Link>
            </FormLabel>
            <FormMessage />
          </div>
          {field.value && !fieldState.error && (
            <div className="absolute right-3 -top-1 text-green-400">
              <CheckCircle size={16} />
            </div>
          )}
        </FormItem>
      )}
    />
  );
};

export default TermsSection;