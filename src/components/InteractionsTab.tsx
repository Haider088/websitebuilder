import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { Switch } from './ui/switch';
import { Slider } from './ui/slider';
import { Separator } from './ui/separator';
import { InteractionSettings, AnimationType, EasingType, ClickActionType } from '../types';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { ChevronDown, Sparkles, MousePointer, Scroll } from 'lucide-react';
import { useState } from 'react';

interface InteractionsTabProps {
  interactions?: InteractionSettings;
  onUpdate: (interactions: InteractionSettings) => void;
}

export function InteractionsTab({ interactions, onUpdate }: InteractionsTabProps) {
  const [openSections, setOpenSections] = useState<string[]>(['animation']);

  const toggleSection = (section: string) => {
    setOpenSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const updateAnimation = (updates: Partial<InteractionSettings['animation']>) => {
    onUpdate({
      ...interactions,
      animation: {
        ...interactions?.animation,
        ...updates,
      },
    });
  };

  const updateHover = (updates: Partial<InteractionSettings['hover']>) => {
    onUpdate({
      ...interactions,
      hover: {
        ...interactions?.hover,
        ...updates,
      },
    });
  };

  const updateClick = (updates: Partial<InteractionSettings['click']>) => {
    onUpdate({
      ...interactions,
      click: {
        ...interactions?.click,
        action: interactions?.click?.action || 'none',
        ...updates,
      },
    });
  };

  const updateScroll = (updates: Partial<InteractionSettings['scroll']>) => {
    onUpdate({
      ...interactions,
      scroll: {
        ...interactions?.scroll,
        ...updates,
      },
    });
  };

  return (
    <div className="space-y-4">
      {/* Animation Section */}
      <Collapsible
        open={openSections.includes('animation')}
        onOpenChange={() => toggleSection('animation')}
      >
        <CollapsibleTrigger className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-accent transition-colors">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium">Animation</span>
          </div>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${
              openSections.includes('animation') ? 'rotate-180' : ''
            }`}
          />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-3 space-y-4">
          <div className="space-y-2">
            <Label>Animation Type</Label>
            <Select
              value={interactions?.animation?.type || 'none'}
              onValueChange={(value) => updateAnimation({ type: value as AnimationType })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="fade">Fade In</SelectItem>
                <SelectItem value="slideUp">Slide Up</SelectItem>
                <SelectItem value="slideDown">Slide Down</SelectItem>
                <SelectItem value="slideLeft">Slide Left</SelectItem>
                <SelectItem value="slideRight">Slide Right</SelectItem>
                <SelectItem value="scale">Scale</SelectItem>
                <SelectItem value="bounce">Bounce</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {interactions?.animation?.type && interactions.animation.type !== 'none' && (
            <>
              <div className="space-y-2">
                <Label>Duration (ms)</Label>
                <Input
                  type="number"
                  min="100"
                  max="3000"
                  step="100"
                  value={interactions?.animation?.duration || 600}
                  onChange={(e) => updateAnimation({ duration: parseInt(e.target.value) })}
                />
              </div>

              <div className="space-y-2">
                <Label>Delay (ms)</Label>
                <Input
                  type="number"
                  min="0"
                  max="2000"
                  step="100"
                  value={interactions?.animation?.delay || 0}
                  onChange={(e) => updateAnimation({ delay: parseInt(e.target.value) })}
                />
              </div>

              <div className="space-y-2">
                <Label>Easing</Label>
                <Select
                  value={interactions?.animation?.easing || 'ease-out'}
                  onValueChange={(value) => updateAnimation({ easing: value as EasingType })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="linear">Linear</SelectItem>
                    <SelectItem value="ease">Ease</SelectItem>
                    <SelectItem value="ease-in">Ease In</SelectItem>
                    <SelectItem value="ease-out">Ease Out</SelectItem>
                    <SelectItem value="ease-in-out">Ease In Out</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="trigger-scroll">Trigger on Scroll</Label>
                <Switch
                  id="trigger-scroll"
                  checked={interactions?.animation?.triggerOnScroll || false}
                  onCheckedChange={(checked) => updateAnimation({ triggerOnScroll: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="repeat-animation">Repeat Animation</Label>
                <Switch
                  id="repeat-animation"
                  checked={interactions?.animation?.repeat || false}
                  onCheckedChange={(checked) => updateAnimation({ repeat: checked })}
                />
              </div>
            </>
          )}
        </CollapsibleContent>
      </Collapsible>

      <Separator />

      {/* Hover Effects Section */}
      <Collapsible
        open={openSections.includes('hover')}
        onOpenChange={() => toggleSection('hover')}
      >
        <CollapsibleTrigger className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-accent transition-colors">
          <div className="flex items-center gap-2">
            <MousePointer className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium">Hover Effects</span>
          </div>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${
              openSections.includes('hover') ? 'rotate-180' : ''
            }`}
          />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-3 space-y-4">
          <div className="space-y-2">
            <Label>Scale (1 = normal)</Label>
            <div className="flex items-center gap-2">
              <Slider
                min={0.8}
                max={1.5}
                step={0.05}
                value={[interactions?.hover?.scale || 1]}
                onValueChange={([value]) => updateHover({ scale: value })}
              />
              <span className="text-sm text-muted-foreground w-12 text-right">
                {(interactions?.hover?.scale || 1).toFixed(2)}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Rotate (degrees)</Label>
            <Input
              type="number"
              min="-180"
              max="180"
              value={interactions?.hover?.rotate || 0}
              onChange={(e) => updateHover({ rotate: parseFloat(e.target.value) })}
            />
          </div>

          <div className="space-y-2">
            <Label>Translate Y (pixels)</Label>
            <Input
              type="number"
              min="-50"
              max="50"
              value={interactions?.hover?.translateY || 0}
              onChange={(e) => updateHover({ translateY: parseFloat(e.target.value) })}
            />
          </div>

          <div className="space-y-2">
            <Label>Opacity (0-1)</Label>
            <div className="flex items-center gap-2">
              <Slider
                min={0}
                max={1}
                step={0.1}
                value={[interactions?.hover?.opacity ?? 1]}
                onValueChange={([value]) => updateHover({ opacity: value })}
              />
              <span className="text-sm text-muted-foreground w-12 text-right">
                {(interactions?.hover?.opacity ?? 1).toFixed(1)}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Shadow</Label>
            <Select
              value={interactions?.hover?.shadow || 'none'}
              onValueChange={(value) => updateHover({ shadow: value as any })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="sm">Small</SelectItem>
                <SelectItem value="md">Medium</SelectItem>
                <SelectItem value="lg">Large</SelectItem>
                <SelectItem value="xl">Extra Large</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Background Color</Label>
            <Input
              type="color"
              value={interactions?.hover?.backgroundColor || '#000000'}
              onChange={(e) => updateHover({ backgroundColor: e.target.value })}
            />
          </div>
        </CollapsibleContent>
      </Collapsible>

      <Separator />

      {/* Click Actions Section */}
      <Collapsible
        open={openSections.includes('click')}
        onOpenChange={() => toggleSection('click')}
      >
        <CollapsibleTrigger className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-accent transition-colors">
          <div className="flex items-center gap-2">
            <MousePointer className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium">Click Action</span>
          </div>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${
              openSections.includes('click') ? 'rotate-180' : ''
            }`}
          />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-3 space-y-4">
          <div className="space-y-2">
            <Label>Action Type</Label>
            <Select
              value={interactions?.click?.action || 'none'}
              onValueChange={(value) => updateClick({ action: value as ClickActionType })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="scrollTo">Scroll to Section</SelectItem>
                <SelectItem value="navigate">Navigate to Page</SelectItem>
                <SelectItem value="externalLink">External Link</SelectItem>
                <SelectItem value="openModal">Open Modal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {interactions?.click?.action && interactions.click.action !== 'none' && (
            <div className="space-y-2">
              <Label>
                {interactions.click.action === 'scrollTo' && 'Section ID'}
                {interactions.click.action === 'navigate' && 'Page Path'}
                {interactions.click.action === 'externalLink' && 'URL'}
                {interactions.click.action === 'openModal' && 'Modal Content'}
              </Label>
              <Input
                placeholder={
                  interactions.click.action === 'scrollTo'
                    ? '#menu-section'
                    : interactions.click.action === 'navigate'
                    ? '/menu'
                    : interactions.click.action === 'externalLink'
                    ? 'https://example.com'
                    : 'Modal message'
                }
                value={interactions?.click?.target || ''}
                onChange={(e) => updateClick({ target: e.target.value })}
              />
            </div>
          )}
        </CollapsibleContent>
      </Collapsible>

      <Separator />

      {/* Scroll Effects Section */}
      <Collapsible
        open={openSections.includes('scroll')}
        onOpenChange={() => toggleSection('scroll')}
      >
        <CollapsibleTrigger className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-accent transition-colors">
          <div className="flex items-center gap-2">
            <Scroll className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium">Scroll Effects</span>
          </div>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${
              openSections.includes('scroll') ? 'rotate-180' : ''
            }`}
          />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-3 space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="parallax">Parallax Scrolling</Label>
            <Switch
              id="parallax"
              checked={interactions?.scroll?.parallax || false}
              onCheckedChange={(checked) => updateScroll({ parallax: checked })}
            />
          </div>

          {interactions?.scroll?.parallax && (
            <div className="space-y-2">
              <Label>Parallax Speed</Label>
              <div className="flex items-center gap-2">
                <Slider
                  min={0.1}
                  max={2}
                  step={0.1}
                  value={[interactions?.scroll?.parallaxSpeed || 0.5]}
                  onValueChange={([value]) => updateScroll({ parallaxSpeed: value })}
                />
                <span className="text-sm text-muted-foreground w-12 text-right">
                  {(interactions?.scroll?.parallaxSpeed || 0.5).toFixed(1)}
                </span>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <Label htmlFor="sticky">Sticky Position</Label>
            <Switch
              id="sticky"
              checked={interactions?.scroll?.sticky || false}
              onCheckedChange={(checked) => updateScroll({ sticky: checked })}
            />
          </div>

          {interactions?.scroll?.sticky && (
            <div className="space-y-2">
              <Label>Sticky Offset (px)</Label>
              <Input
                type="number"
                min="0"
                max="200"
                value={interactions?.scroll?.stickyOffset || 0}
                onChange={(e) => updateScroll({ stickyOffset: parseInt(e.target.value) })}
              />
            </div>
          )}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
