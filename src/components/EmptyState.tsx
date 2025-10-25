import { Sparkles, MousePointer2, Layout } from 'lucide-react';
import { Button } from './ui/button';

interface EmptyStateProps {
  onOpenTemplates?: () => void;
}

export function EmptyState({ onOpenTemplates }: EmptyStateProps) {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center max-w-md px-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
          <Layout className="w-8 h-8 text-primary" />
        </div>
        
        <h3 className="mb-2">Start Building Your Restaurant Website</h3>
        
        <p className="text-muted-foreground mb-6">
          Drag components from the left panel to start building, or choose from our pre-made templates to get started quickly.
        </p>
        
        <div className="flex flex-col gap-3 items-center">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MousePointer2 className="w-4 h-4" />
            <span>Drag components here to add them to your page</span>
          </div>
          
          {onOpenTemplates && (
            <Button onClick={onOpenTemplates} className="gap-2">
              <Sparkles className="w-4 h-4" />
              Browse Page Templates
            </Button>
          )}
        </div>
        
        <div className="mt-8 pt-6 border-t border-border">
          <p className="text-xs text-muted-foreground">
            💡 Tip: Press <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl + K</kbd> to see all keyboard shortcuts
          </p>
        </div>
      </div>
    </div>
  );
}
