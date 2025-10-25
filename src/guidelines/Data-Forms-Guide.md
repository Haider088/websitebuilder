# Data & Forms System Guide

This comprehensive guide covers the complete Data & Forms implementation in the Restaurant Website Builder.

## Overview

The Data & Forms system provides restaurant owners with a complete solution for collecting customer data through customizable forms, managing submissions, validating input, and exporting data - all without requiring any technical knowledge.

## Core Features

### 1. Form Builder
**Visual form designer** with drag-and-drop field management
- **Location**: `/components/FormBuilderDialog.tsx`
- **Access**: Property Inspector > Form tab (for form components)

**Field Types Supported**:
- Text input
- Email
- Phone number
- Long text (textarea)
- Number
- Date picker
- Time picker
- Dropdown (select)
- Radio buttons
- Checkboxes
- File upload (future)

**Field Configuration**:
- Label and placeholder text
- Required/optional setting
- Width (full or half for responsive layouts)
- Help text
- Custom validation rules
- Default values
- Options for select/radio/checkbox

### 2. Form Templates
**Pre-built form templates** for common restaurant use cases
- **Location**: `/data/formTemplates.ts`

**Available Templates**:

#### Contact Form
- Name, Email, Phone, Message
- Simple 4-field form for general inquiries
- Default success message and email notification

#### Table Reservation
- Personal details (Name, Email, Phone)
- Reservation details (Date, Time, Guest count)
- Special occasions and dietary notes
- 8 comprehensive fields

#### Newsletter Signup
- Email collection
- Interest preferences (checkboxes)
- Opt-in compliance ready
- Minimal friction design

#### Customer Feedback
- Optional contact info
- Star rating system (1-5)
- Visit date
- Experience description
- Recommendation question

#### Catering Inquiry
- Contact and company info
- Event type and date
- Guest count and budget
- Special requests
- 9 fields for comprehensive event planning

#### Private Event Booking
- Contact details
- Space selection
- Guest count
- Event timing
- Custom requirements

### 3. Form Validation
**Client-side validation** with user-friendly error messages
- **Location**: `/utils/formValidation.ts`

**Validation Rules**:
- `required` - Field must have a value
- `email` - Valid email format (regex-based)
- `phone` - Valid phone number (10-15 digits)
- `minLength` - Minimum character count
- `maxLength` - Maximum character count
- `min` - Minimum numeric value
- `max` - Maximum numeric value
- `pattern` - Custom regex pattern

**Error Handling**:
- Real-time validation on blur
- Clear error messages under fields
- Form-level validation on submit
- Prevents submission until all errors resolved

### 4. Form Submissions Management
**Complete submission tracking and management**
- **Location**: `/components/FormSubmissionsDialog.tsx`, `/hooks/useFormSubmissions.ts`
- **Access**: Toolbar > "Form Data" button

**Features**:
- View all submissions with timestamps
- Filter by form type
- Search across submission data
- Individual submission detail view
- Delete individual or all submissions
- Export to CSV for analysis
- Submission count badges
- User agent tracking

**Data Storage**:
- Local storage (browser-based)
- Persistent across sessions
- No server required for demo
- Ready for backend integration

### 5. Form Rendering
**Dynamic form rendering** based on configuration
- **Location**: `/components/FormRenderer.tsx`

**Capabilities**:
- Renders any form configuration
- Responsive layout (full/half width fields)
- Loading states during submission
- Success/error message display
- Auto-redirect after submission (optional)
- Submission callbacks for custom logic

## Integration with Components

### Form Components

The builder includes three main form component types:

1. **Contact Form** (`contact-form`)
   - General purpose contact/inquiry form
   - Configure via Form tab in Property Inspector

2. **Newsletter Signup** (`newsletter`)
   - Email collection
   - Can be simple (just email) or comprehensive (with preferences)

3. **Table Reservations** (`reservations`)
   - Booking system for restaurant tables
   - Includes date/time, party size, special requests

### Adding Forms to Canvas

1. Drag form component from Component Library > Interactive
2. Component appears on canvas with placeholder
3. Click component to select
4. Open Property Inspector > Form tab
5. Click "Create Form" or choose template
6. Configure fields, settings, and validation
7. Save form configuration

