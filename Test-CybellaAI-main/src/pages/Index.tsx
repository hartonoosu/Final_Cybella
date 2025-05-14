import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MessageSquare, Video, Heart, ArrowRight } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#1E90FF] to-[#87CEEB]">
      <Header />
      
      {/* Hero Section - Added pt-16 to account for fixed header */}
      <section className="relative flex flex-col items-center justify-center min-h-[60vh] px-4 py-20 pt-28">
        <div className="container max-w-[1200px] mx-auto text-center space-y-8">
          <h1 className="text-4xl md:text-6xl font-bold text-white animate-fade-in">
            Your AI Therapy Companion
          </h1>
          <p className="text-xl md:text-2xl max-w-[800px] mx-auto text-white opacity-90 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            Experience emotional support through AI-powered voice therapy and facial recognition
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4 items-center">
            <Button 
              size="lg" 
              variant="therapeutic"
              className="text-lg px-8 py-6 rounded-full group "
              onClick={() => navigate('/chat')}
              style={{ 
                background: "linear-gradient(135deg,rgb(96, 183, 234) 0%,rgb(96, 183, 234) 100%)",
                boxShadow: "0 0 20px rgba(99, 220, 222, 0.44)"
              }}
            >
              <span className="relative z-10 flex items-center">
                <MessageSquare className="mr-2" />
                Share Your Story
                <ArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
              </span>
              <span className="absolute inset-0 bg-white/10 transform scale-0 group-hover:scale-100 transition-transform duration-5000 rounded-full"></span>
            </Button>
            
          </div>
        </div>
      </section>

      <main className="flex-1 container py-16 px-4 mx-auto">
        <div className="max-w-[1200px] mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:scale-105 transition-transform duration-300 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <CardContent className="p-6 space-y-4">
              <MessageSquare className="w-12 h-12 text-white" />
              <h3 className="text-xl font-semibold">Voice Interaction</h3>
              <p className="text-white/90">
                Natural conversation with AI that understands and responds to your emotional state.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:scale-105 transition-transform duration-300 animate-fade-in" style={{ animationDelay: "0.5s" }}>
            <CardContent className="p-6 space-y-4">
              <Video className="w-12 h-12 text-white" />
              <h3 className="text-xl font-semibold">Emotion Recognition</h3>
              <p className="text-white/90">
                Real-time facial expression analysis to better understand your emotional journey.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:scale-105 transition-transform duration-300 animate-fade-in" style={{ animationDelay: "0.7s" }}>
            <CardContent className="p-6 space-y-4">
              <Heart className="w-12 h-12 text-white" />
              <h3 className="text-xl font-semibold">24/7 Support</h3>
              <p className="text-white/90">
                Access emotional support anytime, anywhere with our AI companion.
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* FAQ Section */}
        <div className="mt-24 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-12">Frequently asked questions</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-[1200px] mx-auto">
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm text-white hover:bg-white/20 transition-colors duration-300">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-3">Is Cybella safe to use?</h3>
                <p className="text-white/80">
                  Yes, we prioritize your privacy and security. All conversations are private and encrypted.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm text-white hover:bg-white/20 transition-colors duration-300">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-3">How does it work?</h3>
                <p className="text-white/80">
                  Cybella uses advanced AI to understand your emotions and provide meaningful support.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm text-white hover:bg-white/20 transition-colors duration-300">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-3">What can Cybella help with?</h3>
                <p className="text-white/80">
                  From daily conversations to emotional support, Cybella is your AI companion.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
