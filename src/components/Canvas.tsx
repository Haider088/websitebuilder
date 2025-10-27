import { useState } from 'react';
import { Monitor, Tablet, Smartphone, ZoomIn, ZoomOut, Grid3x3, Plus, Info, HelpCircle } from 'lucide-react';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { CanvasComponent as CanvasComponentType, DeviceType, RestaurantComponent, LayoutMode } from '../types';
import { CanvasComponent } from './CanvasComponent';
import { FreeformComponentWrapper } from './FreeformComponentWrapper';
import { Badge } from './ui/badge';
import { ResponsiveGuide } from './ResponsiveGuide';
import { EmptyState } from './EmptyState';

interface CanvasProps {
  components: CanvasComponentType[];
  selectedComponentIds: string[];
  onSelectComponent: (id: string | null, multiSelect?: boolean) => void;
  onDrop: (component: RestaurantComponent, parentId?: string) => void;
  draggedComponent: RestaurantComponent | null;
  deviceType?: DeviceType;
  onDeviceChange?: (device: DeviceType) => void;
  onOpenTemplates?: () => void;
  layoutMode?: LayoutMode;
  onComponentPositionChange?: (id: string, x: number, y: number, width: number, height: number) => void;
}

const deviceWidths = {
  desktop: '100%',
  tablet: '768px',
  mobile: '375px',
};

