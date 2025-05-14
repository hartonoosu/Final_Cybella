import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Form, 
  FormControl
} from "@/components/ui/form";
import { toast } from "sonner";
import { LogIn, Eye, EyeOff, UserPlus } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import FormContainer from "@/components/auth/FormContainer";
import { FormFieldWithFeedback } from "@/components/auth/FormFieldWithFeedback";

// Define form validation schema
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  
  // If user is already authenticated, redirect to home page
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);
  
  // Initialize form with validation
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    toast.loading("Logging in...");
    
    try {
      const success = await login(values.email, values.password);
      
      if (success) {
        toast.dismiss();
        toast.success("Login successful!");
        navigate("/");
      }
    } catch (error) {
      toast.dismiss();
      toast.error("An unexpected error occurred");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#1E90FF] to-[#87CEEB]">
      <Header />
      
      <main className="flex-1 container py-16 px-4 mt-16">
        <FormContainer 
          title="Welcome Back" 
          subtitle="Sign in to continue to Cybella"
        >
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormFieldWithFeedback
                control={form.control}
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
              
              <FormFieldWithFeedback
                control={form.control}
                name="password"
                label="Password"
                rules={{ minLength: 6 }}
                renderInput={(field) => (
                  <div className="relative">
                    <Input 
                      type={showPassword ? "text" : "password"} 
                      placeholder="Enter your password" 
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
              
              <div className="flex justify-end">
                <Link to="#" className="text-sm text-white hover:underline">
                  Forgot password?
                </Link>
              </div>
              
              <Button 
                type="submit" 
                className="w-full" 
                variant="therapeutic"
                disabled={form.formState.isSubmitting}
              >
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
              </Button>
              
              <div className="text-center mt-6">
                <p className="text-white">
                  Don't have an account?{" "}
                  <Link to="/register" className="text-white font-medium hover:underline flex items-center justify-center mt-2">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Sign up now
                  </Link>
                </p>
              </div>
              
              {/* Test account info */}
              <div className="mt-8 p-3 bg-white/10 rounded-lg border border-white/20">
                <p className="text-white text-sm text-center">
                  <span className="font-semibold block mb-2">Test Account:</span>
                  Email: test@example.com<br />
                  Password: password123
                </p>
              </div>
            </form>
          </Form>
        </FormContainer>
      </main>
      
      <Footer />
    </div>
  );
};

export default Login;