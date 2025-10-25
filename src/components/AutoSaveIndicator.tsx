import { useState, useEffect } from 'react';
import { Cloud, CloudOff, Loader2 } from 'lucide-react';
import { cn } from './ui/utils';

interface AutoSaveIndicatorProps {
  lastSaved?: number;
  isSaving?: boolean;
}

export function AutoSaveIndicator({ lastSaved, isSaving = false }: AutoSaveIndicatorProps) {
  const [timeAgo, setTimeAgo] = useState('');

  useEffect(() => {
    if (!lastSaved) return;

    const updateTimeAgo = () => {
      const seconds = Math.floor((Date.now() - lastSaved) / 1000);
      
      if (seconds < 5) {
        setTimeAgo('Just now');
      } else if (seconds < 60) {
        setTimeAgo(`${seconds}s ago`);
      } else if (seconds < 3600) {
        const minutes = Math.floor(seconds / 60);
        setTimeAgo(`${minutes}m ago`);
      } else {
        const hours = Math.floor(seconds / 3600);
        setTimeAgo(`${hours}h ago`);
      }
    };

    updateTimeAgo();
    const interval = setInterval(updateTimeAgo, 1000);

    return () => clearInterval(interval);
  }, [lastSaved]);

  if (isSaving) {
    return (
      <div className="flex items-center gap-2 px-3 py-1 text-sm text-muted-foreground">
        <Loader2 className="w-3 h-3 animate-spin" />
        <span>Saving...</span>
      </div>
    );
  }

  if (!lastSaved) {
    return (
      <div className="flex items-center gap-2 px-3 py-1 text-sm text-muted-foreground">
        <CloudOff className="w-3 h-3" />
        <span>Not saved</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 px-3 py-1 text-sm text-muted-foreground transition-opacity hover:opacity-70">
      <Cloud className="w-3 h-3 text-green-600" />
      <span>Saved {timeAgo}</span>
    </div>
  );
}
