import React, { useState } from "react";
import { 
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Shield, AlertCircle, CheckCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { addNotification } from "@/components/header/NotificationBell";

const EmailVerificationCard = () => {
  const { user, requestEmailVerification } = useAuth();
  const [isRequesting, setIsRequesting] = useState(false);

  const handleRequestVerification = async () => {
    setIsRequesting(true);
    try {
      const result = await requestEmailVerification();
      
      // The notification handling is now done in the AuthContext
      // so we don't need to do additional handling here
      
    } catch (error) {
      console.error("Failed to request email verification:", error);
    } finally {
      setIsRequesting(false);
    }
  };

  return (
    <Card className="bg-white/20 backdrop-blur-md border-white/30">
      <CardHeader>
        <CardTitle className="text-white">Email Verification</CardTitle>
        <CardDescription className="text-white/70">
          Verify your email address to secure your account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-3 rounded-md bg-white/10">
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-white" />
            <div>
              <p className="text-white font-medium">{user?.email}</p>
              {user?.emailVerified ? (
                <p className="text-green-400 text-sm flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" /> Verified
                </p>
              ) : (
                <p className="text-amber-400 text-sm flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> Not verified
                </p>
              )}
            </div>
          </div>
          
          {!user?.emailVerified && (
            <Button 
              variant="outline" 
              className="bg-white/30 text-white border-white/30 hover:bg-white/50"
              onClick={handleRequestVerification}
              disabled={isRequesting}
            >
              {isRequesting ? "Sending..." : "Verify Email"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EmailVerificationCard;