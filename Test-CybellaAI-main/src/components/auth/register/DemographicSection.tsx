import React from "react";
import { Control } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { RegisterFormValues } from "./registerFormTypes";
import { FormFieldWithFeedback } from "../FormFieldWithFeedback";

interface DemographicSectionProps {
  control: Control<RegisterFormValues>;
}

const DemographicSection: React.FC<DemographicSectionProps> = ({ control }) => {
  return (
    <div className="space-y-4">
      
      <FormField
        control={control}
        name="gender"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-white">Gender</FormLabel>
            <Select 
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger className="bg-white/30 text-white border-white/30">
                  <SelectValue placeholder="Select your gender" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
                <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormFieldWithFeedback
        control={control}
        name="dateOfBirth"
        label="Date of Birth (DD-MM-YYYY)"
        renderInput={(field) => (
          <Input 
            type="date" 
            className="bg-white/30 text-white border-white/30 pr-10"
            {...field} 
          />
        )}
      />
      <FormFieldWithFeedback
        control={control}
        name="aiName"
        label="Name Your AI Assistant"
        renderInput={(field) => (
          <Input 
            placeholder="Enter a name for your AI assistant" 
            className="bg-white/30 text-white placeholder:text-white/60 border-white/30 pr-10"
            {...field} 
          />
        )}
      />
    </div>
  );
};

export default DemographicSection;