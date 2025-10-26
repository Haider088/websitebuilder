import { useState, useRef, useEffect } from 'react';
import { CanvasComponent as CanvasComponentType } from '../types';

interface FreeformComponentWrapperProps {
  component: CanvasComponentType;
  isSelected: boolean;
  onPositionChange: (id: string, x: number, y: number, width: number, height: number) => void;
  children: React.ReactNode;
  zoom?: number;
}

export function FreeformComponentWrapper({
  component,
  isSelected,
  onPositionChange,
  children,
  zoom = 100,
}: FreeformComponentWrapperProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState<string>('');
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, componentX: 0, componentY: 0, componentWidth: 0, componentHeight: 0 });
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Default position if not set
  const position = component.freeformPosition || {
    x: 0,
    y: 0,
    width: 400,
    height: 200,
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).classList.contains('resize-handle')) {
      return; // Let resize handler deal with it
    }
    
    e.stopPropagation();
    setIsDragging(true);
    setDragStart({
      x: e.clientX,
      y: e.clientY,
      componentX: position.x,
      componentY: position.y,
      componentWidth: position.width,
      componentHeight: position.height,
    });
  };

  const handleResizeMouseDown = (e: React.MouseEvent, direction: string) => {
    e.stopPropagation();
    setIsResizing(true);
    setResizeDirection(direction);
    setDragStart({
      x: e.clientX,
      y: e.clientY,
      componentX: position.x,
      componentY: position.y,
      componentWidth: position.width,
      componentHeight: position.height,
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const zoomFactor = zoom / 100;
      
      if (isDragging && !isResizing) {
        // Account for zoom when dragging
        const deltaX = (e.clientX - dragStart.x) / zoomFactor;
        const deltaY = (e.clientY - dragStart.y) / zoomFactor;
        const newX = dragStart.componentX + deltaX;
        const newY = dragStart.componentY + deltaY;
        onPositionChange(component.id, newX, newY, position.width, position.height);
      } else if (isResizing) {
        // Account for zoom when resizing
        const deltaX = (e.clientX - dragStart.x) / zoomFactor;
        const deltaY = (e.clientY - dragStart.y) / zoomFactor;
        
        let newX = dragStart.componentX;
        let newY = dragStart.componentY;
        let newWidth = dragStart.componentWidth;
        let newHeight = dragStart.componentHeight;
        
        // Handle different resize directions
        if (resizeDirection.includes('e')) {
          newWidth = Math.max(100, dragStart.componentWidth + deltaX);
        }
        if (resizeDirection.includes('w')) {
          newWidth = Math.max(100, dragStart.componentWidth - deltaX);
          newX = dragStart.componentX + (dragStart.componentWidth - newWidth);
        }
        if (resizeDirection.includes('s')) {
          newHeight = Math.max(50, dragStart.componentHeight + deltaY);
        }
        if (resizeDirection.includes('n')) {
          newHeight = Math.max(50, dragStart.componentHeight - deltaY);
          newY = dragStart.componentY + (dragStart.componentHeight - newHeight);
        }
        
        onPositionChange(component.id, newX, newY, newWidth, newHeight);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
      setResizeDirection('');
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, resizeDirection, dragStart, position, component.id, onPositionChange, zoom]);

  return (
    <div
      ref={wrapperRef}
      className={`absolute group ${isDragging ? 'cursor-grabbing' : 'cursor-grab'} ${
        isSelected ? 'ring-2 ring-primary ring-offset-2' : ''
      }`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${position.width}px`,
        minHeight: `${position.height}px`,
      }}
      onMouseDown={handleMouseDown}
    >
      {children}
      
      {/* Resize handles */}
      {isSelected && (
        <>
          {/* Corner handles */}
          <div
            className="resize-handle absolute -bottom-2 -right-2 w-4 h-4 bg-primary rounded-full cursor-nwse-resize border-2 border-background shadow-lg"
            onMouseDown={(e) => handleResizeMouseDown(e, 'se')}
          />
          <div
            className="resize-handle absolute -top-2 -left-2 w-4 h-4 bg-primary rounded-full cursor-nwse-resize border-2 border-background shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
            onMouseDown={(e) => handleResizeMouseDown(e, 'nw')}
          />
          <div
            className="resize-handle absolute -top-2 -right-2 w-4 h-4 bg-primary rounded-full cursor-nesw-resize border-2 border-background shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
            onMouseDown={(e) => handleResizeMouseDown(e, 'ne')}
          />
          <div
            className="resize-handle absolute -bottom-2 -left-2 w-4 h-4 bg-primary rounded-full cursor-nesw-resize border-2 border-background shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
            onMouseDown={(e) => handleResizeMouseDown(e, 'sw')}
          />
        </>
      )}
    </div>
  );
}
