import { ReactNode } from 'react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from './ui/context-menu';
import { Copy, Clipboard, Trash2, Eye, EyeOff, Lock, Unlock, MoveUp, MoveDown, Layers } from 'lucide-react';

interface ComponentContextMenuProps {
  children: ReactNode;
  canMoveUp: boolean;
  canMoveDown: boolean;
  isVisible: boolean;
  isLocked: boolean;
  onCopy: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onToggleVisibility: () => void;
  onToggleLock: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onBringToFront?: () => void;
  onSendToBack?: () => void;
}

export function ComponentContextMenu({
  children,
  canMoveUp,
  canMoveDown,
  isVisible,
  isLocked,
  onCopy,
  onDuplicate,
  onDelete,
  onToggleVisibility,
  onToggleLock,
  onMoveUp,
  onMoveDown,
  onBringToFront,
  onSendToBack,
}: ComponentContextMenuProps) {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent className="w-56">
        <ContextMenuItem onClick={onCopy}>
          <Copy className="w-4 h-4 mr-2" />
          Copy
          <ContextMenuShortcut>⌘C</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem onClick={onDuplicate}>
          <Clipboard className="w-4 h-4 mr-2" />
          Duplicate
          <ContextMenuShortcut>⌘D</ContextMenuShortcut>
        </ContextMenuItem>

        <ContextMenuSeparator />

        <ContextMenuItem onClick={onMoveUp} disabled={!canMoveUp}>
          <MoveUp className="w-4 h-4 mr-2" />
          Move Up
        </ContextMenuItem>
        <ContextMenuItem onClick={onMoveDown} disabled={!canMoveDown}>
          <MoveDown className="w-4 h-4 mr-2" />
          Move Down
        </ContextMenuItem>

        {(onBringToFront || onSendToBack) && (
          <>
            <ContextMenuSeparator />
            {onBringToFront && (
              <ContextMenuItem onClick={onBringToFront}>
                <Layers className="w-4 h-4 mr-2" />
                Bring to Front
              </ContextMenuItem>
            )}
            {onSendToBack && (
              <ContextMenuItem onClick={onSendToBack}>
                <Layers className="w-4 h-4 mr-2" />
                Send to Back
              </ContextMenuItem>
            )}
          </>
        )}

        <ContextMenuSeparator />

        <ContextMenuItem onClick={onToggleVisibility}>
          {isVisible ? (
            <>
              <EyeOff className="w-4 h-4 mr-2" />
              Hide
            </>
          ) : (
            <>
              <Eye className="w-4 h-4 mr-2" />
              Show
            </>
          )}
        </ContextMenuItem>

        <ContextMenuItem onClick={onToggleLock}>
          {isLocked ? (
            <>
              <Unlock className="w-4 h-4 mr-2" />
              Unlock
            </>
          ) : (
            <>
              <Lock className="w-4 h-4 mr-2" />
              Lock
            </>
          )}
        </ContextMenuItem>

        <ContextMenuSeparator />

        <ContextMenuItem onClick={onDelete} className="text-destructive focus:text-destructive">
          <Trash2 className="w-4 h-4 mr-2" />
          Delete
          <ContextMenuShortcut>⌫</ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
