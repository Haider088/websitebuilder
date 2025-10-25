import { FormField, ValidationRule } from '../types/forms';

export interface ValidationError {
  field: string;
  message: string;
}

export function validateField(field: FormField, value: any): ValidationError | null {
  if (!field.validation || field.validation.length === 0) {
    return null;
  }

  for (const rule of field.validation) {
    const error = validateRule(field, value, rule);
    if (error) {
      return error;
    }
  }

  return null;
}

function validateRule(field: FormField, value: any, rule: ValidationRule): ValidationError | null {
  const fieldValue = typeof value === 'string' ? value.trim() : value;

  switch (rule.type) {
    case 'required':
      if (!fieldValue || (Array.isArray(fieldValue) && fieldValue.length === 0)) {
        return {
          field: field.id,
          message: rule.message || `${field.label} is required`,
        };
      }
      break;

    case 'email':
      if (fieldValue && !isValidEmail(fieldValue)) {
        return {
          field: field.id,
          message: rule.message || 'Please enter a valid email address',
        };
      }
      break;

    case 'phone':
      if (fieldValue && !isValidPhone(fieldValue)) {
        return {
          field: field.id,
          message: rule.message || 'Please enter a valid phone number',
        };
      }
      break;

    case 'minLength':
      if (fieldValue && fieldValue.length < rule.value) {
        return {
          field: field.id,
          message: rule.message || `${field.label} must be at least ${rule.value} characters`,
        };
      }
      break;

    case 'maxLength':
      if (fieldValue && fieldValue.length > rule.value) {
        return {
          field: field.id,
          message: rule.message || `${field.label} must be no more than ${rule.value} characters`,
        };
      }
      break;

    case 'min':
      if (fieldValue !== '' && Number(fieldValue) < rule.value) {
        return {
          field: field.id,
          message: rule.message || `${field.label} must be at least ${rule.value}`,
        };
      }
      break;

    case 'max':
      if (fieldValue !== '' && Number(fieldValue) > rule.value) {
        return {
          field: field.id,
          message: rule.message || `${field.label} must be no more than ${rule.value}`,
        };
      }
      break;

    case 'pattern':
      if (fieldValue && rule.value && !new RegExp(rule.value).test(fieldValue)) {
        return {
          field: field.id,
          message: rule.message || `${field.label} format is invalid`,
        };
      }
      break;
  }

  return null;
}

export function validateForm(fields: FormField[], formData: Record<string, any>): ValidationError[] {
  const errors: ValidationError[] = [];

  for (const field of fields) {
    const value = formData[field.id];
    const error = validateField(field, value);
    if (error) {
      errors.push(error);
    }
  }

  return errors;
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidPhone(phone: string): boolean {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  // Check if it's a valid length (10-15 digits)
  return cleaned.length >= 10 && cleaned.length <= 15;
}

export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  
  return phone;
}
