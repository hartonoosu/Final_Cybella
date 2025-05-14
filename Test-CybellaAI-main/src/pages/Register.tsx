// import React from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { z } from "zod";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { 
//   Form, 
//   FormControl, 
//   FormField, 
//   FormItem, 
//   FormLabel, 
//   FormMessage 
// } from "@/components/ui/form";
// import { Checkbox } from "@/components/ui/checkbox";
// import { toast } from "sonner";
// import { UserPlus } from "lucide-react";
// import Header from "@/components/Header";
// import Footer from "@/components/Footer";
// import { useAuth } from "@/contexts/AuthContext";
// import RegisterForm from "@/components/auth/RegisterForm";


// // Define form validation schema
// const registerSchema = z.object({
//   fullName: z.string().min(2, "Full name must be at least 2 characters"),
//   email: z.string().email("Invalid email address"),
//   password: z.string().min(6, "Password must be at least 6 characters"),
//   confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
//   acceptTerms: z.boolean().refine(val => val === true, {
//     message: "You must accept the terms and conditions",
//   }),
// }).refine(data => data.password === data.confirmPassword, {
//   message: "Passwords do not match",
//   path: ["confirmPassword"],
// });

// type RegisterFormValues = z.infer<typeof registerSchema>;

// const Register = () => {
//   const navigate = useNavigate();
//   const { register: registerUser, isAuthenticated } = useAuth();
  
//   // If user is already authenticated, redirect to home page
//   React.useEffect(() => {
//     if (isAuthenticated) {
//       navigate("/");
//     }
//   }, [isAuthenticated, navigate]);
  
//   // Initialize form with validation
//   const form = useForm<RegisterFormValues>({
//     resolver: zodResolver(registerSchema),
//     defaultValues: {
//       fullName: "",
//       email: "",
//       password: "",
//       confirmPassword: "",
//       acceptTerms: false,
//     },
//   });

//   const onSubmit = async (values: RegisterFormValues) => {
//     toast.loading("Creating your account...");
    
//     try {
//       const success = await registerUser(values.fullName, values.email, values.password);
      
//       if (success) {
//         toast.dismiss();
//         // Navigate to login page on successful registration
//         navigate("/login");
//       }
//     } catch (error) {
//       toast.dismiss();
//       toast.error("An unexpected error occurred");
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#1E90FF] to-[#87CEEB]">
//       <Header />
      
//       <main className="flex-1 container py-16 px-4 mt-16">
//         <div className="max-w-md mx-auto bg-white/20 backdrop-blur-md p-8 rounded-xl shadow-lg border border-white/30">
//           <div className="text-center mb-8">
//             <h1 className="text-3xl font-bold text-white mb-2">Create an Account</h1>
//             <p className="text-white/80">Sign up to get started with Cybella</p>
//           </div>
          
//           <Form {...form}>
//             <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
//               <FormField
//                 control={form.control}
//                 name="fullName"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel className="text-white">Full Name</FormLabel>
//                     <FormControl>
//                       <Input 
//                         placeholder="Enter your full name" 
//                         className="bg-white/30 text-white placeholder:text-white/60 border-white/30"
//                         {...field} 
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
              
//               <FormField
//                 control={form.control}
//                 name="email"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel className="text-white">Email</FormLabel>
//                     <FormControl>
//                       <Input 
//                         placeholder="Enter your email" 
//                         className="bg-white/30 text-white placeholder:text-white/60 border-white/30"
//                         {...field} 
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
              
//               <FormField
//                 control={form.control}
//                 name="password"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel className="text-white">Password</FormLabel>
//                     <FormControl>
//                       <Input 
//                         type="password" 
//                         placeholder="Create a password" 
//                         className="bg-white/30 text-white placeholder:text-white/60 border-white/30"
//                         {...field} 
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
              
//               <FormField
//                 control={form.control}
//                 name="confirmPassword"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel className="text-white">Confirm Password</FormLabel>
//                     <FormControl>
//                       <Input 
//                         type="password" 
//                         placeholder="Confirm your password" 
//                         className="bg-white/30 text-white placeholder:text-white/60 border-white/30"
//                         {...field} 
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
              
//               <FormField
//                 control={form.control}
//                 name="acceptTerms"
//                 render={({ field }) => (
//                   <FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-4">
//                     <FormControl>
//                       <Checkbox 
//                         checked={field.value}
//                         onCheckedChange={field.onChange}
//                         className="data-[state=checked]:bg-[#9b87f5] data-[state=checked]:border-[#9b87f5]"
//                       />
//                     </FormControl>
//                     <div className="space-y-1 leading-none">
//                       <FormLabel className="text-sm font-normal text-white">
//                         I accept the <Link to="#" className="text-[#9b87f5] hover:underline">Terms of Service</Link> and <Link to="#" className="text-[#9b87f5] hover:underline">Privacy Policy</Link>
//                       </FormLabel>
//                       <FormMessage />
//                     </div>
//                   </FormItem>
//                 )}
//               />
              
//               <Button 
//                 type="submit" 
//                 className="w-full mt-2" 
//                 variant="therapeutic"
//                 disabled={form.formState.isSubmitting}
//               >
//                 <UserPlus className="mr-2 h-4 w-4" />
//                 Create Account
//               </Button>
              
//               <div className="text-center mt-6">
//                 <p className="text-white">
//                   Already have an account?{" "}
//                   <Link to="/login" className="text-white font-medium hover:underline">
//                     Sign in
//                   </Link>
//                 </p>
//               </div>
//             </form>
//             <RegisterForm/>
//           </Form>
//         </div>
//       </main>
      
//       <Footer />
//     </div>
//   );
// };

// export default Register;


import React from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RegisterForm from "@/components/auth/RegisterForm";

const Register = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#1E90FF] to-[#87CEEB]">
      <Header />

      <main className="flex-1 container py-16 px-4 mt-16">
        <div className="max-w-md mx-auto bg-white/20 backdrop-blur-md p-8 rounded-xl shadow-lg border border-white/30">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Create an Account</h1>
            <p className="text-white/80">Sign up to get started with Cybella</p>
          </div>

          <RegisterForm />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Register;
