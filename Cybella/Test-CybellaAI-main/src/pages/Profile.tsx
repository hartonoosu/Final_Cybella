import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  Tabs, 
  TabsList, 
  TabsTrigger, 
  TabsContent 
} from "@/components/ui/tabs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProfileDetailsTab from "@/components/profile/ProfileDetailsTab";
import SecurityTab from "@/components/profile/SecurityTab";
import { useAuth } from "@/contexts/AuthContext";

const Profile = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();
  
  // Redirect if not authenticated
  React.useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate, loading]);

  // If still loading or not authenticated, show loading state
  if (loading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#8B5CF6] to-[#C4B5FD]">
        <Header />
        <main className="flex-1 container py-16 px-4 mt-16 flex items-center justify-center">
          <div className="text-white text-2xl">Loading...</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#8B5CF6] to-[#C4B5FD]">
      <Header />
      
      <main className="flex-1 container py-16 px-4 mt-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-6">Your Profile</h1>
          
          <Tabs defaultValue="details" className="space-y-6">
            <TabsList className="bg-white/20 border border-white/30">
              <TabsTrigger value="details" className="data-[state=active]:bg-white/30">
                Profile Details
              </TabsTrigger>
              <TabsTrigger value="security" className="data-[state=active]:bg-white/30">
                Security
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="details">
              <ProfileDetailsTab />
            </TabsContent>
            
            <TabsContent value="security">
              <SecurityTab />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Profile;