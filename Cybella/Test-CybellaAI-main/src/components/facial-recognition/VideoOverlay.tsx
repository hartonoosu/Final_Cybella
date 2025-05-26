
import React from 'react';

interface VideoOverlayProps {
  loading: boolean;
  errorMessage?: string | null;
}

const VideoOverlay: React.FC<VideoOverlayProps> = ({ loading, errorMessage }) => {
  if (!loading && !errorMessage) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/10 z-20">
      <div className="flex flex-col items-center space-y-2">
        {loading && (
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        )}
        {errorMessage && (
          <p className="text-sm text-center text-amber-500 bg-black/20 px-2 py-1 rounded">
            {errorMessage}
          </p>
        )}
      </div>
    </div>
  );
};

export default VideoOverlay;
