import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import TeamSection from '@/components/TeamSection';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#8B5CF6] to-[#C4B5FD]">
      <Header />
      
      <main className="flex-1 container py-20 px-4">
        <div className="max-w-[800px] mx-auto space-y-12 mt-20">
          {/* Back button */}
          <div className="flex">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')} 
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="mr-2" />
              Back to Home
            </Button>
          </div>

          <section className="text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              About Cybella
            </h1>
            <p className="text-xl text-white/90">
              Your AI companion for emotional support and personal growth
            </p>
          </section>

          <Card className="p-6 bg-white/20 backdrop-blur">
            <h2 className="text-2xl font-semibold mb-4 text-white">Our Mission</h2>
            <p className="text-white/90">
              Cybella combines advanced AI technology with emotional intelligence to provide a safe space for emotional expression and support. Through voice interaction and facial recognition, we create a unique therapeutic experience that adapts to your emotional state.
            </p>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6 bg-white/20 backdrop-blur">
              <h3 className="text-xl font-semibold mb-3 text-white">Voice Interaction</h3>
              <p className="text-white/90">
                Natural conversation with AI that understands and responds to your emotional state through voice analysis.
              </p>
            </Card>

            <Card className="p-6 bg-white/20 backdrop-blur">
              <h3 className="text-xl font-semibold mb-3 text-white">Emotion Recognition</h3>
              <p className="text-white/90">
                Real-time facial expression analysis to better understand and support your emotional journey.
              </p>
            </Card>
          </div>

          <TeamSection />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
