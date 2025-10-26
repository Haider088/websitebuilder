import { useState, useRef, useEffect } from 'react';
import { CanvasComponent as CanvasComponentType } from '../types';

interface FreeformComponentWrapperProps {
  component: CanvasComponentType;
  isSelected: boolean;
  onPositionChange: (id: string, x: number, y: number, width: number, height: number) => void;
  children: React.ReactNode;
}

export function FreeformComponentWrapper({
  component,
  isSelected,
  onPositionChange,
  children,
}: FreeformComponentWrapperProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
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
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleResizeMouseDown = (e: React.MouseEvent, direction: string) => {
    e.stopPropagation();
    setIsResizing(true);
    setDragStart({
      x: e.clientX,
      y: e.clientY,
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && !isResizing) {
        const newX = e.clientX - dragStart.x;
        const newY = e.clientY - dragStart.y;
        onPositionChange(component.id, newX, newY, position.width, position.height);
      } else if (isResizing) {
        const deltaX = e.clientX - dragStart.x;
        const deltaY = e.clientY - dragStart.y;
        const newWidth = Math.max(100, position.width + deltaX);
        const newHeight = Math.max(50, position.height + deltaY);
        onPositionChange(component.id, position.x, position.y, newWidth, newHeight);
        setDragStart({ x: e.clientX, y: e.clientY });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, dragStart, position, component.id, onPositionChange]);

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
