import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { ScrollArea } from './ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { FormConfig, FormField, FormFieldType, FormTemplate } from '../types/forms';
import { formTemplates } from '../data/formTemplates';
import { Plus, Trash2, GripVertical, Copy, Sparkles } from 'lucide-react';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Switch } from './ui/switch';

interface FormBuilderDialogProps {
  initialConfig?: FormConfig;
  onSave: (config: FormConfig) => void;
  trigger?: React.ReactNode;
}

export function FormBuilderDialog({ initialConfig, onSave, trigger }: FormBuilderDialogProps) {
  const [open, setOpen] = useState(false);
  const [config, setConfig] = useState<FormConfig>(
    initialConfig || {
      id: `form-${Date.now()}`,
      name: 'New Form',
      fields: [],
      submitButtonText: 'Submit',
      successMessage: 'Thank you for your submission!',
      storeSubmissions: true,
    }
  );

  const fieldTypes: { value: FormFieldType; label: string }[] = [
    { value: 'text', label: 'Text' },
    { value: 'email', label: 'Email' },
    { value: 'phone', label: 'Phone' },
    { value: 'textarea', label: 'Long Text' },
    { value: 'number', label: 'Number' },
    { value: 'date', label: 'Date' },
    { value: 'time', label: 'Time' },
    { value: 'select', label: 'Dropdown' },
    { value: 'radio', label: 'Radio Buttons' },
    { value: 'checkbox', label: 'Checkboxes' },
  ];

  const addField = (type: FormFieldType) => {
    const newField: FormField = {
      id: `field-${Date.now()}`,
      label: 'New Field',
      type,
      required: false,
      width: 'full',
      ...(type === 'select' || type === 'radio' || type === 'checkbox'
        ? { options: ['Option 1', 'Option 2'] }
        : {}),
    };

    setConfig({
      ...config,
      fields: [...config.fields, newField],
    });
  };

  const updateField = (index: number, updates: Partial<FormField>) => {
    const updatedFields = [...config.fields];
    updatedFields[index] = { ...updatedFields[index], ...updates };
    setConfig({ ...config, fields: updatedFields });
  };

  const deleteField = (index: number) => {
    setConfig({
      ...config,
      fields: config.fields.filter((_, i) => i !== index),
    });
  };

  const duplicateField = (index: number) => {
    const fieldToDuplicate = config.fields[index];
    const newField = {
      ...fieldToDuplicate,
      id: `field-${Date.now()}`,
      label: `${fieldToDuplicate.label} (Copy)`,
    };
    const updatedFields = [...config.fields];
    updatedFields.splice(index + 1, 0, newField);
    setConfig({ ...config, fields: updatedFields });
  };

  const moveField = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= config.fields.length) return;

    const updatedFields = [...config.fields];
    [updatedFields[index], updatedFields[newIndex]] = [updatedFields[newIndex], updatedFields[index]];
    setConfig({ ...config, fields: updatedFields });
  };

  const applyTemplate = (template: FormTemplate) => {
    setConfig({
      ...config,
      ...template.config,
      id: config.id, // Keep existing ID
    });
  };

  const handleSave = () => {
    onSave(config);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            Configure Form
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Form Builder</DialogTitle>
          <DialogDescription>
            Design your form by adding fields and configuring settings
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="fields" className="flex-1 flex flex-col min-h-0">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="fields">Fields</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>

          <TabsContent value="fields" className="flex-1 overflow-hidden flex gap-4 mt-4">
            {/* Field Types Panel */}
            <div className="w-48 flex-shrink-0">
              <Label className="text-xs uppercase text-muted-foreground mb-2 block">Add Field</Label>
              <ScrollArea className="h-[500px]">
                <div className="space-y-1">
                  {fieldTypes.map((type) => (
                    <Button
                      key={type.value}
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => addField(type.value)}
                    >
                      <Plus className="w-3 h-3 mr-2" />
                      {type.label}
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Fields List */}
            <div className="flex-1 overflow-hidden flex flex-col">
              <Label className="text-xs uppercase text-muted-foreground mb-2">Form Fields ({config.fields.length})</Label>
              <ScrollArea className="flex-1">
                {config.fields.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <p className="text-sm">No fields yet. Add fields from the left panel.</p>
                  </div>
                ) : (
                  <div className="space-y-2 pr-4">
                    {config.fields.map((field, index) => (
                      <div key={field.id} className="border border-border rounded-lg p-4 bg-card">
                        <div className="flex items-start gap-3">
                          <div className="flex flex-col gap-1 pt-2">
                            <button
                              onClick={() => moveField(index, 'up')}
                              disabled={index === 0}
                              className="text-muted-foreground hover:text-foreground disabled:opacity-30"
                            >
                              <GripVertical className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="flex-1 space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <Label className="text-xs">Label</Label>
                                <Input
                                  value={field.label}
                                  onChange={(e) => updateField(index, { label: e.target.value })}
                                  className="h-8"
                                />
                              </div>
                              <div>
                                <Label className="text-xs">Placeholder</Label>
                                <Input
                                  value={field.placeholder || ''}
                                  onChange={(e) => updateField(index, { placeholder: e.target.value })}
                                  className="h-8"
                                  placeholder="Optional"
                                />
                              </div>
                            </div>

                            {(field.type === 'select' || field.type === 'radio' || field.type === 'checkbox') && (
                              <div>
                                <Label className="text-xs">Options (one per line)</Label>
                                <Textarea
                                  value={field.options?.join('\n') || ''}
                                  onChange={(e) =>
                                    updateField(index, {
                                      options: e.target.value.split('\n').filter((o) => o.trim()),
                                    })
                                  }
                                  className="h-20 text-sm"
                                  placeholder="Option 1&#10;Option 2&#10;Option 3"
                                />
                              </div>
                            )}

                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-2">
                                <Checkbox
                                  id={`required-${field.id}`}
                                  checked={field.required}
                                  onCheckedChange={(checked) =>
                                    updateField(index, { required: checked as boolean })
                                  }
                                />
                                <Label htmlFor={`required-${field.id}`} className="text-xs cursor-pointer">
                                  Required
                                </Label>
                              </div>

                              <div className="flex items-center gap-2">
                                <Label className="text-xs">Width:</Label>
                                <Select
                                  value={field.width || 'full'}
                                  onValueChange={(value) =>
                                    updateField(index, { width: value as 'full' | 'half' })
                                  }
                                >
                                  <SelectTrigger className="h-7 w-24 text-xs">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="full">Full</SelectItem>
                                    <SelectItem value="half">Half</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              <Badge variant="outline" className="text-xs">
                                {fieldTypes.find((t) => t.value === field.type)?.label}
                              </Badge>
                            </div>
                          </div>

                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => duplicateField(index)}
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-destructive"
                              onClick={() => deleteField(index)}
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
            </div>
          </TabsContent>

          <TabsContent value="settings" className="flex-1 overflow-hidden mt-4">
            <ScrollArea className="h-[500px]">
              <div className="space-y-6 pr-4">
                <div className="space-y-3">
                  <Label>Form Name</Label>
                  <Input
                    value={config.name}
                    onChange={(e) => setConfig({ ...config, name: e.target.value })}
                  />
                </div>

                <div className="space-y-3">
                  <Label>Description (Optional)</Label>
                  <Textarea
                    value={config.description || ''}
                    onChange={(e) => setConfig({ ...config, description: e.target.value })}
                    placeholder="Brief description of this form"
                  />
                </div>

                <Separator />

                <div className="space-y-3">
                  <Label>Submit Button Text</Label>
                  <Input
                    value={config.submitButtonText || 'Submit'}
                    onChange={(e) => setConfig({ ...config, submitButtonText: e.target.value })}
                  />
                </div>

                <div className="space-y-3">
                  <Label>Success Message</Label>
                  <Textarea
                    value={config.successMessage || ''}
                    onChange={(e) => setConfig({ ...config, successMessage: e.target.value })}
                    placeholder="Thank you for your submission!"
                  />
                </div>

                <div className="space-y-3">
                  <Label>Error Message</Label>
                  <Textarea
                    value={config.errorMessage || ''}
                    onChange={(e) => setConfig({ ...config, errorMessage: e.target.value })}
                    placeholder="Sorry, there was an error. Please try again."
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Store Submissions</Label>
                    <p className="text-xs text-muted-foreground">Save form data locally</p>
                  </div>
                  <Switch
                    checked={config.storeSubmissions}
                    onCheckedChange={(checked) => setConfig({ ...config, storeSubmissions: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Send Email Notification</Label>
                    <p className="text-xs text-muted-foreground">Email when form is submitted</p>
                  </div>
                  <Switch
                    checked={config.sendEmail}
                    onCheckedChange={(checked) => setConfig({ ...config, sendEmail: checked })}
                  />
                </div>

                {config.sendEmail && (
                  <>
                    <div className="space-y-3">
                      <Label>Email Recipient</Label>
                      <Input
                        type="email"
                        value={config.emailRecipient || ''}
                        onChange={(e) => setConfig({ ...config, emailRecipient: e.target.value })}
                        placeholder="your@email.com"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label>Email Subject</Label>
                      <Input
                        value={config.emailSubject || ''}
                        onChange={(e) => setConfig({ ...config, emailSubject: e.target.value })}
                        placeholder="New Form Submission"
                      />
                    </div>
                  </>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="templates" className="flex-1 overflow-hidden mt-4">
            <ScrollArea className="h-[500px]">
              <div className="grid grid-cols-2 gap-3 pr-4">
                {formTemplates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => applyTemplate(template)}
                    className="text-left border border-border rounded-lg p-4 hover:border-primary hover:shadow-md transition-all group"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{template.icon}</span>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium mb-1 group-hover:text-primary transition-colors">
                          {template.name}
                        </h4>
                        <p className="text-xs text-muted-foreground mb-2">
                          {template.description}
                        </p>
                        <Badge variant="secondary" className="text-xs">
                          {template.config.fields.length} fields
                        </Badge>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Sparkles className="w-4 h-4 mr-2" />
            Save Form
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
