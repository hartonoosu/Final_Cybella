import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { SessionData } from '@/hooks/dashboard/useEmotionData';
import { CalendarIcon, ClockIcon, ChartBarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import SessionDetails from './SessionDetails';

interface SessionHistoryListProps {
  sessions: SessionData[];
}

const SessionHistoryList: React.FC<SessionHistoryListProps> = ({ sessions }) => {
  const [selectedSession, setSelectedSession] = useState<SessionData | null>(null);
  
  // Format session date
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  // Format time
  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Format duration
  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    
    if (minutes === 0) {
      return `${seconds}s`;
    }
    
    return `${minutes}m ${seconds}s`;
  };
  
  // View session details
  const viewSession = (session: SessionData) => {
    setSelectedSession(session);
  };
  
  // Close dialog
  const closeDialog = () => {
    setSelectedSession(null);
  };

  return (
    <>
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          {sessions.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground">
              No sessions recorded yet
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Emotions Detected</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sessions.map((session) => (
                    <TableRow key={session.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                          {formatDate(session.startTime)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <ClockIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                          {formatTime(session.startTime)}
                        </div>
                      </TableCell>
                      <TableCell>{formatDuration(session.duration)}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <ChartBarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                          {session.emotionCount}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => viewSession(session)}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Dialog open={selectedSession !== null} onOpenChange={closeDialog}>
        <DialogContent className="max-w-5xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Session Details</DialogTitle>
          </DialogHeader>
          
          {selectedSession && <SessionDetails session={selectedSession} />}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SessionHistoryList;