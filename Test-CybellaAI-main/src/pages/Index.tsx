import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MessageSquare, Video, Heart, ArrowRight } from 'lucide-react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#8B5CF6] to-[#C4B5FD]">
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
          {/* Enhanced CTA Section */}
          <div className="mt-12 flex flex-col sm:flex-row justify-center gap-6 items-center">
            <div 
              onClick={() => navigate('/chat')}
              className="group relative cursor-pointer transform transition-all duration-500 hover:scale-105"
            >
              <div className="absolute inset-0 bg-white/30 rounded-2xl blur-xl group-hover:bg-white/40 transition-all duration-500"></div>
              <div className="relative bg-white/20 backdrop-blur-md rounded-2xl p-6 border border-white/30 shadow-xl shadow-purple-500/20">      
              <DotLottieReact
                  src="https://lottie.host/1c3dd2b6-8d4d-4482-9c52-2b7395fd3c22/onOHLO8rFw.lottie"
                  loop
                  autoplay
                  style={{ width: '220px', height: '120px' }}
                  className="mx-auto"
                />
                <div className="mt-4 text-white font-medium text-lg">
                  Start Your Journey
                </div>
                <p className="text-white/80 text-sm mt-2">
                  Click here to begin your therapy session
                </p>
              </div>
              <div className="absolute inset-0 rounded-2xl border-2 border-white/20 pointer-events-none"></div>
            </div>


          </div>
        </div>
      </section>

      <main className="flex-1 container py-16 px-4 mx-auto">
        <div className="max-w-[1200px] mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:scale-105 transition-transform duration-300 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <CardContent className="p-6 space-y-4">
              <MessageSquare className="w-12 h-20 text-white" />
              <h3 className="text-xl font-semibold">Voice Interaction</h3>
              <p className="text-white/90">
                Natural conversation with AI that understands and responds to your emotional state.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:scale-105 transition-transform duration-300 animate-fade-in" style={{ animationDelay: "0.5s" }}>
            <CardContent className="p-6 space-y-4">
              <Video className="w-12 h-20 text-white" />
              <h3 className="text-xl font-semibold">Emotion Recognition</h3>
              <p className="text-white/90">
                Real-time facial expression analysis to better understand your emotional journey.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:scale-105 transition-transform duration-300 animate-fade-in" style={{ animationDelay: "0.7s" }}>
            <CardContent className="p-6 space-y-4">
              <Heart className="w-12 h-20 text-white" />
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
