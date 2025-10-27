import { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Sparkles, AlertTriangle, CheckCircle, Loader2, Lightbulb, Camera } from 'lucide-react';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { cn } from './ui/utils';
import { AIMessage, AIAction, AIRiskLevel } from '../types/ai';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from './ui/alert';
import { motion, AnimatePresence } from 'motion/react';

interface AIAssistantProps {
  open: boolean;
  onClose: () => void;
  messages: AIMessage[];
  isLoading: boolean;
  isAvailable: boolean;
  suggestions: string[];
  onSendMessage: (message: string, screenshot?: string) => void;
  onExecuteAction: (messageId: string, actions: AIAction[]) => void;
  onUseSuggestion: (suggestion: string) => void;
}

export function AIAssistant({
  open,
  onClose,
  messages,
  isLoading,
  isAvailable,
  suggestions,
  onSendMessage,
  onExecuteAction,
  onUseSuggestion,
}: AIAssistantProps) {
  const [input, setInput] = useState('');
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      // Use setTimeout to ensure DOM has updated
      setTimeout(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }, 100);
    }
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  const handleCaptureScreenshot = async () => {
    setIsCapturing(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      
      // Try to find the canvas area
      const canvasArea = document.querySelector('[data-canvas-area]') as HTMLElement || 
                        document.querySelector('.canvas-wrapper') as HTMLElement ||
                        document.getElementById('canvas-root');
      
      if (canvasArea) {
        const canvas = await html2canvas(canvasArea, {
          scale: 0.5,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          logging: false,
        });
        
        const dataUrl = canvas.toDataURL('image/png');
        setScreenshot(dataUrl);
      }
    } catch (error) {
      console.error('Failed to capture screenshot:', error);
    } finally {
      setIsCapturing(false);
    }
  };

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    
    onSendMessage(input.trim(), screenshot || undefined);
    setInput('');
    setScreenshot(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!open) return null;

  return (
    <motion.div
      initial={{ x: 400 }}
      animate={{ x: 0 }}
      exit={{ x: 400 }}
      transition={{ type: 'spring', damping: 20 }}
      className="fixed right-0 top-0 h-full w-96 bg-background border-l border-border shadow-2xl z-50 flex flex-col"
    >
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Bot className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold">AI Assistant</h2>
            <p className="text-xs text-muted-foreground">
              {isAvailable ? 'Gemini 2.5 Flash' : 'Not configured'}
            </p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Not Available Warning */}
      {!isAvailable && (
        <Alert className="m-4 mb-0">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Setup Required</AlertTitle>
          <AlertDescription className="text-xs space-y-2">
            <p>To use the AI Assistant:</p>
            <ol className="list-decimal list-inside space-y-1 ml-2">
              <li>Install: <code className="bg-muted px-1 rounded">npm install @google/generative-ai</code></li>
              <li>Create .env file from .env.example</li>
              <li>Add your Gemini API key</li>
              <li>Restart dev server</li>
            </ol>
            <a 
              href="https://aistudio.google.com/app/apikey" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline inline-block font-medium"
            >
              Get free API key →
            </a>
            <p className="text-muted-foreground">See INSTALL-AI.txt for details</p>
          </AlertDescription>
        </Alert>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div ref={scrollRef} className="p-4">
            {messages.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex p-4 bg-primary/10 rounded-full mb-4">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">AI-Powered Website Builder</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Tell me what you want to create and I'll help you build it.
            </p>
            
            {/* Quick Suggestions */}
            {suggestions.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 justify-center text-xs text-muted-foreground mb-3">
                  <Lightbulb className="w-3 h-3" />
                  <span>Try asking:</span>
                </div>
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => onUseSuggestion(suggestion)}
                    className="w-full text-left p-3 rounded-lg border border-border hover:bg-accent transition-colors text-sm"
                    disabled={!isAvailable}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  onExecuteActions={() => message.actions && onExecuteAction(message.id, message.actions)}
                />
              ))}
              
              {isLoading && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">AI is thinking...</span>
                </div>
              )}
            </div>
          )}
          </div>
        </ScrollArea>
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border bg-muted/30">
        {screenshot && (
          <div className="mb-2 relative">
            <img src={screenshot} alt="Screenshot preview" className="w-full h-20 object-cover rounded border border-border" />
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-1 right-1 h-6 w-6 bg-background/80 hover:bg-background"
              onClick={() => setScreenshot(null)}
            >
              <X className="w-3 h-3" />
            </Button>
            <Badge className="absolute bottom-1 left-1 text-xs">Screenshot attached 📸</Badge>
          </div>
        )}
        <div className="flex gap-2">
          <Textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isAvailable ? "Ask me anything..." : "Configure API key first"}
            className="min-h-[60px] max-h-[120px] resize-none"
            disabled={!isAvailable || isLoading}
          />
          <div className="flex flex-col gap-2">
            <Button
              onClick={handleCaptureScreenshot}
              disabled={!isAvailable || isLoading || isCapturing}
              size="icon"
              variant="outline"
              className="shrink-0 h-[28px] w-[60px]"
              title="📸 Optional: Capture screenshot so AI can see your design (uses more credits)"
            >
              {isCapturing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Camera className={cn("w-4 h-4", screenshot && "text-primary")} />
              )}
            </Button>
            <Button
              onClick={handleSend}
              disabled={!input.trim() || !isAvailable || isLoading}
              size="icon"
              className="shrink-0 h-[28px] w-[60px]"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          {screenshot ? '📸 Screenshot attached - AI will see what you created' : 'Press Enter to send, Shift+Enter for new line'}
        </p>
      </div>
    </motion.div>
  );
}

