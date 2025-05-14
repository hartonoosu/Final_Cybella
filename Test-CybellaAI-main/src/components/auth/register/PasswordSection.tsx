import React, { useState } from "react";
import { Control } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { RegisterFormValues } from "./registerFormTypes";
import { FormFieldWithFeedback } from "../FormFieldWithFeedback";

interface PasswordSectionProps {
  control: Control<RegisterFormValues>;
}

const PasswordSection: React.FC<PasswordSectionProps> = ({ control }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validatePassword = (value: string) => {
    return (
      value.length >= 6 &&
      /[A-Z]/.test(value) &&
      /[0-9]/.test(value) &&
      /[^a-zA-Z0-9]/.test(value)
    );
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Security</h3>
      
      <FormFieldWithFeedback
        control={control}
        name="password"
        label="Password"
        rules={{
          minLength: 6,
          validate: validatePassword
        }}
        renderInput={(field) => (
          <div className="relative">
            <Input 
              type={showPassword ? "text" : "password"} 
              placeholder="Create a password" 
              className="bg-white/30 text-white placeholder:text-white/60 border-white/30 pr-10"
              {...field} 
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        )}
      />
      
      <ul className="text-xs text-white/80 mt-2 space-y-1 list-disc pl-5">
        <li className={control._formValues.password?.length >= 6 ? "text-green-400" : ""}>
          At least 6 characters
        </li>
        <li className={/[A-Z]/.test(control._formValues.password || '') ? "text-green-400" : ""}>
          One uppercase letter
        </li>
        <li className={/[0-9]/.test(control._formValues.password || '') ? "text-green-400" : ""}>
          One number
        </li>
        <li className={/[^a-zA-Z0-9]/.test(control._formValues.password || '') ? "text-green-400" : ""}>
          One special character
        </li>
      </ul>
      
      <FormFieldWithFeedback
        control={control}
        name="confirmPassword"
        label="Confirm Password"
        rules={{
          validate: (value) => value === control._formValues.password || "Passwords do not match"
        }}
        renderInput={(field) => (
          <div className="relative">
            <Input 
              type={showConfirmPassword ? "text" : "password"} 
              placeholder="Confirm your password" 
              className="bg-white/30 text-white placeholder:text-white/60 border-white/30 pr-10"
              {...field} 
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        )}
      />
    </div>
  );
};

export default PasswordSection;
