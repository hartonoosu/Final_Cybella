import React from "react";
import { Form } from "@/components/ui/form";
import PersonalInfoSection from "./register/PersonalInfoSection";
import DemographicSection from "./register/DemographicSection";
import PasswordSection from "./register/PasswordSection";
import TermsSection from "./register/TermsSection";
import RegisterFormFooter from "./register/RegisterFormFooter";
import { useRegisterForm } from "./register/useRegisterForm";

const RegisterForm = () => {
  const { form, onSubmit } = useRegisterForm();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        {/* Personal Information */}
        <PersonalInfoSection control={form.control} />
        
        {/* Demographic Information */}
        <DemographicSection control={form.control} />
        
        {/* Password Fields */}
        <PasswordSection control={form.control} />
        
        {/* Terms and Conditions */}
        <TermsSection control={form.control} />
        
        {/* Form Footer */}
        <RegisterFormFooter isSubmitting={form.formState.isSubmitting} />
      </form>
    </Form>
  );
};

export default RegisterForm;