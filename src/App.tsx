import { useState, useEffect, useCallback, useRef } from 'react';
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
  Eye 
} from 'lucide-react';
import { Resizable } from 're-resizable';
import { Header } from './components/Header';
import { ComponentLibrary } from './components/ComponentLibrary';
import { Canvas } from './components/Canvas';
import { PropertyInspector } from './components/PropertyInspector';
import { LayersPanel } from './components/LayersPanel';
import { PreviewMode } from './components/PreviewMode';
import { ExportDialog } from './components/ExportDialog';
import { GlobalSettingsDialog } from './components/GlobalSettingsDialog';
import { TemplatesDialog } from './components/TemplatesDialog';
import { KeyboardShortcutsDialog } from './components/KeyboardShortcutsDialog';
import { WelcomeDialog } from './components/WelcomeDialog';
import { FormSubmissionsDialog } from './components/FormSubmissionsDialog';
import { VersionHistoryDialog } from './components/VersionHistoryDialog';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { Toolbar } from './components/Toolbar';
import { AutoSaveIndicator } from './components/AutoSaveIndicator';
import { EmptyState } from './components/EmptyState';
import { CanvasComponent, RestaurantComponent, Page, DeviceType, GlobalSettings } from './types';
import { useHistory } from './hooks/useHistory';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useAutoSave } from './hooks/useAutoSave';
import { useGlobalStyles } from './hooks/useGlobalStyles';
import { useAssets } from './hooks/useAssets';
import { useRecentComponents } from './hooks/useRecentComponents';
import { useVersionHistory } from './hooks/useVersionHistory';
import { AssetManagerDialog } from './components/AssetManagerDialog';
import { PageTemplate } from './data/pageTemplates';
import { Button } from './components/ui/button';
import { cn } from './components/ui/utils';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner@2.0.3';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './components/ui/dropdown-menu';
import {
  findComponentById,
  updateComponentById,
  deleteComponentsByIds,
  flattenComponents,
} from './utils/componentHelpers';
import { AIAssistant } from './components/AIAssistant';
import { useAI } from './hooks/useAI';
import { AIContext, AIAction } from './types/ai';
import { executeActions } from './utils/aiActionExecutor';
import { restaurantComponents } from './data/restaurantComponents';

function createSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

interface AppState {
  pages: Page[];
  currentPageId: string;
  selectedComponentIds: string[];
  siteName: string;
  globalSettings: GlobalSettings;
}

const STORAGE_KEY = 'restaurant-builder-state';

function loadStateFromStorage(): AppState | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Migrate old data structure if needed
      if (parsed.selectedComponentId !== undefined) {
        return {
          ...parsed,
          selectedComponentIds: parsed.selectedComponentId ? [parsed.selectedComponentId] : [],
          siteName: parsed.siteName || 'My Restaurant',
        };
      }
      // Ensure selectedComponentIds exists
      if (!parsed.selectedComponentIds) {
        parsed.selectedComponentIds = [];
      }
      // Ensure siteName exists
      if (!parsed.siteName) {
        parsed.siteName = 'My Restaurant';
      }
      // Ensure globalSettings exists
      if (!parsed.globalSettings) {
        parsed.globalSettings = {
          branding: {
            siteName: parsed.siteName || 'My Restaurant',
            tagline: 'Fine Dining Experience',
            logoText: '',
            primaryColor: '#8B4513',
            secondaryColor: '#D4AF37',
            accentColor: '#2C1810',
          },
          typography: {
            headingFont: 'system',
            bodyFont: 'system',
            baseFontSize: '16px',
            lineHeight: '1.5',
          },
          contact: {
            phone: '',
            email: '',
            address: '',
            city: '',
            state: '',
            zip: '',
            specialHours: '',
          },
          social: {
            facebook: '',
            instagram: '',
            twitter: '',
            yelp: '',
          },
          businessHours: {
            monday: '11:00 AM - 10:00 PM',
            tuesday: '11:00 AM - 10:00 PM',
            wednesday: '11:00 AM - 10:00 PM',
            thursday: '11:00 AM - 10:00 PM',
            friday: '11:00 AM - 11:00 PM',
            saturday: '11:00 AM - 11:00 PM',
            sunday: '12:00 PM - 9:00 PM',
          },
          navigation: {
            items: [
              { label: 'Home', href: '/' },
              { label: 'Menu', href: '/menu' },
              { label: 'About', href: '/about' },
              { label: 'Contact', href: '/contact' },
            ],
          },
          seo: {
            defaultMetaTitle: '',
            defaultMetaDescription: '',
            defaultMetaKeywords: '',
            ogImage: '',
            twitterHandle: '',
            googleAnalyticsId: '',
            googleSiteVerification: '',
          },
        };
      }
      // Ensure SEO settings exist (for existing projects)
      if (!parsed.globalSettings.seo) {
        parsed.globalSettings.seo = {
          defaultMetaTitle: '',
          defaultMetaDescription: '',
          defaultMetaKeywords: '',
          ogImage: '',
          twitterHandle: '',
          googleAnalyticsId: '',
          googleSiteVerification: '',
        };
      }
      // Ensure all pages have layoutMode (default to 'stack')
      if (parsed.pages && Array.isArray(parsed.pages)) {
        parsed.pages = parsed.pages.map((page: any) => ({
          ...page,
          layoutMode: page.layoutMode || 'stack',
        }));
      }
      return parsed;
    }
  } catch (error) {
    console.error('Failed to load state:', error);
  }
  return null;
}

