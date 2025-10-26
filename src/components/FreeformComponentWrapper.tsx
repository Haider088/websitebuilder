import { useState, useRef, useEffect } from 'react';
import { CanvasComponent as CanvasComponentType } from '../types';

interface FreeformComponentWrapperProps {
  component: CanvasComponentType;
  isSelected: boolean;
  onPositionChange: (id: string, x: number, y: number, width: number, height: number) => void;
  children: React.ReactNode;
  zoom?: number;
  allComponents?: CanvasComponentType[];
}

export function FreeformComponentWrapper({
  component,
  isSelected,
  onPositionChange,
  children,
  zoom = 100,
  allComponents = [],
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

  // Snap threshold in pixels (at 100% zoom)
  const SNAP_THRESHOLD = 10;

  // Helper function to snap coordinates to nearby components
  const snapToComponents = (
    x: number, 
    y: number, 
    width: number, 
    height: number, 
    direction: string = ''
  ) => {
    let snappedX = x;
    let snappedY = y;
    let snappedWidth = width;
    let snappedHeight = height;
    
    const currentRight = x + width;
    const currentBottom = y + height;
    
    // Check against all other components
    allComponents.forEach((otherComp) => {
      if (otherComp.id === component.id || !otherComp.freeformPosition) return;
      
      const other = otherComp.freeformPosition;
      const otherRight = other.x + other.width;
      const otherBottom = other.y + other.height;
      
      // When resizing west edge or dragging
      if (!direction || direction.includes('w') || direction === '') {
        // Snap left edge to other's right edge
        if (Math.abs(x - otherRight) < SNAP_THRESHOLD) {
          if (direction.includes('w')) {
            snappedWidth = width + (x - otherRight);
            snappedX = otherRight;
          } else {
            snappedX = otherRight;
          }
        }
        // Snap left edge to other's left edge
        if (Math.abs(x - other.x) < SNAP_THRESHOLD) {
          if (direction.includes('w')) {
            snappedWidth = width + (x - other.x);
            snappedX = other.x;
          } else {
            snappedX = other.x;
          }
        }
      }
      
      // When resizing east edge or dragging
      if (!direction || direction.includes('e') || direction === '') {
        // Snap right edge to other's left edge
        if (Math.abs(currentRight - other.x) < SNAP_THRESHOLD) {
          if (direction.includes('e')) {
            snappedWidth = other.x - x;
          } else {
            snappedX = other.x - width;
          }
        }
        // Snap right edge to other's right edge
        if (Math.abs(currentRight - otherRight) < SNAP_THRESHOLD) {
          if (direction.includes('e')) {
            snappedWidth = otherRight - x;
          } else {
            snappedX = otherRight - width;
          }
        }
      }
      
      // When resizing north edge or dragging
      if (!direction || direction.includes('n') || direction === '') {
        // Snap top edge to other's bottom edge
        if (Math.abs(y - otherBottom) < SNAP_THRESHOLD) {
          if (direction.includes('n')) {
            snappedHeight = height + (y - otherBottom);
            snappedY = otherBottom;
          } else {
            snappedY = otherBottom;
          }
        }
        // Snap top edge to other's top edge
        if (Math.abs(y - other.y) < SNAP_THRESHOLD) {
          if (direction.includes('n')) {
            snappedHeight = height + (y - other.y);
            snappedY = other.y;
          } else {
            snappedY = other.y;
          }
        }
      }
      
      // When resizing south edge or dragging
      if (!direction || direction.includes('s') || direction === '') {
        // Snap bottom edge to other's top edge
        if (Math.abs(currentBottom - other.y) < SNAP_THRESHOLD) {
          if (direction.includes('s')) {
            snappedHeight = other.y - y;
          } else {
            snappedY = other.y - height;
          }
        }
        // Snap bottom edge to other's bottom edge
        if (Math.abs(currentBottom - otherBottom) < SNAP_THRESHOLD) {
          if (direction.includes('s')) {
            snappedHeight = otherBottom - y;
          } else {
            snappedY = otherBottom - height;
          }
        }
      }
    });
    
    return { x: snappedX, y: snappedY, width: snappedWidth, height: snappedHeight };
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
        let newX = dragStart.componentX + deltaX;
        let newY = dragStart.componentY + deltaY;
        
        // Apply snapping (no direction means dragging)
        const snapped = snapToComponents(newX, newY, position.width, position.height, '');
        
        onPositionChange(component.id, snapped.x, snapped.y, snapped.width, snapped.height);
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
        
        // Apply snapping when resizing with direction
        const snapped = snapToComponents(newX, newY, newWidth, newHeight, resizeDirection);
        
        onPositionChange(component.id, snapped.x, snapped.y, snapped.width, snapped.height);
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
          
          {/* Edge handles */}
          <div
            className="resize-handle absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-primary rounded-full cursor-ns-resize border-2 border-background shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
            onMouseDown={(e) => handleResizeMouseDown(e, 'n')}
          />
          <div
            className="resize-handle absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-primary rounded-full cursor-ns-resize border-2 border-background shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
            onMouseDown={(e) => handleResizeMouseDown(e, 's')}
          />
          <div
            className="resize-handle absolute top-1/2 -translate-y-1/2 -left-2 w-4 h-4 bg-primary rounded-full cursor-ew-resize border-2 border-background shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
            onMouseDown={(e) => handleResizeMouseDown(e, 'w')}
          />
          <div
            className="resize-handle absolute top-1/2 -translate-y-1/2 -right-2 w-4 h-4 bg-primary rounded-full cursor-ew-resize border-2 border-background shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
            onMouseDown={(e) => handleResizeMouseDown(e, 'e')}
          />
        </>
      )}
    </div>
  );
}
