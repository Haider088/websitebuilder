import { Code } from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'react';
import { LiveComponentRenderer } from './LiveComponentRenderer';

interface CustomComponentRendererProps {
  name: string;
  code: string;
  description?: string;
  props?: Record<string, any>;
}

export function CustomComponentRenderer({ 
  name, 
  code, 
  description,
  props = {} 
}: CustomComponentRendererProps) {
  const [showCode, setShowCode] = useState(false);

  return (
    <div className="group border border-primary/20 rounded-lg overflow-hidden bg-white">
      {/* Compact header - only shows on hover */}
      <div className="bg-gradient-to-r from-primary/5 to-primary/10 px-3 py-2 border-b border-primary/10 opacity-60 group-hover:opacity-100 transition-opacity">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <Code className="w-3.5 h-3.5 text-primary shrink-0" />
            <span className="text-xs font-medium text-primary truncate">{name}</span>
            {description && (
              <span className="text-xs text-muted-foreground truncate hidden sm:inline">
                — {description}
              </span>
            )}
          </div>
          
          <div className="flex gap-1 shrink-0">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs"
              onClick={() => setShowCode(!showCode)}
            >
              {showCode ? 'Hide' : 'Code'}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs"
              onClick={() => navigator.clipboard.writeText(code)}
            >
              Copy
            </Button>
          </div>
        </div>

        {showCode && (
          <div className="mt-2 pt-2 border-t border-primary/10">
            <div className="bg-muted/50 p-2 rounded overflow-auto max-h-48">
              <pre className="text-xs">
                <code>{code}</code>
              </pre>
            </div>
          </div>
        )}
      </div>

      {/* Component render area */}
      <div className="p-4">
        <LiveComponentRenderer code={code} props={props} />
      </div>
    </div>
  );
}
