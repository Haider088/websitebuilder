import { ChevronDown, ChevronRight, Eye, EyeOff, Lock, Unlock } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';
import { Button } from './ui/button';
import { CanvasComponent } from '../types';
import { cn } from './ui/utils';

interface LayersPanelProps {
  components: Array<CanvasComponent & { depth?: number }>;
  selectedComponentIds: string[];
  onSelectComponent: (id: string, multiSelect?: boolean) => void;
  onToggleVisibility?: (id: string) => void;
  onToggleLock?: (id: string) => void;
}

export function LayersPanel({
  components,
  selectedComponentIds,
  onSelectComponent,
  onToggleVisibility,
  onToggleLock,
}: LayersPanelProps) {
  return (
    <div className="w-64 border-l border-border bg-background flex flex-col h-full">
      <div className="p-3 border-b border-border">
        <div className="text-xs uppercase tracking-wide text-muted-foreground">Layers</div>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-2">
          {components.length === 0 ? (
            <div className="text-center py-8 px-4">
              <p className="text-sm text-muted-foreground">No components yet</p>
              <p className="text-xs text-muted-foreground mt-1">
                Drag components from the library
              </p>
            </div>
          ) : (
            <div className="space-y-0.5">
              {components.map((component, index) => {
                const isSelected = selectedComponentIds.includes(component.id);
                const isVisible = component.props?.visible !== false;
                const isLocked = component.props?.locked === true;
                const depth = component.depth || 0;
                const isNested = depth > 0;

                return (
                  <div
                    key={component.id}
                    className={cn(
                      "group flex items-center gap-1 rounded-md px-2 py-1.5 text-sm cursor-pointer hover:bg-accent transition-colors",
                      isSelected && "bg-accent"
                    )}
                    style={{ paddingLeft: `${8 + depth * 16}px` }}
                    onClick={(e) => {
                      const multiSelect = e.ctrlKey || e.metaKey;
                      onSelectComponent(component.id, multiSelect);
                    }}
                  >
                    <div className="flex items-center gap-1 flex-1 min-w-0">
                      {isNested && (
                        <span className="text-muted-foreground shrink-0">└</span>
                      )}
                      <ChevronRight className="w-3 h-3 text-muted-foreground shrink-0" />
                      <span className="truncate">
                        {component.name}
                      </span>
                      {isNested && (
                        <span className="text-xs text-muted-foreground/60 shrink-0">
                          (nested)
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      {onToggleVisibility && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleVisibility(component.id);
                          }}
                        >
                          {isVisible ? (
                            <Eye className="w-3 h-3" />
                          ) : (
                            <EyeOff className="w-3 h-3 text-muted-foreground" />
                          )}
                        </Button>
                      )}
                      
                      {onToggleLock && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleLock(component.id);
                          }}
                        >
                          {isLocked ? (
                            <Lock className="w-3 h-3" />
                          ) : (
                            <Unlock className="w-3 h-3 text-muted-foreground" />
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