export default function App() {
  const savedState = loadStateFromStorage();
  
  const initialState: AppState = savedState || {
    pages: [
      {
        id: 'home',
        name: 'Home',
        slug: 'home',
        components: [],
        createdAt: Date.now(),
        layoutMode: 'stack',
      },
    ],
    currentPageId: 'home',
    selectedComponentIds: [],
    siteName: 'My Restaurant',
    globalSettings: {
      branding: {
        siteName: 'My Restaurant',
        tagline: 'Fine Dining Experience',
        logoText: '',
        primaryColor: '#8B4513',
        secondaryColor: '#D4AF37',
        accentColor: '#2C1810',
      },
      typography: {
        headingFont: 'system',
        bodyFont: 'system',
        baseFontSize: '16px',
        lineHeight: '1.5',
      },
      contact: {
        phone: '',
        email: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        specialHours: '',
      },
      social: {
        facebook: '',
        instagram: '',
        twitter: '',
        yelp: '',
      },
      businessHours: {
        monday: '11:00 AM - 10:00 PM',
        tuesday: '11:00 AM - 10:00 PM',
        wednesday: '11:00 AM - 10:00 PM',
        thursday: '11:00 AM - 10:00 PM',
        friday: '11:00 AM - 11:00 PM',
        saturday: '11:00 AM - 11:00 PM',
        sunday: '12:00 PM - 9:00 PM',
      },
      navigation: {
        items: [
          { label: 'Home', href: '/' },
          { label: 'Menu', href: '/menu' },
          { label: 'About', href: '/about' },
          { label: 'Contact', href: '/contact' },
        ],
      },
      seo: {
        defaultMetaTitle: '',
        defaultMetaDescription: '',
        defaultMetaKeywords: '',
        ogImage: '',
        twitterHandle: '',
        googleAnalyticsId: '',
        googleSiteVerification: '',
      },
    },
  };

  const history = useHistory<AppState>(initialState);
  const [draggedComponent, setDraggedComponent] = useState<RestaurantComponent | null>(null);
  const [copiedComponent, setCopiedComponent] = useState<CanvasComponent | null>(null);
  const [showLayersPanel, setShowLayersPanel] = useState(true);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<DeviceType>('desktop');
  const [canvasDevice, setCanvasDevice] = useState<DeviceType>('desktop');
  const [lastSaved, setLastSaved] = useState<number | undefined>(undefined);
  const [showTemplatesDialog, setShowTemplatesDialog] = useState(false);
  const [showKeyboardShortcutsDialog, setShowKeyboardShortcutsDialog] = useState(false);
  const [showVersionHistoryDialog, setShowVersionHistoryDialog] = useState(false);
  const [showAnalyticsDashboard, setShowAnalyticsDashboard] = useState(false);
  const [showFormSubmissionsDialog, setShowFormSubmissionsDialog] = useState(false);
  const [showAssetManagerDialog, setShowAssetManagerDialog] = useState(false);
  const [showGlobalSettingsDialog, setShowGlobalSettingsDialog] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [leftPanelWidth, setLeftPanelWidth] = useState(256); // 64 * 4 = w-64
  const [rightPanelWidth, setRightPanelWidth] = useState(320); // 80 * 4 = w-80

  const { state, set: setState, undo, redo, canUndo, canRedo } = history;
  const { pages, currentPageId, selectedComponentIds, siteName, globalSettings } = state;
  
  const { addRecentComponent } = useRecentComponents();
  const { saveVersion } = useVersionHistory();

  // Auto-save to localStorage
  useAutoSave(state, STORAGE_KEY, 2000);

  // Apply global styles
  useGlobalStyles(globalSettings);

  // Asset management
  const {
    assets,
    addAsset,
    addAssetFromUrl,
    deleteAsset,
    updateAsset,
    trackAssetUsage,
    untrackAssetUsage,
  } = useAssets();

  const currentPage = pages.find((p) => p.id === currentPageId);
  const canvasComponents = currentPage?.components || [];

  // AI Assistant - initialized after canvasComponents
  const aiContext: AIContext = {
    componentLibrary: restaurantComponents.map(c => ({
      id: c.id,
      name: c.name,
      category: c.category,
      description: c.description,
      defaultProps: c.defaultProps,
    })),
    currentComponents: canvasComponents.map(c => ({
      id: c.id,
      componentId: c.componentId,
      name: c.name,
      props: c.props,
    })),
    globalSettings,
    recentActions: [],
  };

  const ai = useAI(aiContext);
  
  // Flatten components for selection (includes nested components in containers)
  const allComponents = flattenComponents(canvasComponents);
  const selectedComponents = allComponents.filter((comp) => selectedComponentIds.includes(comp.id));
  const selectedComponent = selectedComponents.length === 1 ? selectedComponents[0] : null;

  // Helper to update state
  const updateState = useCallback((updates: Partial<AppState> | ((prev: AppState) => Partial<AppState>)) => {
    if (typeof updates === 'function') {
      setState((prev) => ({ ...prev, ...updates(prev) }));
    } else {
      setState((prev) => ({ ...prev, ...updates }));
    }
  }, [setState]);

  // Toggle layout mode for current page
  const toggleLayoutMode = useCallback(() => {
    updateState((prev) => {
      const updatedPages = prev.pages.map((page) => {
        if (page.id === prev.currentPageId) {
          const newMode = page.layoutMode === 'freeform' ? 'stack' : 'freeform';
          toast.success(`Switched to ${newMode === 'freeform' ? 'Freeform' : 'Stack'} Mode`);
          return { ...page, layoutMode: newMode };
        }
        return page;
      });
      return { pages: updatedPages };
    });
  }, [updateState]);

  const handleDragStart = (component: RestaurantComponent) => {
    setDraggedComponent(component);
  };

  const handleDrop = (component: RestaurantComponent, parentId?: string) => {
    updateState((prev) => {
      const currentPageComponents = prev.pages.find((p) => p.id === prev.currentPageId)?.components || [];
      const currentPage = prev.pages.find((p) => p.id === prev.currentPageId);
      const isFreef = currentPage?.layoutMode === 'freeform';
      
      const newComponent: CanvasComponent = {
        id: `${component.id}-${Date.now()}`,
        componentId: component.id,
        name: component.name,
        category: component.category,
        props: { ...component.defaultProps, visible: true, locked: false },
        position: currentPageComponents.length,
        ...(parentId && { parentId }),
        // Add default freeform positioning for new components
        ...(isFreef && !parentId && {
          freeformPosition: {
            x: 50 + (currentPageComponents.length * 20),
            y: 50 + (currentPageComponents.length * 20),
            width: 400,
            height: 200,
          },
        }),
      };

      let updatedPages;
      
      if (parentId) {
        // Add to parent's children array
        updatedPages = prev.pages.map((page) => {
          if (page.id !== prev.currentPageId) return page;
          
          return {
            ...page,
            components: page.components.map((comp) => {
              if (comp.id === parentId) {
                return {
                  ...comp,
                  children: [...(comp.children || []), newComponent],
                };
              }
              return comp;
            }),
          };
        });
      } else {
        // Add to page root level
        updatedPages = prev.pages.map((page) =>
          page.id === prev.currentPageId
            ? { ...page, components: [...page.components, newComponent] }
            : page
        );
      }

      // Track recently used component
      addRecentComponent(component.id);
      toast.success(`Added ${component.name}${parentId ? ' to container' : ''}`);
      
      return { 
        pages: updatedPages, 
        selectedComponentIds: [newComponent.id]
      };
    });
    
    setDraggedComponent(null);
  };

  const handleComponentPositionChange = useCallback((id: string, x: number, y: number, width: number, height: number) => {
    updateState((prev) => {
      const updatedPages = prev.pages.map((page) => {
        if (page.id !== prev.currentPageId) return page;
        
        return {
          ...page,
          components: page.components.map((comp) => {
            if (comp.id === id) {
              return {
                ...comp,
                freeformPosition: { x, y, width, height },
              };
            }
            return comp;
          }),
        };
      });
      
      return { pages: updatedPages };
    });
  }, [updateState]);

  const handleSelectComponent = (id: string | null, multiSelect = false) => {
    if (id === null) {
      updateState({ selectedComponentIds: [] });
      return;
    }

    if (multiSelect) {
      const isSelected = selectedComponentIds.includes(id);
      const newSelection = isSelected
        ? selectedComponentIds.filter((selectedId) => selectedId !== id)
        : [...selectedComponentIds, id];
      updateState({ selectedComponentIds: newSelection });
    } else {
      updateState({ selectedComponentIds: [id] });
    }
  };

  const handleUpdateComponent = (id: string, props: Record<string, any>) => {
    // Extract special props that go outside of the props object
    const { 
      __responsiveProps, 
      __interactions, 
      __formConfig,
      __layoutConfig,
      __spacing,
      __childConfig,
      __positionConfig,
      ...regularProps 
    } = props;
    
    // Build the updates object
    const updates: Partial<CanvasComponent> = {
      props: regularProps,
    };
    
    if (__responsiveProps) updates.responsiveProps = __responsiveProps;
    if (__interactions) updates.interactions = __interactions;
    if (__formConfig) updates.formConfig = __formConfig;
    if (__layoutConfig) updates.layoutConfig = __layoutConfig;
    if (__spacing) updates.spacing = __spacing;
    if (__childConfig) updates.childConfig = __childConfig;
    if (__positionConfig) updates.positionConfig = __positionConfig;
    
    // Use recursive update to handle nested components
    const updatedPages = pages.map((page) =>
      page.id === currentPageId
        ? {
            ...page,
            components: updateComponentById(page.components, id, updates),
          }
        : page
    );
    
    updateState({ pages: updatedPages });
  };

  const handleDeleteComponent = (id?: string) => {
    const idsToDelete = id ? [id] : selectedComponentIds;
    if (idsToDelete.length === 0) return;

    // Use recursive delete to handle nested components
    const updatedPages = pages.map((page) =>
      page.id === currentPageId
        ? { ...page, components: deleteComponentsByIds(page.components, idsToDelete) }
        : page
    );
    
    updateState({ 
      pages: updatedPages,
      selectedComponentIds: []
    });
    
    toast.success(`Deleted ${idsToDelete.length} component${idsToDelete.length > 1 ? 's' : ''}`);
  };

  const handleDuplicateComponent = () => {
    if (!selectedComponent) return;

    const newComponent: CanvasComponent = {
      ...selectedComponent,
      id: `${selectedComponent.componentId}-${Date.now()}`,
      position: selectedComponent.position + 1,
    };

    const currentIndex = canvasComponents.findIndex(c => c.id === selectedComponent.id);
    const updatedComponents = [
      ...canvasComponents.slice(0, currentIndex + 1),
      newComponent,
      ...canvasComponents.slice(currentIndex + 1),
    ];

    const updatedPages = pages.map((page) =>
      page.id === currentPageId
        ? { ...page, components: updatedComponents }
        : page
    );

    updateState({ 
      pages: updatedPages,
      selectedComponentIds: [newComponent.id]
    });
    
    toast.success('Component duplicated');
  };

  const handleCopyComponent = () => {
    if (selectedComponent) {
      setCopiedComponent(selectedComponent);
      toast.success('Component copied to clipboard');
    }
  };

  const handlePasteComponent = () => {
    if (!copiedComponent) return;

    const newComponent: CanvasComponent = {
      ...copiedComponent,
      id: `${copiedComponent.componentId}-${Date.now()}`,
      position: canvasComponents.length,
    };

    const updatedPages = pages.map((page) =>
      page.id === currentPageId
        ? { ...page, components: [...page.components, newComponent] }
        : page
    );

    updateState({ 
      pages: updatedPages,
      selectedComponentIds: [newComponent.id]
    });
    
    toast.success('Component pasted');
  };

  const handleGroupComponents = () => {
    if (selectedComponentIds.length < 2) return;

    const groupComponent: CanvasComponent = {
      id: `group-${Date.now()}`,
      componentId: 'group',
      name: 'Group',
      category: 'layout',
      props: { isContainer: true },
      position: Math.min(...selectedComponents.map(c => c.position)),
      children: selectedComponents.map(c => ({ ...c, parentId: `group-${Date.now()}` })),
    };

    const updatedComponents = [
      ...canvasComponents.filter(c => !selectedComponentIds.includes(c.id)),
      groupComponent,
    ].sort((a, b) => a.position - b.position);

    const updatedPages = pages.map((page) =>
      page.id === currentPageId
        ? { ...page, components: updatedComponents }
        : page
    );

    updateState({ 
      pages: updatedPages,
      selectedComponentIds: [groupComponent.id]
    });
    
    toast.success(`Grouped ${selectedComponentIds.length} components`);
  };

  const handleUngroupComponents = () => {
    if (selectedComponentIds.length !== 1) return;
    
    const groupToUngroup = selectedComponents[0];
    if (!groupToUngroup?.children || groupToUngroup.componentId !== 'group') return;

    const ungroupedChildren = groupToUngroup.children.map(child => ({
      ...child,
      parentId: undefined,
      position: groupToUngroup.position,
    }));

    const updatedComponents = [
      ...canvasComponents.filter(c => c.id !== groupToUngroup.id),
      ...ungroupedChildren,
    ].sort((a, b) => a.position - b.position);

    const updatedPages = pages.map((page) =>
      page.id === currentPageId
        ? { ...page, components: updatedComponents }
        : page
    );

    updateState({ 
      pages: updatedPages,
      selectedComponentIds: ungroupedChildren.map(c => c.id)
    });
  };

  const handleAlignComponents = (alignment: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => {
    if (selectedComponentIds.length < 2) return;

    // For now, we'll just update the textAlign prop for horizontal alignments
    // In a real implementation, you'd calculate positions based on bounding boxes
    const updatedPages = pages.map((page) => {
      if (page.id !== currentPageId) return page;

      return {
        ...page,
        components: page.components.map((comp) => {
          if (!selectedComponentIds.includes(comp.id)) return comp;

          const alignProp = ['left', 'center', 'right'].includes(alignment)
            ? { textAlign: alignment }
            : {};

          return {
            ...comp,
            props: { ...comp.props, ...alignProp },
          };
        }),
      };
    });

    updateState({ pages: updatedPages });
  };

  const handleMoveComponent = (id: string, direction: 'up' | 'down') => {
    const currentIndex = canvasComponents.findIndex(c => c.id === id);
    if (currentIndex === -1) return;
    
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= canvasComponents.length) return;

    const updatedComponents = [...canvasComponents];
    [updatedComponents[currentIndex], updatedComponents[newIndex]] = 
    [updatedComponents[newIndex], updatedComponents[currentIndex]];

    const updatedPages = pages.map((page) =>
      page.id === currentPageId
        ? { ...page, components: updatedComponents }
        : page
    );

    updateState({ pages: updatedPages });
  };

  const handleToggleVisibility = (id: string) => {
    const component = canvasComponents.find(c => c.id === id);
    if (!component) return;

    handleUpdateComponent(id, {
      ...component.props,
      visible: component.props?.visible === false ? true : false,
    });
  };

  const handleToggleLock = (id: string) => {
    const component = canvasComponents.find(c => c.id === id);
    if (!component) return;

    handleUpdateComponent(id, {
      ...component.props,
      locked: component.props?.locked === true ? false : true,
    });
  };

  const handleCreatePage = (name: string) => {
    const newPage: Page = {
      id: `page-${Date.now()}`,
      name,
      slug: createSlug(name),
      components: [],
      createdAt: Date.now(),
    };
    updateState({ 
      pages: [...pages, newPage],
      currentPageId: newPage.id,
      selectedComponentIds: []
    });
    
    toast.success(`Created page "${name}"`);
  };

  const handleRenamePage = (pageId: string, newName: string) => {
    const updatedPages = pages.map((page) =>
      page.id === pageId
        ? { ...page, name: newName, slug: createSlug(newName) }
        : page
    );
    updateState({ pages: updatedPages });
  };

  const handleDeletePage = (pageId: string) => {
    if (pages.length <= 1) return;

    const updatedPages = pages.filter((page) => page.id !== pageId);
    
    updateState({
      pages: updatedPages,
      currentPageId: currentPageId === pageId ? updatedPages[0].id : currentPageId,
      selectedComponentIds: currentPageId === pageId ? [] : selectedComponentIds,
    });
  };

  const handleSelectPage = (pageId: string) => {
    updateState({ 
      currentPageId: pageId,
      selectedComponentIds: []
    });
  };

  const handleUpdatePageMeta = (meta: Record<string, any>) => {
    const updatedPages = pages.map((page) =>
      page.id === currentPageId ? { ...page, props: meta } : page
    );
    updateState({ pages: updatedPages });
  };

  const handleUpdateSiteName = (name: string) => {
    updateState({ 
      siteName: name,
      globalSettings: {
        ...globalSettings,
        branding: { ...globalSettings.branding, siteName: name }
      }
    });
  };

  const handleUpdateGlobalSettings = (settings: Partial<GlobalSettings>) => {
    updateState({ 
      globalSettings: { ...globalSettings, ...settings },
      siteName: settings.branding?.siteName || siteName
    });
  };

  const handleSave = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      // Also create an auto-save version
      saveVersion(state, undefined, undefined, true);
      setLastSaved(Date.now());
      toast.success('Project saved successfully!');
    } catch (error) {
      console.error('Failed to save:', error);
      toast.error('Failed to save project');
    }
  };

  const handleRestoreVersion = (versionState: {
    pages: Page[];
    currentPageId: string;
    siteName: string;
    globalSettings: GlobalSettings;
  }) => {
    updateState({
      pages: versionState.pages,
      currentPageId: versionState.currentPageId,
      siteName: versionState.siteName,
      globalSettings: versionState.globalSettings,
      selectedComponentIds: [],
    });
  };

  const handleApplyTemplate = (template: PageTemplate) => {
    // Generate new component IDs with timestamps
    const templateComponents: CanvasComponent[] = template.components.map((comp, index) => ({
      ...comp,
      id: `${comp.componentId}-${Date.now()}-${index}`,
    }));

    const updatedPages = pages.map((page) =>
      page.id === currentPageId
        ? { ...page, components: [...page.components, ...templateComponents] }
        : page
    );

    updateState({ 
      pages: updatedPages,
      selectedComponentIds: []
    });

    toast.success(`Applied "${template.name}" template with ${template.components.length} components`);
  };

  // AI Assistant handlers
  const handleExecuteAIActions = async (messageId: string, actions: AIAction[]) => {
    ai.markActionExecuting(messageId, true);

    try {
      const result = await executeActions(actions, {
        pages,
        currentPageId,
        globalSettings,
        onUpdateComponent: handleUpdateComponent,
        onDrop: handleDrop,
        onUpdateGlobalSettings: handleUpdateGlobalSettings,
        onDeleteComponents: (ids) => {
          ids.forEach(id => handleDeleteComponent(id));
        },
      });

      if (result.success) {
        ai.markActionExecuted(messageId);
        toast.success(result.message);
        
        // Track action
        ai.trackAction(`AI: ${actions.map(a => a.type).join(', ')}`);
      } else {
        ai.setActionError(messageId, result.message);
        toast.error(result.message);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to execute actions';
      ai.setActionError(messageId, errorMessage);
      toast.error(errorMessage);
    }
  };

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onUndo: canUndo ? undo : undefined,
    onRedo: canRedo ? redo : undefined,
    onDelete: selectedComponentIds.length > 0 ? () => handleDeleteComponent() : undefined,
    onCopy: selectedComponent ? handleCopyComponent : undefined,
    onPaste: copiedComponent ? handlePasteComponent : undefined,
    onDuplicate: selectedComponent ? handleDuplicateComponent : undefined,
    onSave: handleSave,
  });

  // Show preview mode
  if (isPreviewMode) {
    return (
      <>
        <PreviewMode
          pages={pages}
          currentPageId={currentPageId}
          deviceType={previewDevice}
          onClose={() => setIsPreviewMode(false)}
          onDeviceChange={setPreviewDevice}
          onPageChange={handleSelectPage}
        />
        <Toaster position="top-right" />
      </>
    );
  }

  return (
    <div className="size-full flex flex-col">
      {/* <WelcomeDialog /> */}
      <Header 
        currentPageName={currentPage?.name || 'Home'}
        siteName={siteName}
      />
      
      {/* Main Toolbar */}
      <Toolbar
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={undo}
        onRedo={redo}
        selectedComponentIds={selectedComponentIds}
        selectedComponent={selectedComponent}
        canMoveUp={selectedComponent ? canvasComponents[0]?.id !== selectedComponent.id : false}
        canMoveDown={selectedComponent ? canvasComponents[canvasComponents.length - 1]?.id !== selectedComponent.id : false}
        onDuplicate={handleDuplicateComponent}
        onMoveUp={() => selectedComponent && handleMoveComponent(selectedComponent.id, 'up')}
        onMoveDown={() => selectedComponent && handleMoveComponent(selectedComponent.id, 'down')}
        onGroup={handleGroupComponents}
        onUngroup={handleUngroupComponents}
        onAlign={handleAlignComponents}
        showLayersPanel={showLayersPanel}
        onToggleLayers={() => setShowLayersPanel(!showLayersPanel)}
        onPreview={() => setIsPreviewMode(true)}
        layoutMode={currentPage?.layoutMode || 'stack'}
        onToggleLayoutMode={toggleLayoutMode}
        onOpenTemplates={() => setShowTemplatesDialog(true)}
        onOpenKeyboardShortcuts={() => setShowKeyboardShortcutsDialog(true)}
        onOpenVersionHistory={() => setShowVersionHistoryDialog(true)}
        onOpenAnalytics={() => setShowAnalyticsDashboard(true)}
        onOpenFormSubmissions={() => setShowFormSubmissionsDialog(true)}
        onOpenAssetManager={() => setShowAssetManagerDialog(true)}
        onOpenGlobalSettings={() => setShowGlobalSettingsDialog(true)}
        onOpenExport={() => setShowExportDialog(true)}
        onOpenAIAssistant={() => setShowAIAssistant(true)}
        onSave={handleSave}
      />
      
      {/* Auto-save Indicator */}
      <div className="h-8 border-b border-border bg-muted/30 flex items-center justify-end px-4">
        <AutoSaveIndicator lastSaved={lastSaved} />
      </div>
      
      {/* Hidden dialog triggers */}
      <div className="hidden">
        <TemplatesDialog 
          open={showTemplatesDialog}
          onOpenChange={setShowTemplatesDialog}
          onSelectTemplate={handleApplyTemplate} 
        />
        
        <KeyboardShortcutsDialog 
          open={showKeyboardShortcutsDialog}
          onOpenChange={setShowKeyboardShortcutsDialog}
        />
        
        <VersionHistoryDialog
          open={showVersionHistoryDialog}
          onOpenChange={setShowVersionHistoryDialog}
          currentState={{
            pages,
            currentPageId,
            siteName,
            globalSettings,
          }}
          onRestoreVersion={handleRestoreVersion}
        />
        
        <AnalyticsDashboard
          open={showAnalyticsDashboard}
          onOpenChange={setShowAnalyticsDashboard}
          pages={pages}
          globalSettings={globalSettings}
          assets={assets}
        />
        
        <FormSubmissionsDialog 
          open={showFormSubmissionsDialog}
          onOpenChange={setShowFormSubmissionsDialog}
        />
        
        <AssetManagerDialog
          open={showAssetManagerDialog}
          onOpenChange={setShowAssetManagerDialog}
          assets={assets}
          onAddAsset={addAsset}
          onAddAssetFromUrl={addAssetFromUrl}
          onDeleteAsset={deleteAsset}
          onUpdateAsset={updateAsset}
        />
        
        <GlobalSettingsDialog
          open={showGlobalSettingsDialog}
          onOpenChange={setShowGlobalSettingsDialog}
          settings={globalSettings}
          onUpdateSettings={handleUpdateGlobalSettings}
        />
        
        <ExportDialog
          open={showExportDialog}
          onOpenChange={setShowExportDialog}
          pages={pages}
          siteName={siteName}
          globalSettings={globalSettings}
          onUpdateSiteName={handleUpdateSiteName}
        />
      </div>
      
      <div className="flex-1 flex min-h-0 overflow-hidden">
        <Resizable
          size={{ width: leftPanelWidth, height: '100%' }}
          onResizeStop={(e, direction, ref, d) => {
            setLeftPanelWidth(leftPanelWidth + d.width);
          }}
          minWidth={200}
          maxWidth={500}
          enable={{ right: true }}
          handleStyles={{
            right: {
              width: '4px',
              right: '-2px',
              cursor: 'col-resize',
            },
          }}
          handleClasses={{
            right: 'hover:bg-primary/20 transition-colors',
          }}
          className="overflow-hidden"
        >
          <ComponentLibrary 
            pages={pages}
            currentPageId={currentPageId}
            onDragStart={handleDragStart}
            onSelectPage={handleSelectPage}
            onCreatePage={handleCreatePage}
            onRenamePage={handleRenamePage}
            onDeletePage={handleDeletePage}
          />
        </Resizable>
        
        <div className="flex-1 overflow-hidden">
          <Canvas
            components={canvasComponents.filter(c => c.props?.visible !== false)}
            selectedComponentIds={selectedComponentIds}
            onSelectComponent={handleSelectComponent}
            onDrop={handleDrop}
            draggedComponent={draggedComponent}
            deviceType={canvasDevice}
            onDeviceChange={setCanvasDevice}
            onOpenTemplates={() => setShowTemplatesDialog(true)}
            layoutMode={currentPage?.layoutMode || 'stack'}
            onComponentPositionChange={handleComponentPositionChange}
          />
        </div>
        
        {showLayersPanel && (
          <LayersPanel
            components={allComponents}
            selectedComponentIds={selectedComponentIds}
            onSelectComponent={handleSelectComponent}
            onToggleVisibility={handleToggleVisibility}
            onToggleLock={handleToggleLock}
          />
        )}
        
        <Resizable
          size={{ width: rightPanelWidth, height: '100%' }}
          onResizeStop={(e, direction, ref, d) => {
            setRightPanelWidth(rightPanelWidth + d.width);
          }}
          minWidth={280}
          maxWidth={600}
          enable={{ left: true }}
          handleStyles={{
            left: {
              width: '4px',
              left: '-2px',
              cursor: 'col-resize',
            },
          }}
          handleClasses={{
            left: 'hover:bg-primary/20 transition-colors',
          }}
          className="overflow-hidden"
        >
          <PropertyInspector
            selectedComponent={selectedComponent}
            currentPage={currentPage}
            assets={assets}
            onAddAsset={addAsset}
            onAddAssetFromUrl={addAssetFromUrl}
            onDeleteAsset={deleteAsset}
            onUpdateAsset={updateAsset}
            onUpdateComponent={handleUpdateComponent}
            onUpdatePageMeta={handleUpdatePageMeta}
            onDeleteComponent={handleDeleteComponent}
          />
        </Resizable>
      </div>
      
      {/* AI Assistant */}
      <AIAssistant
        open={showAIAssistant}
        onClose={() => setShowAIAssistant(false)}
        messages={ai.messages}
        isLoading={ai.isLoading}
        isAvailable={ai.isAvailable}
        suggestions={ai.getSuggestions()}
        onSendMessage={ai.sendMessage}
        onExecuteAction={handleExecuteAIActions}
        onUseSuggestion={(suggestion) => {
          ai.sendMessage(suggestion);
        }}
      />
      
      <Toaster position="top-right" />
    </div>
  );
}