export function Canvas({
  components,
  selectedComponentIds,
  onSelectComponent,
  onDrop,
  draggedComponent,
  deviceType: controlledDevice,
  onDeviceChange,
  onOpenTemplates,
  layoutMode = 'stack',
  onComponentPositionChange,
}: CanvasProps) {
  const [internalDevice, setInternalDevice] = useState<DeviceType>('desktop');
  const [zoom, setZoom] = useState(100);
  const [showGrid, setShowGrid] = useState(false);
  const [showResponsiveInfo, setShowResponsiveInfo] = useState(true);
  const [showResponsiveGuide, setShowResponsiveGuide] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const device = controlledDevice || internalDevice;
  const setDevice = (newDevice: DeviceType) => {
    if (onDeviceChange) {
      onDeviceChange(newDevice);
    } else {
      setInternalDevice(newDevice);
    }
  };

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 10, 200));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 10, 50));

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = () => {
    setIsDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    if (draggedComponent) {
      onDrop(draggedComponent);
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-muted/20 overflow-hidden">
      {/* Toolbar */}
      <div className="bg-background border-b border-border px-4 py-2 flex items-center justify-center gap-4 flex-shrink-0">
        <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
          <button
            onClick={() => setDevice('desktop')}
            className={`p-2 rounded transition-colors ${
              device === 'desktop' ? 'bg-background shadow-sm' : 'hover:bg-background/50'
            }`}
            aria-label="Desktop view"
            title="Desktop (100%)"
          >
            <Monitor className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDevice('tablet')}
            className={`p-2 rounded transition-colors ${
              device === 'tablet' ? 'bg-background shadow-sm' : 'hover:bg-background/50'
            }`}
            aria-label="Tablet view"
            title="Tablet (768px)"
          >
            <Tablet className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDevice('mobile')}
            className={`p-2 rounded transition-colors ${
              device === 'mobile' ? 'bg-background shadow-sm' : 'hover:bg-background/50'
            }`}
            aria-label="Mobile view"
            title="Mobile (375px)"
          >
            <Smartphone className="w-4 h-4" />
          </button>
        </div>
        
        {/* Current Device Label */}
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            {device === 'desktop' && 'Desktop'}
            {device === 'tablet' && 'Tablet (768px)'}
            {device === 'mobile' && 'Mobile (375px)'}
          </Badge>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => setShowResponsiveGuide(true)}
          title="Responsive Design Guide"
        >
          <HelpCircle className="w-3.5 h-3.5" />
        </Button>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">{zoom}%</span>
          
          <div className="h-4 w-px bg-border" />
          
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleZoomOut}
            disabled={zoom <= 50}
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleZoomIn}
            disabled={zoom >= 200}
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </Button>
          
          <div className="h-4 w-px bg-border" />
          
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setShowGrid(!showGrid)}
          >
            <Grid3x3 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Canvas Area */}
      <ScrollArea className="flex-1">
        <div className="p-8 min-h-full flex items-start justify-center">
          <div className="relative">
            {/* Device Frame Label */}
            {device !== 'desktop' && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-xs text-muted-foreground px-3 py-1 bg-background border border-border rounded-full z-20">
                {device === 'tablet' ? 'iPad (768px)' : 'iPhone (375px)'}
              </div>
            )}
            
            <div
              data-canvas-area="true"
              className={`bg-background shadow-lg transition-all duration-200 relative ${
                device === 'mobile' ? 'rounded-[3rem] border-[14px] border-gray-800' : 
                device === 'tablet' ? 'rounded-[2rem] border-[12px] border-gray-700' : ''
              }`}
              style={{
                width: device === 'desktop' ? '1400px' : deviceWidths[device],
                minHeight: '1400px',
                transform: `scale(${zoom / 100})`,
                transformOrigin: 'top center',
              }}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
            {/* Grid Overlay */}
            {(showGrid || layoutMode === 'freeform') && (
              <div
                className="absolute inset-0 pointer-events-none z-0"
                style={{
                  backgroundImage: layoutMode === 'freeform' 
                    ? `repeating-linear-gradient(to right, rgba(99, 102, 241, 0.1) 0px, rgba(99, 102, 241, 0.1) 1px, transparent 1px, transparent calc(100% / 12))`
                    : `
                      linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px),
                      linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)
                    `,
                  backgroundSize: layoutMode === 'freeform' ? '100% 100%' : '20px 20px',
                }}
              />
            )}

            <div className={`relative z-10 ${
              layoutMode === 'freeform' ? '' : 'space-y-6'
            } ${
              device === 'mobile' ? 'p-4' : device === 'tablet' ? 'p-6' : 'p-8'
            } ${
              layoutMode === 'freeform' ? 'min-h-[1200px]' : ''
            }`}>
              {/* Responsive Design Info */}
              {device !== 'desktop' && showResponsiveInfo && (
                <div className={`bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg flex items-start gap-3 ${
                  device === 'mobile' ? 'p-3' : 'p-4'
                }`}>
                  <Info className={`${device === 'mobile' ? 'w-4 h-4' : 'w-5 h-5'} text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5`} />
                  <div className="flex-1">
                    <h4 className={`${device === 'mobile' ? 'text-xs' : 'text-sm'} text-blue-900 dark:text-blue-100 mb-1`}>
                      {device === 'mobile' ? 'Mobile' : 'Tablet'} Preview Mode
                    </h4>
                    <p className={`${device === 'mobile' ? 'text-[11px]' : 'text-xs'} text-blue-700 dark:text-blue-300`}>
                      Components may have responsive overrides active. Use the Responsive tab in the Property Inspector to customize mobile and tablet behavior.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowResponsiveInfo(false)}
                    className={`text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 ${device === 'mobile' ? 'text-[11px]' : 'text-xs'}`}
                  >
                    Dismiss
                  </button>
                </div>
              )}
              
              {components.length === 0 ? (
                <div
                  className={`border-2 border-dashed rounded-lg transition-colors min-h-[500px] ${
                    isDraggingOver
                      ? 'border-primary bg-primary/5'
                      : 'border-border'
                  }`}
                >
                  <EmptyState onOpenTemplates={onOpenTemplates} />
                </div>
              ) : (
                <>
                  {components.map((component) => {
                    // Check responsive visibility
                    const hideOnMobile = component.responsiveProps?.hideOnMobile && device === 'mobile';
                    const hideOnTablet = component.responsiveProps?.hideOnTablet && device === 'tablet';
                    const hideOnDesktop = component.responsiveProps?.hideOnDesktop && device === 'desktop';
                    
                    if (hideOnMobile || hideOnTablet || hideOnDesktop) {
                      return (
                        <div key={component.id} className="border-2 border-dashed border-muted rounded-lg p-4 bg-muted/20">
                          <p className="text-sm text-muted-foreground text-center">
                            {component.name} - Hidden on {device}
                          </p>
                        </div>
                      );
                    }
                    
                    const canvasComponent = (
                      <CanvasComponent
                        key={component.id}
                        component={component}
                        isSelected={selectedComponentIds.includes(component.id)}
                        deviceType={device}
                        onSelect={(e: React.MouseEvent) => {
                          const multiSelect = e.ctrlKey || e.metaKey;
                          onSelectComponent(component.id, multiSelect);
                        }}
                        onDropIntoContainer={(parentId) => {
                          if (draggedComponent) {
                            onDrop(draggedComponent, parentId);
                          }
                        }}
                        draggedComponent={draggedComponent}
                      />
                    );
                    
                    // Wrap in freeform wrapper if in freeform mode
                    if (layoutMode === 'freeform' && onComponentPositionChange) {
                      return (
                        <FreeformComponentWrapper
                          key={component.id}
                          component={component}
                          isSelected={selectedComponentIds.includes(component.id)}
                          onPositionChange={onComponentPositionChange}
                          zoom={zoom}
                          allComponents={components}
                        >
                          {canvasComponent}
                        </FreeformComponentWrapper>
                      );
                    }
                    
                    return canvasComponent;
                  })}
                  
                  {/* Drop Zone at the end */}
                  <div
                    className={`border-2 border-dashed rounded-lg text-center transition-colors ${
                      device === 'mobile' ? 'p-6' : 'p-8'
                    } ${
                      isDraggingOver
                        ? 'border-primary bg-primary/5'
                        : 'border-transparent hover:border-border'
                    }`}
                  >
                    <Plus className={`mx-auto text-muted-foreground ${
                      device === 'mobile' ? 'w-6 h-6' : 'w-8 h-8'
                    }`} />
                    <p className={`text-muted-foreground ${device === 'mobile' ? 'text-sm' : ''}`}>Drop component here</p>
                  </div>
                </>
              )}
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>

      <ResponsiveGuide
        isOpen={showResponsiveGuide}
        onClose={() => setShowResponsiveGuide(false)}
      />
    </div>
  );
}
