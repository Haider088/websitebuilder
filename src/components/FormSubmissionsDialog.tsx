import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { useFormSubmissions } from '../hooks/useFormSubmissions';
import { Database, Download, Trash2, Calendar, Mail, Search } from 'lucide-react';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog';
import { toast } from 'sonner@2.0.3';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

interface FormSubmissionsDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function FormSubmissionsDialog({ open: controlledOpen, onOpenChange }: FormSubmissionsDialogProps = {}) {
  const [internalOpen, setInternalOpen] = useState(false);
  
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedForm, setSelectedForm] = useState<string>('all');
  const { submissions, deleteSubmission, deleteAllSubmissions, exportSubmissions } = useFormSubmissions();

  // Get unique form names
  const formNames = Array.from(new Set(submissions.map((s) => s.formName)));

  // Filter submissions
  const filteredSubmissions = submissions.filter((submission) => {
    const matchesForm = selectedForm === 'all' || submission.formName === selectedForm;
    const matchesSearch =
      !searchQuery ||
      Object.values(submission.data).some((value) =>
        String(value).toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesForm && matchesSearch;
  });

  const handleExport = () => {
    const csv = exportSubmissions(selectedForm === 'all' ? undefined : selectedForm);
    if (!csv) {
      toast.error('No submissions to export');
      return;
    }

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `form-submissions-${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    toast.success('Submissions exported successfully');
  };

  const handleDelete = (id: string) => {
    deleteSubmission(id);
    toast.success('Submission deleted');
  };

  const handleDeleteAll = () => {
    deleteAllSubmissions();
    toast.success('All submissions deleted');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Database className="w-4 h-4" />
          Form Data
          {submissions.length > 0 && (
            <Badge variant="secondary" className="ml-1">
              {submissions.length}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Form Submissions</DialogTitle>
          <DialogDescription>
            View and manage all form submissions from your website
          </DialogDescription>
        </DialogHeader>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search submissions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>

          <Select value={selectedForm} onValueChange={setSelectedForm}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Forms" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Forms</SelectItem>
              {formNames.map((name) => (
                <SelectItem key={name} value={name}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm" onClick={handleExport} disabled={filteredSubmissions.length === 0}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>

          {submissions.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="text-destructive">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete All
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete All Submissions?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete all {submissions.length} form submission
                    {submissions.length !== 1 ? 's' : ''}. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteAll} className="bg-destructive text-destructive-foreground">
                    Delete All
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>

        {/* Submissions List */}
        <ScrollArea className="flex-1 -mx-6 px-6">
          {filteredSubmissions.length === 0 ? (
            <div className="text-center py-12">
              <Database className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">
                {submissions.length === 0
                  ? 'No form submissions yet'
                  : 'No submissions match your filters'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredSubmissions.map((submission) => (
                <div key={submission.id} className="border border-border rounded-lg p-4 bg-card">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium">{submission.formName}</h4>
                      <div className="flex items-center gap-3 mt-1">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          {new Date(submission.submittedAt).toLocaleString()}
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          ID: {submission.id.slice(-8)}
                        </Badge>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => handleDelete(submission.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="border-t border-border pt-3">
                    <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                      {Object.entries(submission.data).map(([key, value]) => (
                        <div key={key}>
                          <dt className="text-xs font-medium text-muted-foreground capitalize mb-1">
                            {key.replace(/_/g, ' ')}
                          </dt>
                          <dd className="text-sm">
                            {Array.isArray(value) ? value.join(', ') : String(value) || '-'}
                          </dd>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {filteredSubmissions.length > 0 && (
          <div className="text-sm text-muted-foreground">
            Showing {filteredSubmissions.length} of {submissions.length} submission
            {submissions.length !== 1 ? 's' : ''}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
