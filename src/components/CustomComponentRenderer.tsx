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
    <div className="border-2 border-primary/30 rounded-lg p-6 bg-gradient-to-br from-primary/5 to-primary/10">
      <div className="flex items-start gap-4 mb-4">
        <div className="p-2 bg-primary/20 rounded-lg">
          <Code className="w-5 h-5 text-primary" />
        </div>
        
        <div className="flex-1">
          <h3 className="font-semibold text-base mb-1">{name}</h3>
          {description && (
            <p className="text-xs text-muted-foreground mb-2">{description}</p>
          )}
          
          <div className="flex gap-2 mb-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCode(!showCode)}
            >
              {showCode ? 'Hide Code' : 'View Code'}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                console.log('📋 Custom Component Code:', {
                  name,
                  description,
                  code,
                  props,
                });
                navigator.clipboard.writeText(code);
              }}
            >
              Copy Code
            </Button>
          </div>

          {showCode && (
            <div className="mb-3">
              <div className="bg-muted p-3 rounded-lg overflow-auto max-h-64">
                <pre className="text-xs">
                  <code>{code}</code>
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg p-4 shadow-sm border">
        <LiveComponentRenderer code={code} props={props} />
      </div>
    </div>
  );
}