function MessageBubble({ 
  message, 
  onExecuteActions 
}: { 
  message: AIMessage;
  onExecuteActions: () => void;
}) {
  const isUser = message.role === 'user';

  return (
    <div className={cn('flex', isUser ? 'justify-end' : 'justify-start')}>
      <div className={cn(
        'max-w-[85%] rounded-lg p-3',
        isUser 
          ? 'bg-primary text-primary-foreground' 
          : 'bg-muted'
      )}>
        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        
        {/* Actions */}
        {message.actions && message.actions.length > 0 && (
          <div className="mt-3 space-y-2">
            {/* Only show "Actions to perform" if there are executable actions */}
            {message.actions.some(a => a.type !== 'explanation') && (
              <div className="text-xs text-muted-foreground mb-2">
                Actions to perform:
              </div>
            )}
            
            {/* Only render ActionCard for non-explanation actions */}
            {message.actions.filter(a => a.type !== 'explanation').map((action, index) => (
              <ActionCard key={index} action={action} />
            ))}
            
            {/* Only show execute button if there are non-explanation actions */}
            {!message.executed && 
             !message.isExecuting && 
             !message.error && 
             message.actions.some(a => a.type !== 'explanation') && (
              <Button 
                onClick={onExecuteActions}
                size="sm"
                className="w-full mt-2"
                variant={message.actions.some(a => a.riskLevel === 'risky') ? 'destructive' : 'default'}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Execute {message.actions.filter(a => a.type !== 'explanation').length} Action{message.actions.filter(a => a.type !== 'explanation').length > 1 ? 's' : ''}
              </Button>
            )}
            
            {message.isExecuting && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Executing...</span>
              </div>
            )}
            
            {message.executed && (
              <div className="flex items-center gap-2 text-sm text-green-600 mt-2">
                <CheckCircle className="w-4 h-4" />
                <span>Executed successfully</span>
              </div>
            )}
            
            {message.error && (
              <Alert variant="destructive" className="mt-2">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  {message.error}
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function ActionCard({ action }: { action: AIAction }) {
  const riskColors: Record<AIRiskLevel, string> = {
    safe: 'bg-green-500/10 text-green-700 border-green-500/20',
    moderate: 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20',
    risky: 'bg-red-500/10 text-red-700 border-red-500/20',
  };

  return (
    <div className="text-xs p-2 rounded border bg-background">
      <div className="flex items-center justify-between mb-1">
        <span className="font-medium">{action.type}</span>
        <Badge 
          variant="outline" 
          className={cn('text-xs', riskColors[action.riskLevel])}
        >
          {action.riskLevel}
        </Badge>
      </div>
      <p className="text-muted-foreground">{action.description}</p>
      {/* Debug: Show action data */}
      <details className="mt-2">
        <summary className="cursor-pointer text-muted-foreground hover:text-foreground">View data</summary>
        <pre className="mt-1 p-2 bg-muted rounded text-xs overflow-auto max-h-32 whitespace-pre-wrap break-all">
          {JSON.stringify(action.data, null, 2)}
        </pre>
      </details>
    </div>
  );
}
