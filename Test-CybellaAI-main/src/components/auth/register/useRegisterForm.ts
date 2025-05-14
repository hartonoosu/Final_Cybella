import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { registerSchema, RegisterFormValues } from "./registerFormTypes";

export const useRegisterForm = () => {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  
  // Initialize form with validation
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      gender: "",
      dateOfBirth: "",
      ageRange: "",
      aiName: "Cybella",
      acceptTerms: false,
    },
    mode: "onChange"
  });

  const onSubmit = async (values: RegisterFormValues) => {
    toast.loading("Creating your account...");
    console.log("Form submitted with values:", values);
    
    try {
      const success = await registerUser(
        values.fullName, 
        values.email, 
        values.password,
        values.gender,
        values.dateOfBirth,
        values.ageRange,
        values.aiName
      );
      
      if (success) {
        toast.dismiss();
        toast.success("Account created successfully!");
        // Navigate to login page on successful registration
        navigate("/login");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.dismiss();
      toast.error("An unexpected error occurred");
    }
  };

  return {
    form,
    onSubmit
  };
};
