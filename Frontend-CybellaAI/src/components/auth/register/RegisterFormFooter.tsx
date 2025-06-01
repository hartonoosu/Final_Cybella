import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

interface RegisterFormFooterProps {
  isSubmitting: boolean;
}

const RegisterFormFooter: React.FC<RegisterFormFooterProps> = ({ isSubmitting }) => {
  return (
    <>
      <Button 
        type="submit" 
        className="w-full mt-2 bg-blue-600 hover:bg-blue-700" 
        disabled={isSubmitting}
      >
        <UserPlus className="mr-2 h-4 w-4" />
        Create Account
      </Button>
      
      <div className="text-center mt-6">
        <p className="text-white">
          Already have an account?{" "}
          <Link to="/login" className="text-white font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </>
  );
};

export default RegisterFormFooter;
