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
      <h3 className="text-lg font-semibold text-white">Demographic Information</h3>
      
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
        label="Date of Birth (YYYY-MM-DD)"
        renderInput={(field) => (
          <Input 
            type="date" 
            className="bg-white/30 text-white border-white/30 pr-10"
            {...field} 
          />
        )}
      />
      
      {/* <FormField
        control={control}
        name="ageRange"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-white">Age Range</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-col space-y-1 sm:flex-row sm:flex-wrap sm:space-y-0 sm:gap-4"
              >
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="18-24" className="border-white" />
                  </FormControl>
                  <FormLabel className="font-normal text-white">18-24</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="25-34" className="border-white" />
                  </FormControl>
                  <FormLabel className="font-normal text-white">25-34</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="35-44" className="border-white" />
                  </FormControl>
                  <FormLabel className="font-normal text-white">35-44</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="45-54" className="border-white" />
                  </FormControl>
                  <FormLabel className="font-normal text-white">45-54</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="55+" className="border-white" />
                  </FormControl>
                  <FormLabel className="font-normal text-white">55+</FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      /> */}
      
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