import { useState } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Keyboard, Command } from 'lucide-react';
import { Separator } from './ui/separator';

interface Shortcut {
  keys: string[];
  description: string;
  category: 'general' | 'editing' | 'navigation' | 'components';
}

const shortcuts: Shortcut[] = [
  // General
  { keys: ['Ctrl/Cmd', 'S'], description: 'Save project', category: 'general' },
  { keys: ['Ctrl/Cmd', 'Z'], description: 'Undo', category: 'general' },
  { keys: ['Ctrl/Cmd', 'Shift', 'Z'], description: 'Redo', category: 'general' },
  { keys: ['Ctrl/Cmd', 'Y'], description: 'Redo (alternative)', category: 'general' },
  
  // Editing
  { keys: ['Ctrl/Cmd', 'C'], description: 'Copy component', category: 'editing' },
  { keys: ['Ctrl/Cmd', 'V'], description: 'Paste component', category: 'editing' },
  { keys: ['Ctrl/Cmd', 'D'], description: 'Duplicate component', category: 'editing' },
  { keys: ['Delete'], description: 'Delete selected component(s)', category: 'editing' },
  { keys: ['Backspace'], description: 'Delete selected component(s)', category: 'editing' },
  { keys: ['Escape'], description: 'Deselect all', category: 'editing' },
  
  // Navigation
  { keys: ['Tab'], description: 'Select next component', category: 'navigation' },
  { keys: ['Shift', 'Tab'], description: 'Select previous component', category: 'navigation' },
  
  // Components
  { keys: ['Ctrl/Cmd', 'Click'], description: 'Multi-select components', category: 'components' },
  { keys: ['Shift', 'Click'], description: 'Select range of components', category: 'components' },
];

const categories = [
  { id: 'general', name: 'General', icon: '⚡' },
  { id: 'editing', name: 'Editing', icon: '✏️' },
  { id: 'navigation', name: 'Navigation', icon: '🧭' },
  { id: 'components', name: 'Components', icon: '🧩' },
];

function KeyBadge({ k }: { k: string }) {
  return (
    <kbd className="px-2 py-1 text-xs font-semibold text-foreground bg-muted border border-border rounded">
      {k}
    </kbd>
  );
}

interface KeyboardShortcutsDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function KeyboardShortcutsDialog({ open: controlledOpen, onOpenChange }: KeyboardShortcutsDialogProps = {}) {
  const [internalOpen, setInternalOpen] = useState(false);
  
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Keyboard className="w-4 h-4" />
          Shortcuts
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Command className="w-5 h-5" />
            Keyboard Shortcuts
          </DialogTitle>
          <DialogDescription>
            Speed up your workflow with these keyboard shortcuts
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-6">
          {categories.map((category) => {
            const categoryShortcuts = shortcuts.filter((s) => s.category === category.id);
            
            return (
              <div key={category.id}>
                <h3 className="flex items-center gap-2 mb-3">
                  <span className="text-lg">{category.icon}</span>
                  <span className="font-medium">{category.name}</span>
                </h3>
                <div className="space-y-2">
                  {categoryShortcuts.map((shortcut, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-accent transition-colors"
                    >
                      <span className="text-sm">{shortcut.description}</span>
                      <div className="flex items-center gap-1">
                        {shortcut.keys.map((key, i) => (
                          <div key={i} className="flex items-center gap-1">
                            <KeyBadge k={key} />
                            {i < shortcut.keys.length - 1 && (
                              <span className="text-xs text-muted-foreground">+</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                {category.id !== 'components' && <Separator className="mt-4" />}
              </div>
            );
          })}
        </div>

        <div className="pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">
            💡 Tip: Most shortcuts work with Ctrl on Windows/Linux and Cmd (⌘) on Mac
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
