import { Monitor, Tablet, Smartphone, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

interface ResponsiveGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ResponsiveGuide({ isOpen, onClose }: ResponsiveGuideProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Responsive Design Guide</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-sm mb-3">Device Breakpoints</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <Monitor className="w-5 h-5 text-muted-foreground" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm">Desktop</span>
                    <Badge variant="secondary" className="text-xs">Default</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Full width - No maximum constraints
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <Tablet className="w-5 h-5 text-muted-foreground" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm">Tablet</span>
                    <Badge variant="secondary" className="text-xs">768px</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    iPad and similar tablet devices
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <Smartphone className="w-5 h-5 text-muted-foreground" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm">Mobile</span>
                    <Badge variant="secondary" className="text-xs">375px</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    iPhone and similar smartphone devices
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm mb-3">Responsive Settings</h3>
            <div className="space-y-3 text-sm">
              <div className="p-3 bg-muted rounded-lg">
                <h4 className="mb-1">Visibility Controls</h4>
                <p className="text-xs text-muted-foreground">
                  Hide components on specific devices. Hidden components will show a placeholder in the canvas to help you track their position.
                </p>
              </div>
              
              <div className="p-3 bg-muted rounded-lg">
                <h4 className="mb-1">Mobile Overrides</h4>
                <p className="text-xs text-muted-foreground">
                  Customize text alignment, padding, and width specifically for mobile devices. These settings only apply when viewing on mobile.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm mb-3">Best Practices</h3>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Test your design on all device sizes before publishing</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Use mobile padding overrides to ensure content isn't too cramped on small screens</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Consider hiding complex navigation on mobile and showing a simplified version</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Ensure buttons and interactive elements are large enough for touch on mobile (minimum 44x44px)</span>
              </li>
            </ul>
          </div>

          <div className="flex justify-end">
            <Button onClick={onClose}>Got it!</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
