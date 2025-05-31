import React, { useState } from "react";
import { 
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, Eye, EyeOff, AlertTriangle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const PasswordChangeCard = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isChanging, setIsChanging] = useState(false);
  const [showDevDialog, setShowDevDialog] = useState(false);
  const { changePassword } = useAuth();
  const { toast } = useToast();

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords do not match",
        description: "Please ensure your new password and confirmation match.",
        variant: "destructive"
      });
      return;
    }
    
    if (newPassword.length < 8) {
      toast({
        title: "Password too short",
        description: "Your new password should be at least 8 characters long.",
        variant: "destructive"
      });
      return;
    }
    
    setIsChanging(true);
    
    try {
      // Check if the changePassword function exists before calling it
      if (typeof changePassword === 'function') {
        try {
          await changePassword(currentPassword, newPassword);
          toast({
            title: "Password changed",
            description: "Your password has been updated successfully."
          });
          // Reset form
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
        } catch (error) {
          // If the API endpoint is missing, show the development dialog
          console.error("Failed to change password:", error);
          setShowDevDialog(true);
        }
      } else {
        // Handle the case when changePassword function is not available
        toast({
          title: "Feature not available",
          description: "Password change functionality is not fully implemented yet.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Failed to change password:", error);
      toast({
        title: "Failed to change password",
        description: error instanceof Error ? error.message : "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsChanging(false);
    }
  };

  return (
    <>
      <Card className="bg-white/20 backdrop-blur-md border-white/30">
        <CardHeader>
          <CardTitle className="text-white">Change Password</CardTitle>
          <CardDescription className="text-white/70">
            Update your password to keep your account secure
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleChangePassword}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="relative">
                <Input
                  type={showCurrentPassword ? "text" : "password"}
                  placeholder="Current Password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="bg-white/20 text-white border-white/30 pl-10"
                  required
                />
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-white/70" />
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon"
                  className="absolute right-1 top-1 text-white/70 hover:text-white hover:bg-white/10"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="relative">
                <Input
                  type={showNewPassword ? "text" : "password"}
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="bg-white/20 text-white border-white/30 pl-10"
                  required
                  minLength={8}
                />
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-white/70" />
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon"
                  className="absolute right-1 top-1 text-white/70 hover:text-white hover:bg-white/10"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </Button>
              </div>
            </div>

            <div className="relative">
              <Input
                type="password"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-white/20 text-white border-white/30 pl-10"
                required
              />
              <Lock className="absolute left-3 top-2.5 h-5 w-5 text-white/70" />
            </div>
          </CardContent>
          
          <CardFooter>
            <Button 
              type="submit" 
              className="bg-white/20 text-white border border-white/30 hover:bg-white/30"
              disabled={isChanging || !currentPassword || !newPassword || !confirmPassword}
            >
              {isChanging ? "Changing..." : "Change Password"}
            </Button>
          </CardFooter>
        </form>
      </Card>

      <Dialog open={showDevDialog} onOpenChange={setShowDevDialog}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Missing API Endpoint
            </DialogTitle>
            <DialogDescription>
              The API endpoint for changing passwords is currently unavailable. This feature requires the 
              serverless function <code>/.netlify/functions/change-password</code> to be implemented.
              <p className="mt-2">
                In a production environment, you would need to create this function in your Netlify functions directory.
              </p>
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end">
            <Button onClick={() => setShowDevDialog(false)}>
              Understand
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PasswordChangeCard;