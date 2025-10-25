import { useState, useRef, useCallback } from 'react';
import { ImageIcon, Upload, Trash2, Search, X, Link2, Check } from 'lucide-react';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import { Asset, AssetCategory } from '../types';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import { cn } from './ui/utils';

interface AssetManagerDialogProps {
  assets: Asset[];
  onAddAsset: (file: File, category: AssetCategory) => Promise<Asset>;
  onAddAssetFromUrl: (url: string, name: string, category: AssetCategory) => Asset;
  onDeleteAsset: (id: string) => void;
  onUpdateAsset: (id: string, updates: Partial<Asset>) => void;
  onSelectAsset?: (asset: Asset) => void;
  selectedAssetId?: string;
  selectionMode?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const categories: { value: AssetCategory; label: string; icon: string }[] = [
  { value: 'all', label: 'All Assets', icon: '📁' },
  { value: 'food', label: 'Food & Dishes', icon: '🍽️' },
  { value: 'interior', label: 'Interior', icon: '🏛️' },
  { value: 'staff', label: 'Staff & Team', icon: '👥' },
  { value: 'logo', label: 'Logos & Branding', icon: '🎨' },
  { value: 'other', label: 'Other', icon: '📷' },
];

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

export function AssetManagerDialog({
  assets,
  onAddAsset,
  onAddAssetFromUrl,
  onDeleteAsset,
  onUpdateAsset,
  onSelectAsset,
  selectedAssetId,
  selectionMode = false,
  open: controlledOpen,
  onOpenChange,
}: AssetManagerDialogProps) {
  const [currentCategory, setCurrentCategory] = useState<AssetCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [deleteAssetId, setDeleteAssetId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAddingUrl, setIsAddingUrl] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [urlName, setUrlName] = useState('');
  const [internalOpen, setInternalOpen] = useState(false);
  
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setIsOpen = onOpenChange || setInternalOpen;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredAssets = assets
    .filter((asset) => currentCategory === 'all' || asset.category === currentCategory)
    .filter((asset) =>
      asset.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const uploadPromises = Array.from(files).map(async (file) => {
      try {
        await onAddAsset(file, currentCategory === 'all' ? 'food' : currentCategory);
        toast.success(`${file.name} uploaded successfully`);
      } catch (error) {
        toast.error(`Failed to upload ${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    });

    await Promise.all(uploadPromises);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  }, [currentCategory]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleAddFromUrl = () => {
    if (!urlInput || !urlName) {
      toast.error('Please provide both URL and name');
      return;
    }

    try {
      onAddAssetFromUrl(urlInput, urlName, currentCategory === 'all' ? 'food' : currentCategory);
      toast.success('Asset added successfully');
      setUrlInput('');
      setUrlName('');
      setIsAddingUrl(false);
    } catch (error) {
      toast.error('Failed to add asset from URL');
    }
  };

  const handleDeleteAsset = () => {
    if (!deleteAssetId) return;
    
    const asset = assets.find((a) => a.id === deleteAssetId);
    if (asset && asset.usedIn.length > 0) {
      toast.error(`Cannot delete asset. It's being used in ${asset.usedIn.length} component(s)`);
      setDeleteAssetId(null);
      return;
    }

    onDeleteAsset(deleteAssetId);
    toast.success('Asset deleted');
    setDeleteAssetId(null);
    setSelectedAsset(null);
  };

  const handleSelectAsset = (asset: Asset) => {
    if (selectionMode && onSelectAsset) {
      onSelectAsset(asset);
      setIsOpen(false);
    } else {
      setSelectedAsset(selectedAsset?.id === asset.id ? null : asset);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant={selectionMode ? "outline" : "ghost"} size="sm" className="gap-2">
            <ImageIcon className="w-4 h-4" />
            {selectionMode ? 'Choose from Library' : 'Assets'}
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-6xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Asset Manager</DialogTitle>
            <DialogDescription>
              Upload and manage your restaurant images
            </DialogDescription>
          </DialogHeader>

          <div className="flex gap-4 flex-1 min-h-0">
            {/* Sidebar */}
            <div className="w-48 space-y-2">
              <div className="space-y-1">
                {categories.map((cat) => (
                  <div
                    key={cat.value}
                    onClick={() => setCurrentCategory(cat.value)}
                    className={cn(
                      "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer",
                      currentCategory === cat.value
                        ? "bg-accent text-accent-foreground"
                        : "hover:bg-accent/50"
                    )}
                  >
                    <span>{cat.icon}</span>
                    <span className="flex-1 text-left">{cat.label}</span>
                    <span className="text-xs text-muted-foreground">
                      {cat.value === 'all'
                        ? assets.length
                        : assets.filter((a) => a.category === cat.value).length}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-border space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full gap-2"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-4 h-4" />
                  Upload File
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full gap-2"
                  onClick={() => setIsAddingUrl(true)}
                >
                  <Link2 className="w-4 h-4" />
                  Add from URL
                </Button>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
              {/* Search */}
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search assets..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      <X className="w-4 h-4 text-muted-foreground" />
                    </button>
                  )}
                </div>
              </div>

              {/* Assets Grid */}
              <ScrollArea className="flex-1">
                <div
                  className={cn(
                    "relative min-h-[400px]",
                    isDragging && "bg-accent/50 border-2 border-dashed border-primary rounded-lg"
                  )}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                >
                  {filteredAssets.length === 0 ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <ImageIcon className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                        <h3 className="mb-1">No assets yet</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          {searchQuery
                            ? 'No assets match your search'
                            : 'Upload images or drag and drop files here'}
                        </p>
                        {!searchQuery && (
                          <Button
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            Upload Image
                          </Button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-4 gap-4 p-1">
                      {filteredAssets.map((asset) => (
                        <div
                          key={asset.id}
                          onClick={() => handleSelectAsset(asset)}
                          className={cn(
                            "relative group rounded-lg overflow-hidden border-2 transition-all aspect-square cursor-pointer",
                            (selectedAsset?.id === asset.id || selectedAssetId === asset.id)
                              ? "border-primary ring-2 ring-primary/20"
                              : "border-transparent hover:border-border"
                          )}
                        >
                          <img
                            src={asset.url}
                            alt={asset.name}
                            className="w-full h-full object-cover"
                          />
                          
                          {/* Overlay */}
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                            {!selectionMode && (
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDeleteAssetId(asset.id);
                                }}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            )}
                          </div>

                          {/* Selection Check */}
                          {(selectedAsset?.id === asset.id || selectedAssetId === asset.id) && (
                            <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                              <Check className="w-4 h-4 text-primary-foreground" />
                            </div>
                          )}

                          {/* Asset Info */}
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 pointer-events-none">
                            <p className="text-xs text-white truncate">{asset.name}</p>
                            {asset.size > 0 && (
                              <p className="text-xs text-white/70">{formatFileSize(asset.size)}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Asset Details */}
              {selectedAsset && !selectionMode && (
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="flex gap-4">
                    <img
                      src={selectedAsset.url}
                      alt={selectedAsset.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <Input
                        value={selectedAsset.name}
                        onChange={(e) =>
                          onUpdateAsset(selectedAsset.id, { name: e.target.value })
                        }
                        className="mb-2"
                      />
                      <div className="text-sm space-y-1">
                        <p className="text-muted-foreground">
                          Category: {categories.find((c) => c.value === selectedAsset.category)?.label}
                        </p>
                        {selectedAsset.size > 0 && (
                          <p className="text-muted-foreground">
                            Size: {formatFileSize(selectedAsset.size)}
                          </p>
                        )}
                        {selectedAsset.usedIn.length > 0 && (
                          <p className="text-muted-foreground">
                            Used in {selectedAsset.usedIn.length} component(s)
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleFileSelect(e.target.files)}
          />
        </DialogContent>
      </Dialog>

      {/* Add from URL Dialog */}
      <Dialog open={isAddingUrl} onOpenChange={setIsAddingUrl}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Image from URL</DialogTitle>
            <DialogDescription>
              Enter an image URL and give it a name
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="asset-url">Image URL</Label>
              <Input
                id="asset-url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="asset-name">Name</Label>
              <Input
                id="asset-name"
                value={urlName}
                onChange={(e) => setUrlName(e.target.value)}
                placeholder="My Image"
                className="mt-1.5"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setIsAddingUrl(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddFromUrl}>Add Asset</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteAssetId !== null} onOpenChange={() => setDeleteAssetId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Asset</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this asset? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteAsset}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
