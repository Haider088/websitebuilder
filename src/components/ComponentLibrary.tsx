import { useState, useEffect } from 'react';
import { Search, Plus, MoreVertical, Trash2, Edit2, Clock, Star } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { ComponentCard } from './ComponentCard';
import { restaurantComponents } from '../data/restaurantComponents';
import { ComponentCategory, RestaurantComponent, Page } from '../types';
import { Badge } from './ui/badge';
import { useRecentComponents } from '../hooks/useRecentComponents';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Label } from './ui/label';

interface ComponentLibraryProps {
  pages: Page[];
  currentPageId: string;
  onDragStart: (component: RestaurantComponent) => void;
  onSelectPage: (pageId: string) => void;
  onCreatePage: (name: string) => void;
  onRenamePage: (pageId: string, newName: string) => void;
  onDeletePage: (pageId: string) => void;
  onComponentAdded?: (componentId: string) => void;
}

const categoryLabels: Record<ComponentCategory, string> = {
  layout: 'Layout',
  content: 'Content',
  restaurant: 'Restaurant',
  interactive: 'Interactive',
  templates: 'Templates',
};

export function ComponentLibrary({ 
  pages, 
  currentPageId, 
  onDragStart, 
  onSelectPage,
  onCreatePage,
  onRenamePage,
  onDeletePage,
  onComponentAdded,
}: ComponentLibraryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<ComponentCategory | 'recent' | 'all'>('restaurant');
  const [showNewPageDialog, setShowNewPageDialog] = useState(false);
  const [showRenameDialog, setShowRenameDialog] = useState(false);
  const [newPageName, setNewPageName] = useState('');
  const [renamePageId, setRenamePageId] = useState<string | null>(null);
  const [renamingPageName, setRenamingPageName] = useState('');
  const { recentComponentIds } = useRecentComponents();

  const filteredComponents = restaurantComponents.filter((component) => {
    const matchesSearch = component.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      component.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeCategory === 'all') {
      return matchesSearch;
    }
    
    if (activeCategory === 'recent') {
      return matchesSearch && recentComponentIds.includes(component.id);
    }
    
    const matchesCategory = activeCategory === component.category;
    return matchesSearch && matchesCategory;
  });

  // Show all categories when searching
  const displayComponents = searchQuery.trim() 
    ? restaurantComponents.filter((component) => 
        component.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        component.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : filteredComponents;

  const recentComponents = restaurantComponents.filter((c) => recentComponentIds.includes(c.id));
  const hasRecentComponents = recentComponents.length > 0;

  const handleCreatePage = () => {
    if (newPageName.trim()) {
      onCreatePage(newPageName.trim());
      setNewPageName('');
      setShowNewPageDialog(false);
    }
  };

  const handleRenamePage = () => {
    if (renamePageId && renamingPageName.trim()) {
      onRenamePage(renamePageId, renamingPageName.trim());
      setRenamePageId(null);
      setRenamingPageName('');
      setShowRenameDialog(false);
    }
  };

  const openRenameDialog = (pageId: string, currentName: string) => {
    setRenamePageId(pageId);
    setRenamingPageName(currentName);
    setShowRenameDialog(true);
  };

  return (
    <>
      <div className="w-full border-r border-border bg-background flex flex-col h-full">
        {/* Pages Section */}
        <div className="p-3 border-b border-border">
          <div className="text-xs uppercase tracking-wide text-muted-foreground mb-2">Pages</div>
          <ScrollArea className="max-h-48">
            <div className="space-y-1">
              {pages.map((page) => (
                <div key={page.id} className="group flex items-center gap-1">
                  <Button
                    variant={currentPageId === page.id ? "secondary" : "ghost"}
                    size="sm"
                    className="flex-1 justify-start text-sm h-8"
                    onClick={() => onSelectPage(page.id)}
                  >
                    {page.name}
                  </Button>
                  {pages.length > 1 && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreVertical className="w-3.5 h-3.5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openRenameDialog(page.id, page.name)}>
                          <Edit2 className="w-3.5 h-3.5 mr-2" />
                          Rename
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onDeletePage(page.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="w-3.5 h-3.5 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-sm h-8 gap-2 mt-1"
            onClick={() => setShowNewPageDialog(true)}
          >
            <Plus className="w-3 h-3" />
            New Page
          </Button>
        </div>

        {/* Components Section */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <div className="p-3 border-b border-border flex-shrink-0">
            <div className="text-xs uppercase tracking-wide text-muted-foreground mb-2">Components</div>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <Input
                placeholder="Search components..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 h-8 text-sm"
              />
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex gap-1 px-3 py-2 border-b border-border overflow-x-auto scrollbar-hide flex-shrink-0">
            {hasRecentComponents && (
              <Badge
                variant={activeCategory === 'recent' ? "default" : "outline"}
                className="cursor-pointer text-xs px-2 py-0.5 h-6 gap-1 flex-shrink-0"
                onClick={() => setActiveCategory('recent')}
              >
                <Clock className="w-3 h-3" />
                Recent
              </Badge>
            )}
            <Badge
              variant={activeCategory === 'all' ? "default" : "outline"}
              className="cursor-pointer text-xs px-2 py-0.5 h-6 flex-shrink-0"
              onClick={() => setActiveCategory('all')}
            >
              All
            </Badge>
            {Object.entries(categoryLabels).map(([key, label]) => (
              <Badge
                key={key}
                variant={activeCategory === key ? "default" : "outline"}
                className="cursor-pointer text-xs px-2 py-0.5 h-6 flex-shrink-0"
                onClick={() => setActiveCategory(key as ComponentCategory)}
              >
                {label}
              </Badge>
            ))}
          </div>

          <div className="flex-1 min-h-0 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="p-2 space-y-1">
                {searchQuery.trim() && displayComponents.length > 0 && (
                  <div className="mb-2">
                    <p className="text-xs text-muted-foreground px-2 py-1">
                      {displayComponents.length} result{displayComponents.length !== 1 ? 's' : ''} found
                    </p>
                  </div>
                )}
                {displayComponents.length > 0 ? (
                  displayComponents.map((component) => (
                    <ComponentCard
                      key={component.id}
                      component={component}
                      onDragStart={onDragStart}
                    />
                  ))
                ) : (
                  <div className="text-center py-8 px-4">
                    <Search className="w-8 h-8 mx-auto mb-2 text-muted-foreground opacity-50" />
                    <p className="text-sm text-muted-foreground">
                      {searchQuery.trim() ? 'No components found' : 'No components in this category'}
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>

      {/* New Page Dialog */}
      <Dialog open={showNewPageDialog} onOpenChange={setShowNewPageDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Page</DialogTitle>
            <DialogDescription>
              Add a new page to your restaurant website.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="page-name" className="mb-2 block">Page Name</Label>
            <Input
              id="page-name"
              placeholder="e.g., Menu, About, Contact"
              value={newPageName}
              onChange={(e) => setNewPageName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreatePage()}
              className="bg-input-background"
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewPageDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreatePage} disabled={!newPageName.trim()}>
              Create Page
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rename Page Dialog */}
      <Dialog open={showRenameDialog} onOpenChange={setShowRenameDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Page</DialogTitle>
            <DialogDescription>
              Enter a new name for this page.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="rename-page-name" className="mb-2 block">Page Name</Label>
            <Input
              id="rename-page-name"
              placeholder="Page name"
              value={renamingPageName}
              onChange={(e) => setRenamingPageName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleRenamePage()}
              className="bg-input-background"
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRenameDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleRenamePage} disabled={!renamingPageName.trim()}>
              Rename
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
