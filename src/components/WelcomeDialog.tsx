import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Sparkles, Layout, Smartphone, Rocket, Keyboard } from 'lucide-react';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';

const WELCOME_SHOWN_KEY = 'restaurant-builder-welcome-shown';

export function WelcomeDialog() {
  const [open, setOpen] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem(WELCOME_SHOWN_KEY);
    if (!hasSeenWelcome) {
      setOpen(true);
    }
  }, []);

  const handleClose = () => {
    if (dontShowAgain) {
      localStorage.setItem(WELCOME_SHOWN_KEY, 'true');
    }
    setOpen(false);
  };

  const features = [
    {
      icon: Layout,
      title: 'Page Templates',
      description: 'Start with professional templates or build from scratch',
    },
    {
      icon: Smartphone,
      title: 'Mobile Responsive',
      description: 'Your site looks great on all devices automatically',
    },
    {
      icon: Sparkles,
      title: 'Advanced Interactions',
      description: 'Add animations, hover effects, and scroll animations',
    },
    {
      icon: Keyboard,
      title: 'Keyboard Shortcuts',
      description: 'Work faster with built-in keyboard shortcuts',
    },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Rocket className="w-6 h-6 text-primary" />
            Welcome to Restaurant Website Builder!
          </DialogTitle>
          <DialogDescription>
            Everything you need to create a stunning restaurant website
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="flex gap-3 p-4 rounded-lg border border-border bg-muted/50"
              >
                <div className="flex-shrink-0">
                  <feature.icon className="w-5 h-5 text-primary mt-0.5" />
                </div>
                <div>
                  <h4 className="font-medium mb-1">{feature.title}</h4>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-accent/50 border border-border rounded-lg p-4">
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Quick Start Tips
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <span className="flex-shrink-0">•</span>
                <span>Click the <strong>Templates</strong> button to start with a pre-built page</span>
              </li>
              <li className="flex gap-2">
                <span className="flex-shrink-0">•</span>
                <span>Drag components from the left panel onto the canvas</span>
              </li>
              <li className="flex gap-2">
                <span className="flex-shrink-0">•</span>
                <span>Use the right panel to customize colors, text, and settings</span>
              </li>
              <li className="flex gap-2">
                <span className="flex-shrink-0">•</span>
                <span>Press <kbd className="px-1.5 py-0.5 bg-background border border-border rounded text-xs font-mono">Ctrl/Cmd + S</kbd> to save your progress</span>
              </li>
            </ul>
          </div>
        </div>

        <DialogFooter className="flex items-center justify-between sm:justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="dont-show"
              checked={dontShowAgain}
              onCheckedChange={(checked) => setDontShowAgain(checked as boolean)}
            />
            <Label
              htmlFor="dont-show"
              className="text-sm cursor-pointer select-none"
            >
              Don't show this again
            </Label>
          </div>
          <Button onClick={handleClose}>
            Get Started
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
