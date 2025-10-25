import { useState } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { pageTemplates, PageTemplate } from '../data/pageTemplates';
import { LayoutTemplate, Sparkles } from 'lucide-react';
import { Badge } from './ui/badge';

interface TemplatesDialogProps {
  onSelectTemplate: (template: PageTemplate) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function TemplatesDialog({ onSelectTemplate, open: controlledOpen, onOpenChange }: TemplatesDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;
  const [selectedCategory, setSelectedCategory] = useState<PageTemplate['category']>('homepage');

  const categories: { value: PageTemplate['category']; label: string }[] = [
    { value: 'homepage', label: 'Homepage' },
    { value: 'menu', label: 'Menu' },
    { value: 'about', label: 'About' },
    { value: 'contact', label: 'Contact' },
    { value: 'gallery', label: 'Gallery' },
  ];

  const filteredTemplates = pageTemplates.filter((t) => t.category === selectedCategory);

  const handleSelectTemplate = (template: PageTemplate) => {
    onSelectTemplate(template);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <LayoutTemplate className="w-4 h-4" />
          Templates
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Page Templates
          </DialogTitle>
          <DialogDescription>
            Start with a professionally designed template and customize it to match your restaurant
          </DialogDescription>
        </DialogHeader>

        <Tabs value={selectedCategory} onValueChange={(v) => setSelectedCategory(v as PageTemplate['category'])} className="flex-1 flex flex-col min-h-0">
          <TabsList className="grid grid-cols-5 w-full">
            {categories.map((cat) => (
              <TabsTrigger key={cat.value} value={cat.value}>
                {cat.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((cat) => (
            <TabsContent key={cat.value} value={cat.value} className="flex-1 overflow-y-auto mt-4">
              <div className="grid grid-cols-2 gap-4">
                {filteredTemplates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => handleSelectTemplate(template)}
                    className="group relative border border-border rounded-lg p-4 hover:border-primary hover:shadow-md transition-all text-left"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="text-4xl">{template.thumbnail}</div>
                      <Badge variant="secondary" className="text-xs">
                        {template.components.length} components
                      </Badge>
                    </div>
                    <h3 className="font-medium mb-1 group-hover:text-primary transition-colors">
                      {template.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {template.description}
                    </p>
                    
                    {/* Component preview list */}
                    <div className="mt-3 pt-3 border-t border-border">
                      <p className="text-xs text-muted-foreground mb-1">Includes:</p>
                      <div className="flex flex-wrap gap-1">
                        {template.components.slice(0, 3).map((comp, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {comp.name}
                          </Badge>
                        ))}
                        {template.components.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{template.components.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg pointer-events-none" />
                  </button>
                ))}
              </div>

              {filteredTemplates.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <LayoutTemplate className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No templates available in this category yet</p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
