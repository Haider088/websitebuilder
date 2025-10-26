import { X, Smartphone, Tablet, Monitor } from 'lucide-react';
import { Button } from './ui/button';
import { DeviceType, Page } from '../types';
import { CanvasComponent as CanvasComponentRenderer } from './CanvasComponent';
import { cn } from './ui/utils';

interface PreviewModeProps {
  pages: Page[];
  currentPageId: string;
  deviceType: DeviceType;
  onClose: () => void;
  onDeviceChange: (device: DeviceType) => void;
  onPageChange: (pageId: string) => void;
}

export function PreviewMode({
  pages,
  currentPageId,
  deviceType,
  onClose,
  onDeviceChange,
  onPageChange,
}: PreviewModeProps) {
  const currentPage = pages.find((p) => p.id === currentPageId);
  const components = currentPage?.components || [];

  const deviceSizes = {
    desktop: 'w-full',
    tablet: 'w-[768px]',
    mobile: 'w-[375px]',
  };

  // Calculate canvas height for freeform mode
  const canvasHeight = currentPage?.layoutMode === 'freeform'
    ? Math.max(
        1400,
        ...components
          .filter(c => c.freeformPosition)
          .map(c => (c.freeformPosition!.y + c.freeformPosition!.height))
      )
    : undefined;

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      {/* Preview Header */}
      <div className="h-14 border-b border-border bg-background flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <h2 className="text-lg">Preview Mode</h2>
          
          {/* Page Navigation */}
          <div className="flex gap-1">
            {pages.map((page) => (
              <Button
                key={page.id}
                variant={currentPageId === page.id ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onPageChange(page.id)}
              >
                {page.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Device Toggle */}
        <div className="flex items-center gap-2">
          <div className="flex bg-muted rounded-lg p-1">
            <button
              onClick={() => onDeviceChange('desktop')}
              className={cn(
                'p-2 rounded transition-colors',
                deviceType === 'desktop' ? 'bg-background shadow-sm' : 'hover:bg-background/50'
              )}
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDeviceChange('tablet')}
              className={cn(
                'p-2 rounded transition-colors',
                deviceType === 'tablet' ? 'bg-background shadow-sm' : 'hover:bg-background/50'
              )}
            >
              <Tablet className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDeviceChange('mobile')}
              className={cn(
                'p-2 rounded transition-colors',
                deviceType === 'mobile' ? 'bg-background shadow-sm' : 'hover:bg-background/50'
              )}
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>

          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4 mr-2" />
            Exit Preview
          </Button>
        </div>
      </div>

      {/* Preview Canvas */}
      <div className="flex-1 bg-muted overflow-auto">
        <div className={`min-h-full flex items-start justify-center ${deviceType === 'mobile' ? 'p-4' : 'p-8'}`}>
          <div
            className={cn(
              'bg-white shadow-2xl transition-all duration-300 min-h-screen',
              deviceType === 'mobile' && 'rounded-[2rem] border-8 border-gray-800',
              deviceType === 'tablet' && 'rounded-xl border-4 border-gray-700',
              deviceSizes[deviceType]
            )}
          >
            {components.length === 0 ? (
              <div className="flex items-center justify-center min-h-screen text-muted-foreground">
                <div className="text-center">
                  <p>No components added yet</p>
                  <p className="text-sm mt-2">Exit preview mode to start building</p>
                </div>
              </div>
            ) : (
              <div 
                className={`w-full ${deviceType === 'mobile' ? 'overflow-hidden rounded-[1.5rem]' : ''} ${currentPage?.layoutMode === 'freeform' ? 'relative' : ''}`}
                style={canvasHeight ? { minHeight: `${canvasHeight}px` } : undefined}
              >
                {components
                  .filter((c) => {
                    // Filter based on responsive visibility
                    if (c.props?.visible === false) return false;
                    const hideOnMobile = c.responsiveProps?.hideOnMobile && deviceType === 'mobile';
                    const hideOnTablet = c.responsiveProps?.hideOnTablet && deviceType === 'tablet';
                    const hideOnDesktop = c.responsiveProps?.hideOnDesktop && deviceType === 'desktop';
                    return !hideOnMobile && !hideOnTablet && !hideOnDesktop;
                  })
                  .map((component) => {
                    // For freeform mode, apply absolute positioning
                    if (currentPage?.layoutMode === 'freeform' && component.freeformPosition) {
                      return (
                        <div
                          key={component.id}
                          className="absolute"
                          style={{
                            left: `${component.freeformPosition.x}px`,
                            top: `${component.freeformPosition.y}px`,
                            width: `${component.freeformPosition.width}px`,
                            minHeight: `${component.freeformPosition.height}px`,
                          }}
                        >
                          <CanvasComponentRenderer
                            component={component}
                            isSelected={false}
                            deviceType={deviceType}
                            onSelect={() => {}}
                          />
                        </div>
                      );
                    }
                    
                    // Stack mode - normal rendering
                    return (
                      <CanvasComponentRenderer
                        key={component.id}
                        component={component}
                        isSelected={false}
                        deviceType={deviceType}
                        onSelect={() => {}}
                      />
                    );
                  })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
