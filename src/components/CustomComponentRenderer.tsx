import { AlertTriangle, Code } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Button } from './ui/button';
import { useState } from 'react';

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
    <div className="border-2 border-dashed border-primary/50 rounded-lg p-6 bg-primary/5">
      <div className="flex items-start gap-4">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Code className="w-6 h-6 text-primary" />
        </div>
        
        <div className="flex-1">
          <h3 className="font-semibold text-lg mb-1">{name}</h3>
          {description && (
            <p className="text-sm text-muted-foreground mb-3">{description}</p>
          )}
          
          <Alert className="mb-3">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Custom Component (Experimental)</AlertTitle>
            <AlertDescription className="text-xs">
              This is AI-generated code. In a production environment, this would be 
              compiled and rendered. For now, review the code in the console or below.
            </AlertDescription>
          </Alert>

          <div className="flex gap-2">
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
            <div className="mt-4">
              <div className="bg-muted p-4 rounded-lg overflow-auto max-h-96">
                <pre className="text-xs">
                  <code>{code}</code>
                </pre>
              </div>
            </div>
          )}

          {Object.keys(props).length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Component Props:</h4>
              <div className="bg-muted p-3 rounded-lg">
                <pre className="text-xs">
                  <code>{JSON.stringify(props, null, 2)}</code>
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
