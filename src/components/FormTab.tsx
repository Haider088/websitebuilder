import { CanvasComponent } from '../types';
import { FormConfig } from '../types/forms';
import { FormBuilderDialog } from './FormBuilderDialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { FormInput, Sparkles, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';

interface FormTabProps {
  component: CanvasComponent;
  onUpdateComponent: (id: string, props: Record<string, any>) => void;
}

export function FormTab({ component, onUpdateComponent }: FormTabProps) {
  // FormConfig can be in either component.formConfig or component.props.__formConfig
  const formConfig = component.formConfig || (component.props?.__formConfig as FormConfig | undefined);

  const handleSaveForm = (config: FormConfig) => {
    onUpdateComponent(component.id, {
      ...component.props,
      __formConfig: config,
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Form Configuration</h3>
        <p className="text-xs text-muted-foreground">
          Design your form fields and configure submission handling
        </p>
      </div>

      {formConfig ? (
        <div className="border border-border rounded-lg p-4 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-medium">{formConfig.name}</h4>
              {formConfig.description && (
                <p className="text-sm text-muted-foreground mt-1">{formConfig.description}</p>
              )}
            </div>
            <Badge variant="secondary">{formConfig.fields.length} fields</Badge>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Submit Button:</span>
              <span className="font-medium">{formConfig.submitButtonText || 'Submit'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Store Submissions:</span>
              <span className="font-medium">{formConfig.storeSubmissions ? 'Yes' : 'No'}</span>
            </div>
            {formConfig.sendEmail && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email Notifications:</span>
                <span className="font-medium">Enabled</span>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-border">
            <h5 className="text-sm font-medium mb-2">Form Fields</h5>
            <div className="space-y-1">
              {formConfig.fields.map((field) => (
                <div
                  key={field.id}
                  className="flex items-center justify-between py-1.5 px-2 rounded bg-muted/50 text-sm"
                >
                  <div className="flex items-center gap-2">
                    <FormInput className="w-3.5 h-3.5 text-muted-foreground" />
                    <span>{field.label}</span>
                    {field.required && (
                      <Badge variant="outline" className="text-xs h-5 px-1.5">
                        Required
                      </Badge>
                    )}
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {field.type}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          <FormBuilderDialog
            initialConfig={formConfig}
            onSave={handleSaveForm}
            trigger={
              <Button variant="outline" className="w-full">
                Edit Form
              </Button>
            }
          />
        </div>
      ) : (
        <div className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              No form configured yet. Create a form to start collecting data from your visitors.
            </AlertDescription>
          </Alert>

          <FormBuilderDialog
            onSave={handleSaveForm}
            trigger={
              <Button className="w-full gap-2">
                <Sparkles className="w-4 h-4" />
                Create Form
              </Button>
            }
          />
        </div>
      )}
    </div>
  );
}
