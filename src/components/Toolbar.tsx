import { 
  Undo2, 
  Redo2, 
  Layers, 
  Group, 
  Ungroup, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignStartVertical, 
  AlignCenterVertical, 
  AlignEndVertical,
  Eye,
  Save,
  FileText,
  Settings,
  BarChart3,
  Inbox,
  ImageIcon,
  Keyboard,
  History,
  Sparkles,
  MoveUp,
  MoveDown,
  Copy,
  Bot,
  LayoutList,
  LayoutGrid
} from 'lucide-react';
import { Button } from './ui/button';
import { cn } from './ui/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';
import { Separator } from './ui/separator';
import { CanvasComponent } from '../types';

interface ToolbarProps {
  // Edit actions
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  
  // Selection actions
  selectedComponentIds: string[];
  selectedComponent: CanvasComponent | null;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onDuplicate: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  
  // Group/Align actions
  onGroup: () => void;
  onUngroup: () => void;
  onAlign: (alignment: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => void;
  
  // View actions
  showLayersPanel: boolean;
  onToggleLayers: () => void;
  onPreview: () => void;
  
  // Layout mode
  layoutMode?: 'stack' | 'freeform';
  onToggleLayoutMode?: () => void;
  
  // Dialog triggers
  onOpenTemplates: () => void;
  onOpenKeyboardShortcuts: () => void;
  onOpenVersionHistory: () => void;
  onOpenAnalytics: () => void;
  onOpenFormSubmissions: () => void;
  onOpenAssetManager: () => void;
  onOpenGlobalSettings: () => void;
  onOpenExport: () => void;
  onOpenAIAssistant?: () => void;
  
  // Save
  onSave: () => void;
}

export function Toolbar({
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  selectedComponentIds,
  selectedComponent,
  canMoveUp,
  canMoveDown,
  onDuplicate,
  onMoveUp,
  onMoveDown,
  onGroup,
  onUngroup,
  onAlign,
  showLayersPanel,
  onToggleLayers,
  onPreview,
  layoutMode = 'stack',
  onToggleLayoutMode,
  onOpenTemplates,
  onOpenKeyboardShortcuts,
  onOpenVersionHistory,
  onOpenAnalytics,
  onOpenFormSubmissions,
  onOpenAssetManager,
  onOpenGlobalSettings,
  onOpenExport,
  onOpenAIAssistant,
  onSave,
}: ToolbarProps) {
  const hasSelection = selectedComponentIds.length > 0;
  const hasSingleSelection = selectedComponentIds.length === 1;
  const hasMultipleSelection = selectedComponentIds.length >= 2;
  const isGroupSelected = selectedComponent?.componentId === 'group';

  return (
    <TooltipProvider>
      <div className="h-12 border-b border-border bg-background flex items-center px-4 gap-3">
        {/* File Section */}
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={onOpenTemplates}
                className="gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span className="hidden md:inline">Templates</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Browse page templates</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={onSave}
                className="gap-2"
              >
                <Save className="w-4 h-4" />
                <span className="hidden md:inline">Save</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Save project (Ctrl+S)</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={onOpenExport}
                className="gap-2"
              >
                <FileText className="w-4 h-4" />
                <span className="hidden md:inline">Export</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Export HTML</TooltipContent>
          </Tooltip>
          
          {onOpenAIAssistant && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="default"
                  size="sm"
                  onClick={onOpenAIAssistant}
                  className="gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  <Bot className="w-4 h-4" />
                  <span className="hidden md:inline">AI Assistant</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Open AI Assistant (powered by Gemini)</TooltipContent>
            </Tooltip>
          )}
        </div>
        
        <Separator orientation="vertical" className="h-6" />
        
        {/* Edit Section */}
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={onUndo}
                disabled={!canUndo}
                className="gap-2"
              >
                <Undo2 className="w-4 h-4" />
                <span className="hidden lg:inline">Undo</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Undo (Ctrl+Z)</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={onRedo}
                disabled={!canRedo}
                className="gap-2"
              >
                <Redo2 className="w-4 h-4" />
                <span className="hidden lg:inline">Redo</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Redo (Ctrl+Shift+Z)</TooltipContent>
          </Tooltip>
          
          {hasSingleSelection && (
            <>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onDuplicate}
                    className="gap-2"
                  >
                    <Copy className="w-4 h-4" />
                    <span className="hidden lg:inline">Duplicate</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Duplicate (Ctrl+D)</TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onMoveUp}
                    disabled={!canMoveUp}
                  >
                    <MoveUp className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Move up</TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onMoveDown}
                    disabled={!canMoveDown}
                  >
                    <MoveDown className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Move down</TooltipContent>
              </Tooltip>
            </>
          )}
        </div>
        
        {/* Arrange Section - only show when components are selected */}
        {hasMultipleSelection && (
          <>
            <Separator orientation="vertical" className="h-6" />
            
            <div className="flex items-center gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onGroup}
                    className="gap-2"
                  >
                    <Group className="w-4 h-4" />
                    <span className="hidden lg:inline">Group</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Group components (Ctrl+G)</TooltipContent>
              </Tooltip>
              
              <DropdownMenu>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="gap-2">
                        <AlignLeft className="w-4 h-4" />
                        <span className="hidden lg:inline">Align</span>
                      </Button>
                    </DropdownMenuTrigger>
                  </TooltipTrigger>
                  <TooltipContent>Alignment options</TooltipContent>
                </Tooltip>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => onAlign('left')}>
                    <AlignLeft className="w-4 h-4 mr-2" />
                    Align Left
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onAlign('center')}>
                    <AlignCenter className="w-4 h-4 mr-2" />
                    Align Center
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onAlign('right')}>
                    <AlignRight className="w-4 h-4 mr-2" />
                    Align Right
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onAlign('top')}>
                    <AlignStartVertical className="w-4 h-4 mr-2" />
                    Align Top
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onAlign('middle')}>
                    <AlignCenterVertical className="w-4 h-4 mr-2" />
                    Align Middle
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onAlign('bottom')}>
                    <AlignEndVertical className="w-4 h-4 mr-2" />
                    Align Bottom
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </>
        )}
        
        {isGroupSelected && (
          <>
            <Separator orientation="vertical" className="h-6" />
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onUngroup}
                  className="gap-2"
                >
                  <Ungroup className="w-4 h-4" />
                  <span className="hidden lg:inline">Ungroup</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Ungroup components</TooltipContent>
            </Tooltip>
          </>
        )}
        
        <div className="flex-1" />
        
        {/* Tools Section */}
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={onOpenKeyboardShortcuts}
              >
                <Keyboard className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Keyboard shortcuts</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={onOpenVersionHistory}
              >
                <History className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Version history</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={onOpenAnalytics}
              >
                <BarChart3 className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Analytics & SEO</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={onOpenFormSubmissions}
              >
                <Inbox className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Form submissions</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={onOpenAssetManager}
              >
                <ImageIcon className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Asset manager</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={onOpenGlobalSettings}
              >
                <Settings className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Site settings</TooltipContent>
          </Tooltip>
        </div>
        
        <Separator orientation="vertical" className="h-6" />
        
        {/* View Section */}
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={onPreview}
                className="gap-2"
              >
                <Eye className="w-4 h-4" />
                <span className="hidden md:inline">Preview</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Preview site</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleLayers}
                className={cn("gap-2", showLayersPanel && "bg-accent")}
              >
                <Layers className="w-4 h-4" />
                <span className="hidden md:inline">Layers</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Toggle layers panel</TooltipContent>
          </Tooltip>
          
          {onToggleLayoutMode && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onToggleLayoutMode}
                  className={cn("gap-2", layoutMode === 'freeform' && "bg-accent")}
                >
                  {layoutMode === 'freeform' ? (
                    <LayoutGrid className="w-4 h-4" />
                  ) : (
                    <LayoutList className="w-4 h-4" />
                  )}
                  <span className="hidden md:inline">
                    {layoutMode === 'freeform' ? 'Freeform' : 'Stack'}
                  </span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {layoutMode === 'freeform' 
                  ? 'Switch to Stack Mode - components stack vertically' 
                  : 'Switch to Freeform Mode - drag components anywhere'}
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}
