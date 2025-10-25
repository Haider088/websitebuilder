export type FormFieldType = 
  | 'text' 
  | 'email' 
  | 'phone' 
  | 'textarea' 
  | 'number'
  | 'date'
  | 'time'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'file';

export type ValidationRule = {
  type: 'required' | 'email' | 'phone' | 'minLength' | 'maxLength' | 'min' | 'max' | 'pattern';
  value?: any;
  message?: string;
};

export interface FormField {
  id: string;
  label: string;
  type: FormFieldType;
  placeholder?: string;
  required?: boolean;
  validation?: ValidationRule[];
  options?: string[]; // For select, radio, checkbox
  defaultValue?: string;
  helpText?: string;
  width?: 'full' | 'half'; // Layout width
}

export interface FormConfig {
  id: string;
  name: string;
  description?: string;
  fields: FormField[];
  submitButtonText?: string;
  successMessage?: string;
  errorMessage?: string;
  redirectUrl?: string;
  sendEmail?: boolean;
  emailRecipient?: string;
  emailSubject?: string;
  storeSubmissions?: boolean;
  allowMultipleSubmissions?: boolean;
}

export interface FormSubmission {
  id: string;
  formId: string;
  formName: string;
  data: Record<string, any>;
  submittedAt: number;
  userAgent?: string;
  ipAddress?: string; // Would be populated server-side
}

export interface FormTemplate {
  id: string;
  name: string;
  description: string;
  category: 'contact' | 'reservation' | 'newsletter' | 'feedback' | 'catering' | 'event';
  icon: string;
  config: Omit<FormConfig, 'id'>;
}
