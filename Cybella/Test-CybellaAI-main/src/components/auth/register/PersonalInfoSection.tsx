import React from "react";
import { Control } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { RegisterFormValues } from "./registerFormTypes";
import { FormFieldWithFeedback } from "../FormFieldWithFeedback";

interface PersonalInfoSectionProps {
  control: Control<RegisterFormValues>;
}

const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({ control }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Personal Information</h3>
      
      <FormFieldWithFeedback
        control={control}
        name="fullName"
        label="Full Name"
        rules={{ minLength: 2 }}
        renderInput={(field) => (
          <Input 
            placeholder="Enter your full name" 
            className="bg-white/30 text-white placeholder:text-white/60 border-white/30 pr-10"
            {...field} 
          />
        )}
      />
      
      <FormFieldWithFeedback
        control={control}
        name="email"
        label="Email"
        rules={{ pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ }}
        renderInput={(field) => (
          <Input 
            placeholder="Enter your email" 
            className="bg-white/30 text-white placeholder:text-white/60 border-white/30 pr-10"
            {...field} 
          />
        )}
      />
    </div>
  );
};

export default PersonalInfoSection;