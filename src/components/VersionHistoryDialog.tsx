import { useState } from 'react';
import { Clock, Save, RotateCcw, Trash2, History, Info, FileText, Layers } from 'lucide-react';
import { ProjectVersion } from '../types';
import { useVersionHistory, VersionHistoryState } from '../hooks/useVersionHistory';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
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
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { toast } from 'sonner@2.0.3';

interface VersionHistoryDialogProps {
  currentState: VersionHistoryState;
  onRestoreVersion: (state: VersionHistoryState) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function VersionHistoryDialog({ currentState, onRestoreVersion, open: controlledOpen, onOpenChange }: VersionHistoryDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [versionName, setVersionName] = useState('');
  const [versionDescription, setVersionDescription] = useState('');
  const [selectedVersion, setSelectedVersion] = useState<ProjectVersion | null>(null);
  const [showRestoreConfirm, setShowRestoreConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [versionToDelete, setVersionToDelete] = useState<string | null>(null);

  const {
    versions,
    saveVersion,
    restoreVersion,
    deleteVersion,
    deleteAllVersions,
    getVersionStats,
  } = useVersionHistory();

  const stats = getVersionStats();

  const handleSaveVersion = () => {
    const name = versionName.trim() || `Version ${new Date().toLocaleString()}`;
    saveVersion(currentState, name, versionDescription, false);
    toast.success('Version saved successfully!');
    setVersionName('');
    setVersionDescription('');
    setShowSaveDialog(false);
  };

  const handleRestoreVersion = () => {
    if (!selectedVersion) return;

    const restoredState = restoreVersion(selectedVersion.id);
    if (restoredState) {
      onRestoreVersion(restoredState);
      toast.success(`Restored "${selectedVersion.name}"`);
      setOpen(false);
      setShowRestoreConfirm(false);
      setSelectedVersion(null);
    }
  };

  const handleDeleteVersion = (versionId: string) => {
    deleteVersion(versionId);
    toast.success('Version deleted');
    setShowDeleteConfirm(false);
    setVersionToDelete(null);
    if (selectedVersion?.id === versionId) {
      setSelectedVersion(null);
    }
  };

  const handleDeleteAll = () => {
    deleteAllVersions();
    toast.success('All versions deleted');
    setSelectedVersion(null);
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const manualVersions = versions.filter(v => !v.isAutoSave);
  const autoSaves = versions.filter(v => v.isAutoSave);

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="sm" className="gap-2">
            <History className="w-4 h-4" />
            Versions
            {versions.length > 0 && (
              <Badge variant="secondary" className="ml-1 text-xs">
                {versions.length}
              </Badge>
            )}
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[85vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <History className="w-5 h-5" />
              Version History
            </DialogTitle>
            <DialogDescription>
              Save snapshots of your project and restore previous versions
            </DialogDescription>
          </DialogHeader>

          <div className="flex gap-4 mb-4">
            <Button onClick={() => setShowSaveDialog(true)} className="gap-2">
              <Save className="w-4 h-4" />
              Save Version
            </Button>
            <div className="flex-1" />
            <div className="text-sm text-muted-foreground space-y-1">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4" />
                <span>{stats.total} versions • {stats.sizeInMB} MB used</span>
              </div>
            </div>
          </div>

          <Tabs defaultValue="all" className="flex-1">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">
                All ({versions.length})
              </TabsTrigger>
              <TabsTrigger value="manual">
                Saved ({manualVersions.length})
              </TabsTrigger>
              <TabsTrigger value="auto">
                Auto-saves ({autoSaves.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-4">
              <ScrollArea className="h-[400px] pr-4">
                {versions.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No versions saved yet</p>
                    <p className="text-sm mt-2">Save your first version to get started</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {versions.map((version, index) => (
                      <div
                        key={version.id}
                        className={`p-4 rounded-lg border cursor-pointer transition-all ${
                          selectedVersion?.id === version.id
                            ? 'border-primary bg-accent'
                            : 'border-border hover:border-muted-foreground hover:bg-accent/50'
                        }`}
                        onClick={() => setSelectedVersion(version)}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium truncate">{version.name}</h4>
                              {version.isAutoSave && (
                                <Badge variant="outline" className="text-xs">
                                  Auto
                                </Badge>
                              )}
                              {index === 0 && (
                                <Badge variant="secondary" className="text-xs">
                                  Latest
                                </Badge>
                              )}
                            </div>
                            {version.description && (
                              <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                                {version.description}
                              </p>
                            )}
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {formatDate(version.timestamp)}
                              </span>
                              <span className="flex items-center gap-1">
                                <FileText className="w-3 h-3" />
                                {version.pageCount} page{version.pageCount !== 1 ? 's' : ''}
                              </span>
                              <span className="flex items-center gap-1">
                                <Layers className="w-3 h-3" />
                                {version.componentCount} component{version.componentCount !== 1 ? 's' : ''}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedVersion(version);
                                setShowRestoreConfirm(true);
                              }}
                              className="gap-2"
                            >
                              <RotateCcw className="w-3 h-3" />
                              Restore
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                setVersionToDelete(version.id);
                                setShowDeleteConfirm(true);
                              }}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </TabsContent>

            <TabsContent value="manual" className="mt-4">
              <ScrollArea className="h-[400px] pr-4">
                {manualVersions.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Save className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No manual saves yet</p>
                    <p className="text-sm mt-2">Click "Save Version" to create a snapshot</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {manualVersions.map((version, index) => (
                      <div
                        key={version.id}
                        className={`p-4 rounded-lg border cursor-pointer transition-all ${
                          selectedVersion?.id === version.id
                            ? 'border-primary bg-accent'
                            : 'border-border hover:border-muted-foreground hover:bg-accent/50'
                        }`}
                        onClick={() => setSelectedVersion(version)}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium truncate mb-1">{version.name}</h4>
                            {version.description && (
                              <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                                {version.description}
                              </p>
                            )}
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {formatDate(version.timestamp)}
                              </span>
                              <span className="flex items-center gap-1">
                                <FileText className="w-3 h-3" />
                                {version.pageCount} page{version.pageCount !== 1 ? 's' : ''}
                              </span>
                              <span className="flex items-center gap-1">
                                <Layers className="w-3 h-3" />
                                {version.componentCount} component{version.componentCount !== 1 ? 's' : ''}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedVersion(version);
                                setShowRestoreConfirm(true);
                              }}
                              className="gap-2"
                            >
                              <RotateCcw className="w-3 h-3" />
                              Restore
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                setVersionToDelete(version.id);
                                setShowDeleteConfirm(true);
                              }}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </TabsContent>

            <TabsContent value="auto" className="mt-4">
              <ScrollArea className="h-[400px] pr-4">
                {autoSaves.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No auto-saves yet</p>
                    <p className="text-sm mt-2">Auto-saves are created periodically</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {autoSaves.map((version) => (
                      <div
                        key={version.id}
                        className={`p-4 rounded-lg border cursor-pointer transition-all ${
                          selectedVersion?.id === version.id
                            ? 'border-primary bg-accent'
                            : 'border-border hover:border-muted-foreground hover:bg-accent/50'
                        }`}
                        onClick={() => setSelectedVersion(version)}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium truncate">{version.name}</h4>
                              <Badge variant="outline" className="text-xs">
                                Auto
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {formatDate(version.timestamp)}
                              </span>
                              <span className="flex items-center gap-1">
                                <FileText className="w-3 h-3" />
                                {version.pageCount} page{version.pageCount !== 1 ? 's' : ''}
                              </span>
                              <span className="flex items-center gap-1">
                                <Layers className="w-3 h-3" />
                                {version.componentCount} component{version.componentCount !== 1 ? 's' : ''}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedVersion(version);
                                setShowRestoreConfirm(true);
                              }}
                              className="gap-2"
                            >
                              <RotateCcw className="w-3 h-3" />
                              Restore
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                setVersionToDelete(version.id);
                                setShowDeleteConfirm(true);
                              }}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
          </Tabs>

          {versions.length > 0 && (
            <>
              <Separator />
              <div className="flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDeleteAll}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete All Versions
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Save Version Dialog */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Version</DialogTitle>
            <DialogDescription>
              Create a named snapshot of your current project
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Version Name</label>
              <Input
                placeholder="e.g., Before menu redesign"
                value={versionName}
                onChange={(e) => setVersionName(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">
                Description (optional)
              </label>
              <Textarea
                placeholder="What changes does this version include?"
                value={versionDescription}
                onChange={(e) => setVersionDescription(e.target.value)}
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveVersion}>
                <Save className="w-4 h-4 mr-2" />
                Save Version
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Restore Confirmation */}
      <AlertDialog open={showRestoreConfirm} onOpenChange={setShowRestoreConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Restore Version?</AlertDialogTitle>
            <AlertDialogDescription>
              This will replace your current project with "{selectedVersion?.name}".
              Your current work will be lost unless you save it first.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleRestoreVersion}>
              Restore Version
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Version?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This version will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setVersionToDelete(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => versionToDelete && handleDeleteVersion(versionToDelete)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
