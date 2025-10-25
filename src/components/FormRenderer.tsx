import { useState } from 'react';
import { FormConfig, FormField as FormFieldType } from '../types/forms';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { validateForm, ValidationError } from '../utils/formValidation';
import { useFormSubmissions } from '../hooks/useFormSubmissions';
import { toast } from 'sonner@2.0.3';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';

interface FormRendererProps {
  config: FormConfig;
  onSubmitSuccess?: (data: Record<string, any>) => void;
  className?: string;
}

export function FormRenderer({ config, onSubmitSuccess, className = '' }: FormRendererProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const { addSubmission } = useFormSubmissions();

  const handleChange = (fieldId: string, value: any) => {
    setFormData({ ...formData, [fieldId]: value });
    // Clear error when user starts typing
    if (errors[fieldId]) {
      const newErrors = { ...errors };
      delete newErrors[fieldId];
      setErrors(newErrors);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const validationErrors = validateForm(config.fields, formData);
    if (validationErrors.length > 0) {
      const errorMap: Record<string, string> = {};
      validationErrors.forEach((err) => {
        errorMap[err.field] = err.message;
      });
      setErrors(errorMap);
      toast.error('Please fix the errors in the form');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Store submission if enabled
      if (config.storeSubmissions) {
        addSubmission({
          formId: config.id,
          formName: config.name,
          data: formData,
        });
      }

      // Show success
      setSubmitStatus('success');
      toast.success(config.successMessage || 'Form submitted successfully!');
      
      // Reset form
      setFormData({});
      setErrors({});

      // Call success callback
      if (onSubmitSuccess) {
        onSubmitSuccess(formData);
      }

      // Redirect if configured
      if (config.redirectUrl) {
        setTimeout(() => {
          window.location.href = config.redirectUrl!;
        }, 2000);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
      toast.error(config.errorMessage || 'Failed to submit form');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (field: FormFieldType) => {
    const fieldError = errors[field.id];
    const fieldValue = formData[field.id] || '';

    const fieldWrapper = (children: React.ReactNode) => (
      <div
        key={field.id}
        className={`space-y-2 ${
          field.width === 'half' ? 'md:col-span-1' : 'md:col-span-2'
        }`}
      >
        <Label htmlFor={field.id}>
          {field.label}
          {field.required && <span className="text-destructive ml-1">*</span>}
        </Label>
        {children}
        {field.helpText && (
          <p className="text-xs text-muted-foreground">{field.helpText}</p>
        )}
        {fieldError && (
          <p className="text-xs text-destructive flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {fieldError}
          </p>
        )}
      </div>
    );

    switch (field.type) {
      case 'text':
      case 'email':
      case 'phone':
      case 'number':
        return fieldWrapper(
          <Input
            id={field.id}
            type={field.type}
            value={fieldValue}
            onChange={(e) => handleChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            className={fieldError ? 'border-destructive' : ''}
          />
        );

      case 'textarea':
        return fieldWrapper(
          <Textarea
            id={field.id}
            value={fieldValue}
            onChange={(e) => handleChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            className={fieldError ? 'border-destructive' : ''}
            rows={4}
          />
        );

      case 'date':
      case 'time':
        return fieldWrapper(
          <Input
            id={field.id}
            type={field.type}
            value={fieldValue}
            onChange={(e) => handleChange(field.id, e.target.value)}
            required={field.required}
            className={fieldError ? 'border-destructive' : ''}
          />
        );

      case 'select':
        return fieldWrapper(
          <Select
            value={fieldValue}
            onValueChange={(value) => handleChange(field.id, value)}
          >
            <SelectTrigger id={field.id} className={fieldError ? 'border-destructive' : ''}>
              <SelectValue placeholder={field.placeholder || 'Select an option'} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'radio':
        return fieldWrapper(
          <RadioGroup
            value={fieldValue}
            onValueChange={(value) => handleChange(field.id, value)}
          >
            {field.options?.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`${field.id}-${option}`} />
                <Label htmlFor={`${field.id}-${option}`} className="cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );

      case 'checkbox':
        return fieldWrapper(
          <div className="space-y-2">
            {field.options?.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <Checkbox
                  id={`${field.id}-${option}`}
                  checked={(formData[field.id] || []).includes(option)}
                  onCheckedChange={(checked) => {
                    const current = formData[field.id] || [];
                    const updated = checked
                      ? [...current, option]
                      : current.filter((o: string) => o !== option);
                    handleChange(field.id, updated);
                  }}
                />
                <Label htmlFor={`${field.id}-${option}`} className="cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  if (submitStatus === 'success') {
    return (
      <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
        <CheckCircle2 className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800 dark:text-green-200">
          {config.successMessage || 'Thank you for your submission!'}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={className}>
      {config.description && (
        <p className="text-muted-foreground mb-6">{config.description}</p>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {config.fields.map(renderField)}
      </div>

      {submitStatus === 'error' && (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {config.errorMessage || 'Failed to submit form. Please try again.'}
          </AlertDescription>
        </Alert>
      )}

      <Button type="submit" disabled={isSubmitting} className="mt-6 w-full md:w-auto">
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Submitting...
          </>
        ) : (
          config.submitButtonText || 'Submit'
        )}
      </Button>
    </form>
  );
}
