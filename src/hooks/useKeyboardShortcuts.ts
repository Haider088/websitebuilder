import { useEffect } from 'react';

interface ShortcutHandlers {
  onUndo?: () => void;
  onRedo?: () => void;
  onDelete?: () => void;
  onCopy?: () => void;
  onPaste?: () => void;
  onDuplicate?: () => void;
  onSelectAll?: () => void;
  onSave?: () => void;
}

export function useKeyboardShortcuts(handlers: ShortcutHandlers) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const modifier = isMac ? e.metaKey : e.ctrlKey;

      // Undo - Ctrl/Cmd + Z
      if (modifier && e.key === 'z' && !e.shiftKey && handlers.onUndo) {
        e.preventDefault();
        handlers.onUndo();
      }
      
      // Redo - Ctrl/Cmd + Shift + Z or Ctrl/Cmd + Y
      else if (
        (modifier && e.key === 'z' && e.shiftKey && handlers.onRedo) ||
        (modifier && e.key === 'y' && handlers.onRedo)
      ) {
        e.preventDefault();
        handlers.onRedo();
      }
      
      // Delete - Delete or Backspace
      else if ((e.key === 'Delete' || e.key === 'Backspace') && handlers.onDelete) {
        // Only delete if not focused on an input element
        const target = e.target as HTMLElement;
        if (
          target.tagName !== 'INPUT' &&
          target.tagName !== 'TEXTAREA' &&
          !target.isContentEditable
        ) {
          e.preventDefault();
          handlers.onDelete();
        }
      }
      
      // Copy - Ctrl/Cmd + C
      else if (modifier && e.key === 'c' && handlers.onCopy) {
        const target = e.target as HTMLElement;
        if (
          target.tagName !== 'INPUT' &&
          target.tagName !== 'TEXTAREA' &&
          !target.isContentEditable
        ) {
          e.preventDefault();
          handlers.onCopy();
        }
      }
      
      // Paste - Ctrl/Cmd + V
      else if (modifier && e.key === 'v' && handlers.onPaste) {
        const target = e.target as HTMLElement;
        if (
          target.tagName !== 'INPUT' &&
          target.tagName !== 'TEXTAREA' &&
          !target.isContentEditable
        ) {
          e.preventDefault();
          handlers.onPaste();
        }
      }
      
      // Duplicate - Ctrl/Cmd + D
      else if (modifier && e.key === 'd' && handlers.onDuplicate) {
        e.preventDefault();
        handlers.onDuplicate();
      }
      
      // Select All - Ctrl/Cmd + A
      else if (modifier && e.key === 'a' && handlers.onSelectAll) {
        const target = e.target as HTMLElement;
        if (
          target.tagName !== 'INPUT' &&
          target.tagName !== 'TEXTAREA' &&
          !target.isContentEditable
        ) {
          e.preventDefault();
          handlers.onSelectAll();
        }
      }
      
      // Save - Ctrl/Cmd + S
      else if (modifier && e.key === 's' && handlers.onSave) {
        e.preventDefault();
        handlers.onSave();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlers]);
}