### Form Configuration Flow

```
Component on Canvas (empty)
    ↓
Property Inspector > Form Tab
    ↓
Form Builder Dialog
    ↓
    ├── Fields Tab: Add/edit/reorder fields
    ├── Settings Tab: Configure form behavior
    └── Templates Tab: Apply pre-built template
    ↓
Save Configuration
    ↓
FormRenderer displays on canvas
```

## Technical Architecture

### Data Flow

```
User fills form → FormRenderer
                      ↓
                 Validation (formValidation.ts)
                      ↓
                  [Valid?]
                   ↙    ↘
                 Yes     No
                  ↓      ↓
           Submit    Show Errors
                ↓
       useFormSubmissions hook
                ↓
        localStorage save
                ↓
         Success Message
                ↓
        [Optional Redirect]
```

### Type System

**FormConfig**: Complete form definition
```typescript
{
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
  storeSubmissions?: boolean;
}
```

**FormField**: Individual field configuration
```typescript
{
  id: string;
  label: string;
  type: FormFieldType;
  placeholder?: string;
  required?: boolean;
  validation?: ValidationRule[];
  options?: string[];  // For select/radio/checkbox
  width?: 'full' | 'half';
  helpText?: string;
}
```

**FormSubmission**: Stored submission data
```typescript
{
  id: string;
  formId: string;
  formName: string;
  data: Record<string, any>;
  submittedAt: number;
  userAgent?: string;
}
```

## Usage Examples

### Example 1: Create Contact Form from Template

```typescript
// User workflow:
1. Drag "Contact Form" component to canvas
2. Select component
3. Click Form tab in Property Inspector
4. Click "Create Form"
5. Switch to Templates tab
6. Click "Contact Form" template
7. (Optional) Customize fields in Fields tab
8. Configure email in Settings tab
9. Click "Save Form"
```

### Example 2: Build Custom Form from Scratch

```typescript
// Building a custom feedback form:
1. Start with empty form component
2. Open Form Builder
3. Add fields:
   - Text: "Name" (optional)
   - Email: "Email" (optional, validated)
   - Radio: "Rating" (required, options: 1-5 stars)
   - Textarea: "Comments" (required, min 20 chars)
4. Settings:
   - Submit button: "Send Feedback"
   - Success: "Thank you for your feedback!"
   - Store: true
   - Email: true, to: owner@restaurant.com
5. Save
```

### Example 3: Export Submission Data

```typescript
// Restaurant owner workflow:
1. Click "Form Data" in toolbar
2. Select specific form from dropdown (or "All Forms")
3. Review submissions
4. Click "Export CSV"
5. CSV downloads with all submission data
6. Open in Excel/Sheets for analysis
```

## Validation Examples

### Email Validation
```typescript
{
  type: 'email',
  message: 'Please enter a valid email address'
}
// Validates: user@example.com ✓
// Rejects: invalid-email ✗
```

### Phone Validation
```typescript
{
  type: 'phone',
  message: 'Please enter a valid phone number'
}
// Accepts: (555) 123-4567, 555-123-4567, 5551234567
// Validates 10-15 digits
```

### Required Field
```typescript
{
  type: 'required',
  message: 'This field is required'
}
```

### Minimum Length
```typescript
{
  type: 'minLength',
  value: 10,
  message: 'Message must be at least 10 characters'
}
```

## Best Practices

### 1. Form Design
- **Keep it short**: Only ask for essential information
- **Clear labels**: Use descriptive field labels
- **Help text**: Add hints for complex fields
- **Logical order**: Group related fields together
- **Required indicators**: Mark required fields clearly

### 2. Validation
- **Client-side first**: Validate before submission
- **User-friendly messages**: Clear, actionable error text
- **Progressive disclosure**: Show errors after user interaction
- **Real-time feedback**: Validate on blur for immediate feedback

### 3. Success Messages
- **Confirmation**: Clearly state what happens next
- **Set expectations**: Tell users when to expect a response
- **Thank users**: Show appreciation for their submission
- **Next steps**: Provide clear guidance on what to do next

