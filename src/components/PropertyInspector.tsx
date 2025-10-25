import { useState } from 'react';
import { FileText, Palette, LayoutGrid, Trash2, Globe, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { ScrollArea } from './ui/scroll-area';
import { CanvasComponent, PropertyTab, Page, Asset, AssetCategory } from '../types';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { AssetManagerDialog } from './AssetManagerDialog';
import { InteractionsTab } from './InteractionsTab';
import { FormTab } from './FormTab';

interface PropertyInspectorProps {
  selectedComponent: CanvasComponent | null;
  currentPage?: Page;
  assets?: Asset[];
  onAddAsset?: (file: File, category: AssetCategory) => Promise<Asset>;
  onAddAssetFromUrl?: (url: string, name: string, category: AssetCategory) => Asset;
  onDeleteAsset?: (id: string) => void;
  onUpdateAsset?: (id: string, updates: Partial<Asset>) => void;
  onUpdateComponent: (id: string, props: Record<string, any>) => void;
  onUpdatePageMeta?: (meta: Record<string, any>) => void;
  onDeleteComponent: (id: string) => void;
}

export function PropertyInspector({
  selectedComponent,
  currentPage,
  assets = [],
  onAddAsset,
  onAddAssetFromUrl,
  onDeleteAsset,
  onUpdateAsset,
  onUpdateComponent,
  onUpdatePageMeta,
  onDeleteComponent,
}: PropertyInspectorProps) {
  const [activeTab, setActiveTab] = useState<PropertyTab>('content');
  
  const hasAssetManager = onAddAsset && onAddAssetFromUrl && onDeleteAsset && onUpdateAsset;

  // Show page SEO settings when no component is selected
  if (!selectedComponent) {
    return (
      <div className="w-full border-l border-border bg-background flex flex-col h-full">
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2 mb-1">
            <Globe className="w-4 h-4" />
            <h3 className="text-sm">Page Settings</h3>
          </div>
          <p className="text-xs text-muted-foreground">
            {currentPage?.name || 'Current Page'}
          </p>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-4">
            <div>
              <Label htmlFor="meta-title" className="text-sm mb-1.5 block">
                Meta Title
              </Label>
              <Input
                id="meta-title"
                value={currentPage?.props?.metaTitle || ''}
                onChange={(e) =>
                  onUpdatePageMeta?.({
                    ...currentPage?.props,
                    metaTitle: e.target.value,
                  })
                }
                placeholder={currentPage?.name}
                className="bg-input-background"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Appears in browser tabs and search results
              </p>
            </div>

            <div>
              <Label htmlFor="meta-description" className="text-sm mb-1.5 block">
                Meta Description
              </Label>
              <Textarea
                id="meta-description"
                value={currentPage?.props?.metaDescription || ''}
                onChange={(e) =>
                  onUpdatePageMeta?.({
                    ...currentPage?.props,
                    metaDescription: e.target.value,
                  })
                }
                placeholder="Brief description of this page..."
                className="bg-input-background resize-none"
                rows={4}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Shown in search engine results (150-160 characters recommended)
              </p>
            </div>

            <div>
              <Label htmlFor="meta-keywords" className="text-sm mb-1.5 block">
                Keywords
              </Label>
              <Input
                id="meta-keywords"
                value={currentPage?.props?.metaKeywords || ''}
                onChange={(e) =>
                  onUpdatePageMeta?.({
                    ...currentPage?.props,
                    metaKeywords: e.target.value,
                  })
                }
                placeholder="restaurant, dining, food"
                className="bg-input-background"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Comma-separated keywords
              </p>
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground">
                <strong>Tip:</strong> Select a component to edit its properties, or use
                the Export dialog to configure site-wide SEO settings.
              </p>
            </div>
          </div>
        </ScrollArea>
      </div>
    );
  }

  const updateProp = (key: string, value: any) => {
    onUpdateComponent(selectedComponent.id, {
      ...selectedComponent.props,
      [key]: value,
    });
  };

  const updateResponsiveProp = (key: string, value: any) => {
    const currentComponent = selectedComponent;
    onUpdateComponent(currentComponent.id, {
      ...currentComponent.props,
      __responsiveProps: {
        ...currentComponent.responsiveProps,
        [key]: value,
      },
    });
  };

  // Check if component is a form component
  const isFormComponent = ['contact-form', 'reservations', 'newsletter'].includes(selectedComponent.componentId);
  
  const tabs = [
    { id: 'content', label: 'Content', icon: <FileText className="w-4 h-4" /> },
    ...(isFormComponent ? [{ id: 'form', label: 'Form', icon: <FileText className="w-4 h-4" /> }] : []),
    { id: 'style', label: 'Style', icon: <Palette className="w-4 h-4" /> },
    { id: 'layout', label: 'Layout', icon: <LayoutGrid className="w-4 h-4" /> },
    { id: 'responsive', label: 'Responsive', icon: <Globe className="w-4 h-4" /> },
    { id: 'interactions', label: 'Interactions', icon: <Sparkles className="w-4 h-4" /> },
  ] as const;

  const renderContentTab = () => {
    const props = selectedComponent.props;

    switch (selectedComponent.componentId) {
      case 'hero-full':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="title" className="text-sm mb-1.5 block">Title</Label>
              <Input
                id="title"
                value={props.title || ''}
                onChange={(e) => updateProp('title', e.target.value)}
                className="bg-input-background"
              />
            </div>
            <div>
              <Label htmlFor="subtitle" className="text-sm mb-1.5 block">Subtitle</Label>
              <Input
                id="subtitle"
                value={props.subtitle || ''}
                onChange={(e) => updateProp('subtitle', e.target.value)}
                className="bg-input-background"
              />
            </div>
            <div>
              <Label htmlFor="description" className="text-sm mb-1.5 block">Description</Label>
              <Textarea
                id="description"
                value={props.description || ''}
                onChange={(e) => updateProp('description', e.target.value)}
                className="bg-input-background resize-none"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="buttonText" className="text-sm mb-1.5 block">Button Text</Label>
              <Input
                id="buttonText"
                value={props.buttonText || ''}
                onChange={(e) => updateProp('buttonText', e.target.value)}
                className="bg-input-background"
              />
            </div>
            <div>
              <Label htmlFor="buttonLink" className="text-sm mb-1.5 block">Button Link</Label>
              <Input
                id="buttonLink"
                value={props.buttonLink || '#menu'}
                onChange={(e) => updateProp('buttonLink', e.target.value)}
                className="bg-input-background"
              />
            </div>
            <div>
              <Label htmlFor="imageUrl" className="text-sm mb-1.5 block">Background Image</Label>
              <Input
                id="imageUrl"
                value={props.backgroundImage || ''}
                onChange={(e) => updateProp('backgroundImage', e.target.value)}
                className="bg-input-background"
                placeholder="https://... or select from library"
              />
              {hasAssetManager && (
                <div className="mt-2">
                  <AssetManagerDialog
                    assets={assets}
                    onAddAsset={onAddAsset!}
                    onAddAssetFromUrl={onAddAssetFromUrl!}
                    onDeleteAsset={onDeleteAsset!}
                    onUpdateAsset={onUpdateAsset!}
                    onSelectAsset={(asset) => updateProp('backgroundImage', asset.url)}
                    selectedAssetId={assets.find(a => a.url === props.backgroundImage)?.id}
                    selectionMode
                  />
                </div>
              )}
            </div>
          </div>
        );

      case 'hero-split':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="title" className="text-sm mb-1.5 block">Title</Label>
              <Input
                id="title"
                value={props.title || ''}
                onChange={(e) => updateProp('title', e.target.value)}
                className="bg-input-background"
              />
            </div>
            <div>
              <Label htmlFor="description" className="text-sm mb-1.5 block">Description</Label>
              <Textarea
                id="description"
                value={props.description || ''}
                onChange={(e) => updateProp('description', e.target.value)}
                className="bg-input-background resize-none"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="imagePosition" className="text-sm mb-1.5 block">Image Position</Label>
              <Select value={props.imagePosition || 'right'} onValueChange={(value) => updateProp('imagePosition', value)}>
                <SelectTrigger className="bg-input-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 'text-block':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="heading" className="text-sm mb-1.5 block">Heading</Label>
              <Input
                id="heading"
                value={props.heading || ''}
                onChange={(e) => updateProp('heading', e.target.value)}
                className="bg-input-background"
              />
            </div>
            <div>
              <Label htmlFor="content" className="text-sm mb-1.5 block">Content</Label>
              <Textarea
                id="content"
                value={props.content || ''}
                onChange={(e) => updateProp('content', e.target.value)}
                className="bg-input-background resize-none"
                rows={5}
              />
            </div>
          </div>
        );

      case 'menu-grid':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="categories" className="text-sm mb-1.5 block">Categories (comma-separated)</Label>
              <Input
                id="categories"
                value={props.categories?.join(', ') || ''}
                onChange={(e) => updateProp('categories', e.target.value.split(',').map((s: string) => s.trim()))}
                className="bg-input-background"
              />
            </div>
            <div className="flex items-center justify-between py-2">
              <Label htmlFor="showPrices" className="text-sm">Show Prices</Label>
              <Switch
                id="showPrices"
                checked={props.showPrices ?? true}
                onCheckedChange={(checked) => updateProp('showPrices', checked)}
              />
            </div>
            <div className="flex items-center justify-between py-2">
              <Label htmlFor="showImages" className="text-sm">Show Images</Label>
              <Switch
                id="showImages"
                checked={props.showImages ?? true}
                onCheckedChange={(checked) => updateProp('showImages', checked)}
              />
            </div>
          </div>
        );

      case 'contact-info':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="phone" className="text-sm mb-1.5 block">Phone</Label>
              <Input
                id="phone"
                value={props.phone || ''}
                onChange={(e) => updateProp('phone', e.target.value)}
                className="bg-input-background"
              />
            </div>
            <div>
              <Label htmlFor="email" className="text-sm mb-1.5 block">Email</Label>
              <Input
                id="email"
                type="email"
                value={props.email || ''}
                onChange={(e) => updateProp('email', e.target.value)}
                className="bg-input-background"
              />
            </div>
            <div>
              <Label htmlFor="address" className="text-sm mb-1.5 block">Address</Label>
              <Textarea
                id="address"
                value={props.address || ''}
                onChange={(e) => updateProp('address', e.target.value)}
                className="bg-input-background resize-none"
                rows={3}
              />
            </div>
          </div>
        );

      case 'newsletter':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="title" className="text-sm mb-1.5 block">Title</Label>
              <Input
                id="title"
                value={props.title || ''}
                onChange={(e) => updateProp('title', e.target.value)}
                className="bg-input-background"
              />
            </div>
            <div>
              <Label htmlFor="placeholder" className="text-sm mb-1.5 block">Placeholder</Label>
              <Input
                id="placeholder"
                value={props.placeholder || ''}
                onChange={(e) => updateProp('placeholder', e.target.value)}
                className="bg-input-background"
              />
            </div>
          </div>
        );

      case 'chef-profile':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-sm mb-1.5 block">Name</Label>
              <Input
                id="name"
                value={props.name || ''}
                onChange={(e) => updateProp('name', e.target.value)}
                className="bg-input-background"
              />
            </div>
            <div>
              <Label htmlFor="bio" className="text-sm mb-1.5 block">Bio</Label>
              <Textarea
                id="bio"
                value={props.bio || ''}
                onChange={(e) => updateProp('bio', e.target.value)}
                className="bg-input-background resize-none"
                rows={4}
              />
            </div>
          </div>
        );

      case 'image-gallery':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="columns" className="text-sm mb-1.5 block">Columns</Label>
              <Select value={String(props.columns || 3)} onValueChange={(value) => updateProp('columns', Number(value))}>
                <SelectTrigger className="bg-input-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 'testimonials':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <Label htmlFor="showRating" className="text-sm">Show Rating</Label>
              <Switch
                id="showRating"
                checked={props.showRating ?? true}
                onCheckedChange={(checked) => updateProp('showRating', checked)}
              />
            </div>
            <div>
              <Label htmlFor="layout" className="text-sm mb-1.5 block">Layout</Label>
              <Select value={props.layout || 'grid'} onValueChange={(value) => updateProp('layout', value)}>
                <SelectTrigger className="bg-input-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="grid">Grid</SelectItem>
                  <SelectItem value="carousel">Carousel</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">No content properties available</p>
          </div>
        );
    }
  };

  const renderStyleTab = () => {
    const props = selectedComponent.props;
    
    return (
      <div className="space-y-4">
        <div>
          <Label className="text-sm mb-1.5 block">Background Color</Label>
          <Select 
            value={props.backgroundColor || 'transparent'}
            onValueChange={(value) => updateProp('backgroundColor', value)}
          >
            <SelectTrigger className="bg-input-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="transparent">Transparent</SelectItem>
              <SelectItem value="white">White</SelectItem>
              <SelectItem value="muted">Muted</SelectItem>
              <SelectItem value="accent">Accent</SelectItem>
              <SelectItem value="primary">Primary</SelectItem>
              <SelectItem value="secondary">Secondary</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-sm mb-1.5 block">Text Color</Label>
          <Select 
            value={props.textColor || 'default'}
            onValueChange={(value) => updateProp('textColor', value)}
          >
            <SelectTrigger className="bg-input-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="muted">Muted</SelectItem>
              <SelectItem value="white">White</SelectItem>
              <SelectItem value="primary">Primary</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-sm mb-1.5 block">Text Alignment</Label>
          <Select 
            value={props.textAlign || 'left'}
            onValueChange={(value) => updateProp('textAlign', value)}
          >
            <SelectTrigger className="bg-input-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="left">Left</SelectItem>
              <SelectItem value="center">Center</SelectItem>
              <SelectItem value="right">Right</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="borderRadius" className="text-sm mb-1.5 block">Border Radius</Label>
          <Select 
            value={props.borderRadius || 'md'}
            onValueChange={(value) => updateProp('borderRadius', value)}
          >
            <SelectTrigger className="bg-input-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="sm">Small</SelectItem>
              <SelectItem value="md">Medium</SelectItem>
              <SelectItem value="lg">Large</SelectItem>
              <SelectItem value="xl">Extra Large</SelectItem>
              <SelectItem value="full">Full</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {selectedComponent.componentId.includes('hero') && (
          <div>
            <Label htmlFor="overlayOpacity" className="text-sm mb-1.5 block">
              Overlay Opacity ({props.overlayOpacity || 50}%)
            </Label>
            <Input
              id="overlayOpacity"
              type="range"
              min="0"
              max="100"
              value={props.overlayOpacity || 50}
              onChange={(e) => updateProp('overlayOpacity', Number(e.target.value))}
              className="bg-input-background"
            />
          </div>
        )}
        <div className="flex items-center justify-between py-2">
          <Label className="text-sm">Shadow</Label>
          <Switch
            checked={props.shadow ?? false}
            onCheckedChange={(checked) => updateProp('shadow', checked)}
          />
        </div>
      </div>
    );
  };

  const renderLayoutTab = () => {
    const props = selectedComponent.props;
    const layoutConfig = selectedComponent.layoutConfig || {};
    const spacing = selectedComponent.spacing || {};
    const childConfig = selectedComponent.childConfig || {};
    const positionConfig = selectedComponent.positionConfig || {};
    const isContainer = ['row-container', 'grid-container'].includes(selectedComponent.componentId);
    const isInContainer = !!selectedComponent.parentId;

    const updateProp = (key: string, value: any) => {
      onUpdateComponent(selectedComponent.id, {
        ...selectedComponent.props,
        [key]: value,
      });
    };

    const updateLayoutConfig = (updates: any) => {
      onUpdateComponent(selectedComponent.id, {
        ...selectedComponent.props,
        __layoutConfig: { ...layoutConfig, ...updates },
      });
    };

    const updateSpacing = (updates: any) => {
      onUpdateComponent(selectedComponent.id, {
        ...selectedComponent.props,
        __spacing: { ...spacing, ...updates },
      });
    };

    const updateChildConfig = (updates: any) => {
      onUpdateComponent(selectedComponent.id, {
        ...selectedComponent.props,
        __childConfig: { ...childConfig, ...updates },
      });
    };

    const updatePositionConfig = (updates: any) => {
      onUpdateComponent(selectedComponent.id, {
        ...selectedComponent.props,
        __positionConfig: { ...positionConfig, ...updates },
      });
    };

    return (
      <div className="space-y-6">
        {/* Basic Layout Settings (for all components) */}
        <div className="space-y-4">
          <h4 className="text-sm flex items-center gap-2">
            <LayoutGrid className="w-4 h-4" />
            Basic Layout
          </h4>

          <div>
            <Label className="text-sm mb-1.5 block">Width</Label>
            <Select 
              value={props.width || 'full'}
              onValueChange={(value) => updateProp('width', value)}
            >
              <SelectTrigger className="bg-input-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sm">Small (640px)</SelectItem>
                <SelectItem value="md">Medium (768px)</SelectItem>
                <SelectItem value="lg">Large (1024px)</SelectItem>
                <SelectItem value="xl">Extra Large (1280px)</SelectItem>
                <SelectItem value="full">Full Width</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm mb-1.5 block">Padding</Label>
            <Select 
              value={props.padding || 'medium'}
              onValueChange={(value) => updateProp('padding', value)}
            >
              <SelectTrigger className="bg-input-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="small">Small</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="large">Large</SelectItem>
                <SelectItem value="xl">Extra Large</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-sm mb-1.5 block">Margin Top</Label>
              <Select 
                value={props.marginTop || 'none'}
                onValueChange={(value) => updateProp('marginTop', value)}
              >
                <SelectTrigger className="bg-input-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="small">Small</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="large">Large</SelectItem>
                  <SelectItem value="xl">Extra Large</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm mb-1.5 block">Margin Bottom</Label>
              <Select 
                value={props.marginBottom || 'none'}
                onValueChange={(value) => updateProp('marginBottom', value)}
              >
                <SelectTrigger className="bg-input-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="small">Small</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="large">Large</SelectItem>
                  <SelectItem value="xl">Extra Large</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-between py-2">
            <Label className="text-sm">Center Horizontally</Label>
            <Switch 
              checked={props.centerHorizontally ?? false}
              onCheckedChange={(checked) => updateProp('centerHorizontally', checked)}
            />
          </div>

          <div className="flex items-center justify-between py-2">
            <Label className="text-sm">Full Height</Label>
            <Switch 
              checked={props.fullHeight ?? false}
              onCheckedChange={(checked) => updateProp('fullHeight', checked)}
            />
          </div>
        </div>

        {/* Container Layout Settings */}
        {isContainer && (
          <div className="space-y-4">
            <div>
              <h4 className="text-sm mb-3 flex items-center gap-2">
                <LayoutGrid className="w-4 h-4" />
                Container Layout
              </h4>
              
              {selectedComponent.componentId === 'grid-container' && (
                <div>
                  <Label className="text-sm mb-1.5 block">Grid Columns</Label>
                  <Select 
                    value={String(layoutConfig.gridColumns || 3)}
                    onValueChange={(value) => updateLayoutConfig({ gridColumns: Number(value) })}
                  >
                    <SelectTrigger className="bg-input-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">2 Columns</SelectItem>
                      <SelectItem value="3">3 Columns</SelectItem>
                      <SelectItem value="4">4 Columns</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="mt-3">
                <Label className="text-sm mb-1.5 block">Align Items</Label>
                <Select 
                  value={layoutConfig.alignItems || 'start'}
                  onValueChange={(value) => updateLayoutConfig({ alignItems: value })}
                >
                  <SelectTrigger className="bg-input-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="start">Start</SelectItem>
                    <SelectItem value="center">Center</SelectItem>
                    <SelectItem value="end">End</SelectItem>
                    <SelectItem value="stretch">Stretch</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="mt-3">
                <Label className="text-sm mb-1.5 block">Justify Content</Label>
                <Select 
                  value={layoutConfig.justifyContent || 'start'}
                  onValueChange={(value) => updateLayoutConfig({ justifyContent: value })}
                >
                  <SelectTrigger className="bg-input-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="start">Start</SelectItem>
                    <SelectItem value="center">Center</SelectItem>
                    <SelectItem value="end">End</SelectItem>
                    <SelectItem value="between">Space Between</SelectItem>
                    <SelectItem value="around">Space Around</SelectItem>
                    <SelectItem value="evenly">Space Evenly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {selectedComponent.componentId === 'row-container' && (
                <div className="mt-3 flex items-center justify-between py-2">
                  <Label className="text-sm">Wrap Items</Label>
                  <Switch 
                    checked={layoutConfig.wrap ?? false}
                    onCheckedChange={(checked) => updateLayoutConfig({ wrap: checked })}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Spacing Settings */}
        <div className="space-y-4">
          <h4 className="text-sm flex items-center gap-2">
            <LayoutGrid className="w-4 h-4" />
            Spacing
          </h4>

          <div>
            <Label className="text-sm mb-1.5 block">Gap (for containers)</Label>
            <Select 
              value={spacing.gap || 'md'}
              onValueChange={(value) => updateSpacing({ gap: value })}
            >
              <SelectTrigger className="bg-input-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="xs">Extra Small</SelectItem>
                <SelectItem value="sm">Small</SelectItem>
                <SelectItem value="md">Medium</SelectItem>
                <SelectItem value="lg">Large</SelectItem>
                <SelectItem value="xl">Extra Large</SelectItem>
                <SelectItem value="2xl">2X Large</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-sm mb-1.5 block">Margin Top</Label>
              <Select 
                value={spacing.marginTop || 'none'}
                onValueChange={(value) => updateSpacing({ marginTop: value })}
              >
                <SelectTrigger className="bg-input-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="xs">XS</SelectItem>
                  <SelectItem value="sm">SM</SelectItem>
                  <SelectItem value="md">MD</SelectItem>
                  <SelectItem value="lg">LG</SelectItem>
                  <SelectItem value="xl">XL</SelectItem>
                  <SelectItem value="2xl">2XL</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm mb-1.5 block">Margin Bottom</Label>
              <Select 
                value={spacing.marginBottom || 'none'}
                onValueChange={(value) => updateSpacing({ marginBottom: value })}
              >
                <SelectTrigger className="bg-input-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="xs">XS</SelectItem>
                  <SelectItem value="sm">SM</SelectItem>
                  <SelectItem value="md">MD</SelectItem>
                  <SelectItem value="lg">LG</SelectItem>
                  <SelectItem value="xl">XL</SelectItem>
                  <SelectItem value="2xl">2XL</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-sm mb-1.5 block">Padding Top</Label>
              <Select 
                value={spacing.paddingTop || 'none'}
                onValueChange={(value) => updateSpacing({ paddingTop: value })}
              >
                <SelectTrigger className="bg-input-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="xs">XS</SelectItem>
                  <SelectItem value="sm">SM</SelectItem>
                  <SelectItem value="md">MD</SelectItem>
                  <SelectItem value="lg">LG</SelectItem>
                  <SelectItem value="xl">XL</SelectItem>
                  <SelectItem value="2xl">2XL</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm mb-1.5 block">Padding Bottom</Label>
              <Select 
                value={spacing.paddingBottom || 'none'}
                onValueChange={(value) => updateSpacing({ paddingBottom: value })}
              >
                <SelectTrigger className="bg-input-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="xs">XS</SelectItem>
                  <SelectItem value="sm">SM</SelectItem>
                  <SelectItem value="md">MD</SelectItem>
                  <SelectItem value="lg">LG</SelectItem>
                  <SelectItem value="xl">XL</SelectItem>
                  <SelectItem value="2xl">2XL</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Child/Width Settings (when inside a container) */}
        {isInContainer && (
          <div className="space-y-4">
            <h4 className="text-sm flex items-center gap-2">
              <LayoutGrid className="w-4 h-4" />
              Width & Sizing
            </h4>

            <div>
              <Label className="text-sm mb-1.5 block">Width</Label>
              <Select 
                value={childConfig.width || 'auto'}
                onValueChange={(value) => updateChildConfig({ width: value })}
              >
                <SelectTrigger className="bg-input-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Auto</SelectItem>
                  <SelectItem value="25%">25%</SelectItem>
                  <SelectItem value="33%">33%</SelectItem>
                  <SelectItem value="50%">50%</SelectItem>
                  <SelectItem value="66%">66%</SelectItem>
                  <SelectItem value="75%">75%</SelectItem>
                  <SelectItem value="100%">100%</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {childConfig.width === 'custom' && (
              <div>
                <Label className="text-sm mb-1.5 block">Custom Width</Label>
                <Input
                  value={childConfig.customWidth || ''}
                  onChange={(e) => updateChildConfig({ customWidth: e.target.value })}
                  placeholder="e.g., 300px, 20rem"
                  className="bg-input-background"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-sm mb-1.5 block">Flex Grow</Label>
                <Input
                  type="number"
                  min="0"
                  max="10"
                  value={childConfig.flexGrow ?? 0}
                  onChange={(e) => updateChildConfig({ flexGrow: Number(e.target.value) })}
                  className="bg-input-background"
                />
              </div>
              <div>
                <Label className="text-sm mb-1.5 block">Flex Shrink</Label>
                <Input
                  type="number"
                  min="0"
                  max="10"
                  value={childConfig.flexShrink ?? 1}
                  onChange={(e) => updateChildConfig({ flexShrink: Number(e.target.value) })}
                  className="bg-input-background"
                />
              </div>
            </div>
          </div>
        )}

        {/* Position Settings */}
        <div className="space-y-4">
          <h4 className="text-sm flex items-center gap-2">
            <LayoutGrid className="w-4 h-4" />
            Position & Offset
          </h4>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-sm mb-1.5 block">Offset X (px)</Label>
              <Input
                type="number"
                value={positionConfig.offsetX ?? 0}
                onChange={(e) => updatePositionConfig({ offsetX: Number(e.target.value) })}
                className="bg-input-background"
              />
            </div>
            <div>
              <Label className="text-sm mb-1.5 block">Offset Y (px)</Label>
              <Input
                type="number"
                value={positionConfig.offsetY ?? 0}
                onChange={(e) => updatePositionConfig({ offsetY: Number(e.target.value) })}
                className="bg-input-background"
              />
            </div>
          </div>

          <div>
            <Label className="text-sm mb-1.5 block">Z-Index (Layering)</Label>
            <Input
              type="number"
              value={positionConfig.zIndex ?? 0}
              onChange={(e) => updatePositionConfig({ zIndex: Number(e.target.value) })}
              className="bg-input-background"
              placeholder="0"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Higher values appear on top
            </p>
          </div>
        </div>
      </div>
    );
  };

  const renderResponsiveTab = () => {
    const responsiveProps = selectedComponent.responsiveProps || {};
    
    return (
      <div className="space-y-4">
        <div className="p-3 bg-muted/50 rounded-lg">
          <p className="text-xs text-muted-foreground">
            Control how this component behaves on different devices
          </p>
        </div>

        <div>
          <h4 className="text-sm mb-3">Visibility</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between py-2">
              <Label className="text-sm">Hide on Mobile</Label>
              <Switch
                checked={responsiveProps.hideOnMobile ?? false}
                onCheckedChange={(checked) => updateResponsiveProp('hideOnMobile', checked)}
              />
            </div>
            <div className="flex items-center justify-between py-2">
              <Label className="text-sm">Hide on Tablet</Label>
              <Switch
                checked={responsiveProps.hideOnTablet ?? false}
                onCheckedChange={(checked) => updateResponsiveProp('hideOnTablet', checked)}
              />
            </div>
            <div className="flex items-center justify-between py-2">
              <Label className="text-sm">Hide on Desktop</Label>
              <Switch
                checked={responsiveProps.hideOnDesktop ?? false}
                onCheckedChange={(checked) => updateResponsiveProp('hideOnDesktop', checked)}
              />
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-sm mb-3">Mobile Overrides</h4>
          <div className="space-y-4">
            <div>
              <Label className="text-sm mb-1.5 block">Mobile Text Alignment</Label>
              <Select 
                value={responsiveProps.mobileTextAlign || 'default'}
                onValueChange={(value) => updateResponsiveProp('mobileTextAlign', value === 'default' ? undefined : value)}
              >
                <SelectTrigger className="bg-input-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Use Default</SelectItem>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="center">Center</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm mb-1.5 block">Mobile Padding</Label>
              <Select 
                value={responsiveProps.mobilePadding || 'default'}
                onValueChange={(value) => updateResponsiveProp('mobilePadding', value === 'default' ? undefined : value)}
              >
                <SelectTrigger className="bg-input-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Use Default</SelectItem>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="small">Small</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="large">Large</SelectItem>
                  <SelectItem value="xl">Extra Large</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm mb-1.5 block">Mobile Width</Label>
              <Select 
                value={responsiveProps.mobileWidth || 'default'}
                onValueChange={(value) => updateResponsiveProp('mobileWidth', value === 'default' ? undefined : value)}
              >
                <SelectTrigger className="bg-input-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Use Default</SelectItem>
                  <SelectItem value="sm">Small</SelectItem>
                  <SelectItem value="md">Medium</SelectItem>
                  <SelectItem value="lg">Large</SelectItem>
                  <SelectItem value="xl">Extra Large</SelectItem>
                  <SelectItem value="full">Full Width</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full border-l border-border bg-background flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <h3 className="text-sm mb-1">{selectedComponent.name}</h3>
        <Badge variant="secondary" className="text-xs">
          {selectedComponent.category}
        </Badge>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 p-3 border-b border-border overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as PropertyTab)}
            className={`flex-1 flex items-center justify-center gap-1 px-2 py-2 rounded-lg text-xs transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-background shadow-sm border border-border'
                : 'hover:bg-accent'
            }`}
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4">
          {activeTab === 'content' && renderContentTab()}
          {activeTab === 'form' && (
            <FormTab
              component={selectedComponent}
              onUpdateComponent={onUpdateComponent}
            />
          )}
          {activeTab === 'style' && renderStyleTab()}
          {activeTab === 'layout' && renderLayoutTab()}
          {activeTab === 'responsive' && renderResponsiveTab()}
          {activeTab === 'interactions' && (
            <InteractionsTab
              interactions={selectedComponent.interactions}
              onUpdate={(interactions) => {
                onUpdateComponent(selectedComponent.id, {
                  ...selectedComponent.props,
                  __interactions: interactions,
                });
              }}
            />
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-border">
        <Button
          variant="destructive"
          className="w-full gap-2"
          onClick={() => onDeleteComponent(selectedComponent.id)}
        >
          <Trash2 className="w-4 h-4" />
          Delete Component
        </Button>
      </div>
    </div>
  );
}
