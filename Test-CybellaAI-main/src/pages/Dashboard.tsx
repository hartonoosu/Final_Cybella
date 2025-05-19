import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useEmotionData } from '@/hooks/dashboard/useEmotionData';
import SessionHistoryList from '@/components/dashboard/SessionHistoryList';
import EmotionSummary from '@/components/dashboard/EmotionSummary';
import EmotionDistribution from '@/components/dashboard/EmotionDistribution';
import EmotionBySource from '@/components/dashboard/EmotionBySource';

//import voice emotion context
import { useVoiceEmotionContext } from "@/contexts/VoiceEmotionContext";
import { AlertCircle, Trash2, AlertTriangle } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const Dashboard = () => {
  const { emotionData, clearData } = useEmotionData();
  const { segmentEmotions } = useVoiceEmotionContext(); // Access the globally stored segment data
  const [clearDialogOpen, setClearDialogOpen] = useState(false);

  useEffect(() => {
  console.log("Dashboard loaded segmentEmotions:", segmentEmotions);
}, [segmentEmotions]); 

  const hasSessions = emotionData.sessions.length > 0;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-purple-50 to-white">
      <Header />
      
      <main className="flex-1 container py-6 md:py-8 mx-auto mt-16">
        <div className="space-y-6 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-purple-900">Emotion Dashboard</h1>
              <p className="text-purple-700/80 mt-1">
                Track and analyze your emotional patterns from facial and voice data
              </p>
            </div>
            
            {hasSessions && (
              <Button 
                variant="destructive" 
                size="sm" 
                className="self-start"
                onClick={() => setClearDialogOpen(true)}
              >
                <Trash2 className="mr-2 h-4 w-4" /> Clear All Data
              </Button>
            )}
          </div>
          
          {!hasSessions ? (
            <Card className="p-8 flex flex-col items-center justify-center text-center">
              <AlertCircle className="h-12 w-12 text-purple-400 mb-4" />
              <h3 className="text-xl font-medium mb-2">No emotion data yet</h3>
              <p className="text-muted-foreground max-w-md">
                Start a session from the Chat page to begin tracking your emotions. 
                Your emotion data will be stored locally on this device.
              </p>
            </Card>
          ) : (
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="history">Session History</TabsTrigger>
                <TabsTrigger value="analysis">Analysis</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-6">
                <EmotionSummary emotionData={emotionData} />
                
                <div className="grid md:grid-cols-2 gap-6">
                  <EmotionDistribution emotionData={emotionData} />
                  <EmotionBySource emotionData={emotionData} />
                </div>
                
                <Card className="p-4 bg-amber-50 border-amber-200">
                  <div className="flex">
                    <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0" />
                    <p className="text-sm text-amber-700">
                      Your emotion data is currently stored only on this device. 
                      In a future update, you'll be able to sync this data to a secure database.
                    </p>
                  </div>
                </Card>
              </TabsContent>
              
              <TabsContent value="history">
                <SessionHistoryList sessions={emotionData.sessions} />
              </TabsContent>
              
              <TabsContent value="analysis">
                <div className="grid md:grid-cols-2 gap-6">
                  <EmotionDistribution emotionData={emotionData} showDetailed={true} />
                  <EmotionBySource emotionData={emotionData} showDetailed={true} />
                </div>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </main>
      
      <AlertDialog open={clearDialogOpen} onOpenChange={setClearDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear all emotion data?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete all your emotion tracking data from this device.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={clearData} className="bg-red-600 hover:bg-red-700">
              Yes, delete all data
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Footer />
    </div>
  );
};

export default Dashboard;