### 4. Data Management
- **Regular exports**: Download submission data regularly
- **Privacy compliance**: Don't collect unnecessary data
- **Clear storage**: Delete old submissions periodically
- **Backup data**: Export before clearing submissions

### 5. Mobile Optimization
- **Touch-friendly**: Large input fields (min 44px height)
- **Appropriate keyboards**: Use correct input types (email, tel, number)
- **Single column**: Stack fields vertically on mobile
- **Clear buttons**: Large, easy-to-tap submit buttons

## Server Integration (Future)

The current implementation uses localStorage for demonstration. For production:

### Backend Requirements
1. **API endpoint** for form submissions
2. **Email service** integration (SendGrid, AWS SES, etc.)
3. **Database** for persistent storage
4. **Security**: CSRF protection, rate limiting, spam prevention

### Example Integration
```typescript
// In FormRenderer, replace localStorage save with API call:
const response = await fetch('/api/forms/submit', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    formId: config.id,
    formName: config.name,
    data: formData,
  }),
});

if (response.ok) {
  // Show success
} else {
  // Show error
}
```

## Accessibility

### Form Accessibility Features
- **Labels**: All fields have associated labels
- **ARIA attributes**: Proper roles and states
- **Error announcements**: Screen reader compatible error messages
- **Keyboard navigation**: Full keyboard support (Tab, Enter, Esc)
- **Focus management**: Clear focus indicators
- **Required indicators**: Both visual and programmatic

### Testing Checklist
- [ ] All fields keyboard accessible
- [ ] Labels properly associated with inputs
- [ ] Error messages announced to screen readers
- [ ] Form can be completed without mouse
- [ ] Focus order is logical
- [ ] Required fields marked programmatically

## Troubleshooting

### Common Issues

**Problem**: Form not saving
- **Solution**: Check browser localStorage quota, clear old data

**Problem**: Validation not working
- **Solution**: Ensure validation rules match field type

**Problem**: Submissions not appearing
- **Solution**: Verify storeSubmissions is enabled in form config

**Problem**: Email field showing errors for valid emails
- **Solution**: Check email regex pattern in formValidation.ts

**Problem**: Form not rendering on canvas
- **Solution**: Ensure formConfig is properly saved to component

## Performance Considerations

### Optimization Tips
1. **Lazy load forms**: Only render when visible
2. **Debounce validation**: Don't validate on every keystroke
3. **Limit submissions display**: Paginate large submission lists
4. **CSV export chunking**: For large datasets, export in chunks
5. **IndexedDB for scale**: Migrate from localStorage for >100 submissions

### Limits
- localStorage: ~5-10MB per domain
- Recommended max submissions: 1000
- Max fields per form: 50 (for UX)
- Max form size: No technical limit, but keep UX in mind

## Future Enhancements

Potential additions for future versions:
- [ ] File upload support
- [ ] Multi-step forms (wizard)
- [ ] Conditional field logic
- [ ] Form analytics (completion rate, drop-off points)
- [ ] A/B testing different form versions
- [ ] Integration with CRM systems
- [ ] Auto-save drafts
- [ ] Email templates for submissions
- [ ] SMS notifications
- [ ] reCAPTCHA spam protection
- [ ] Payment integration for deposits
- [ ] Calendar integration for reservations
- [ ] PDF generation of submissions

## Security Considerations

### Current Implementation (Demo)
- Client-side only
- No sensitive data encryption
- localStorage is accessible to scripts

### Production Recommendations
1. **HTTPS only**: Encrypt data in transit
2. **Input sanitization**: Clean all user input
3. **CSRF tokens**: Prevent cross-site attacks
4. **Rate limiting**: Prevent spam/abuse
5. **Data encryption**: Encrypt sensitive data at rest
6. **Privacy policy**: Inform users about data collection
7. **GDPR compliance**: Handle data requests properly
8. **No PII without consent**: Don't collect unnecessary personal data

## Conclusion

The Data & Forms system provides a complete, user-friendly solution for restaurant owners to collect and manage customer data. With pre-built templates, comprehensive validation, and easy data export, it handles the most common use cases while remaining flexible enough for custom requirements.

The system is production-ready for frontend demonstration and can be easily extended with backend integration for real-world deployment.
