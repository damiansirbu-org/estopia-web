# Frontend Frameworks and Technologies Documentation

## Overview

This document outlines the modern frontend frameworks and libraries used in our enterprise React application, focusing on validation, form management, and type safety patterns.

## Core Technology Stack

### ⚛️ **React 18**
- **Purpose**: Component-based UI library
- **Version**: 18.x (latest stable)
- **Key Features**: Hooks, Concurrent rendering, Automatic batching
- **Usage**: Primary UI framework for all components

### 📘 **TypeScript**
- **Purpose**: Type safety and developer experience
- **Version**: 5.x
- **Integration**: Full type coverage across validation, forms, and API calls
- **Benefits**: Compile-time error detection, IntelliSense, refactoring safety

## Validation Framework: Zod

### 🛡️ **What is Zod?**
Zod is a TypeScript-first schema validation library that provides:
- **Runtime validation** with compile-time type inference
- **Schema composition** for complex validation logic
- **Custom refinements** for business-specific rules
- **Error handling** with detailed validation messages

### 🎯 **Why Zod Over Alternatives?**

**Zod vs Yup**:
- ✅ **Better TypeScript integration** - automatic type inference
- ✅ **Smaller bundle size** and better performance
- ✅ **More intuitive API** with method chaining
- ✅ **Built-in async validation** support

**Zod vs Joi**:
- ✅ **Browser-native** - no Node.js dependencies
- ✅ **TypeScript-first design** vs JavaScript with types added
- ✅ **Better React ecosystem integration**

**Zod vs PropTypes**:
- ✅ **Runtime + compile-time validation** vs runtime only
- ✅ **Schema reusability** across components
- ✅ **Advanced validation patterns** (custom refinements, transforms)

### 🔧 **Zod Implementation Patterns**

#### Basic Schema Definition
```typescript
import { z } from 'zod';

const userSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  age: z.number().min(18).max(120)
});

type User = z.infer<typeof userSchema>; // Automatic TypeScript type generation
```

#### Romanian-Specific Validation
```typescript
const ROMANIAN_PHONE_PATTERN = /^(\+40|0040|40)?\s?[72][0-9]{8}$/;
const CNP_PATTERN = /^[1-9][0-9]{12}$/;

const romanianClientSchema = z.object({
  name: z.string()
    .min(2, 'validation.client.name.size')
    .regex(/^[a-zA-ZăâîșțĂÂÎȘȚ\s\-']+$/, 'validation.client.name.format'),
  
  nationalId: z.string()
    .regex(CNP_PATTERN, 'validation.client.nationalId.format')
    .refine(validateCNPChecksum, 'validation.client.nationalId.checksum'),
  
  phoneNumber: z.string()
    .regex(ROMANIAN_PHONE_PATTERN, 'validation.client.phoneNumber.format')
});
```

#### Advanced Schema Composition
```typescript
const baseClientSchema = z.object({
  name: z.string().min(2),
  email: z.string().email()
});

const createClientSchema = baseClientSchema.extend({
  password: z.string().min(8)
});

const updateClientSchema = baseClientSchema.partial().extend({
  id: z.number()
});
```

#### Custom Refinements for Business Logic
```typescript
const contractSchema = z.object({
  startDate: z.string(),
  endDate: z.string(),
  rentAmount: z.number().min(1)
}).refine((data) => {
  // Romanian legal compliance: maximum 49 years contract duration
  const start = new Date(data.startDate);
  const end = new Date(data.endDate);
  const yearsDiff = end.getFullYear() - start.getFullYear();
  return yearsDiff <= 49;
}, {
  message: 'validation.contract.duration.max49Years',
  path: ['endDate']
}).refine((data) => {
  // Cross-field validation: endDate must be after startDate
  return new Date(data.endDate) > new Date(data.startDate);
}, {
  message: 'validation.contract.endDate.afterStart',
  path: ['endDate']
});
```

## Form Management: React Hook Form

### 🎣 **What is React Hook Form?**
React Hook Form is a performant, flexible forms library that provides:
- **Minimal re-renders** for better performance
- **Built-in validation** with schema integration
- **Uncontrolled components** by default for optimal performance
- **Easy integration** with UI libraries and validation schemas

### 🚀 **Why React Hook Form Over Alternatives?**

**React Hook Form vs Formik**:
- ✅ **Better performance** - fewer re-renders (1-2 vs 10+ re-renders)
- ✅ **Smaller bundle size** (~25KB vs ~45KB)
- ✅ **Simpler API** - less boilerplate code
- ✅ **Better TypeScript support** with schema integration

**React Hook Form vs React Final Form**:
- ✅ **Built-in validation integration** with Zod/Yup
- ✅ **Better developer experience** with hooks-based API
- ✅ **More active community** and ecosystem

### 🔧 **React Hook Form Implementation Patterns**

#### Basic Form Setup
```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createClientSchema, CreateClientInput } from '../validation/schemas';

function ClientForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError
  } = useForm<CreateClientInput>({
    resolver: zodResolver(createClientSchema),
    mode: 'onBlur' // Validate on blur for better UX
  });

  const onSubmit = async (data: CreateClientInput) => {
    try {
      await createClient(data);
    } catch (error) {
      // Handle server validation errors
      if (error.field === 'nationalId') {
        setError('nationalId', { 
          type: 'server', 
          message: 'CNP already exists' 
        });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register('name')}
        placeholder="Full Name"
      />
      {errors.name && <span>{errors.name.message}</span>}
      
      <input
        {...register('nationalId')}
        placeholder="CNP"
      />
      {errors.nationalId && <span>{errors.nationalId.message}</span>}
      
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Creating...' : 'Create Client'}
      </button>
    </form>
  );
}
```

#### Advanced Form Patterns
```typescript
// Watch field values for dynamic validation
const watchedValues = watch(['startDate', 'endDate']);

// Conditional validation
const conditionalSchema = z.object({
  hasDeposit: z.boolean(),
  depositAmount: z.number().optional()
}).refine((data) => {
  // If hasDeposit is true, depositAmount is required
  if (data.hasDeposit && !data.depositAmount) {
    return false;
  }
  return true;
}, {
  message: 'Deposit amount is required when deposit is selected',
  path: ['depositAmount']
});

// Field arrays for dynamic forms
const { fields, append, remove } = useFieldArray({
  control,
  name: 'payments'
});
```

### 🔗 **Integration Patterns**

#### Zod + React Hook Form Integration
```typescript
import { zodResolver } from '@hookform/resolvers/zod';

const form = useForm<FormData>({
  resolver: zodResolver(validationSchema),
  defaultValues: {
    name: '',
    email: '',
    nationalId: ''
  }
});
```

#### Error Handling with i18n
```typescript
// Custom error resolver for localized messages
function createLocalizedResolver<T>(schema: ZodSchema<T>) {
  return async (data: T) => {
    try {
      const validData = await schema.parseAsync(data);
      return { values: validData, errors: {} };
    } catch (error) {
      if (error instanceof ZodError) {
        const currentLang = getCurrentLanguage();
        const errors = error.errors.reduce((acc, err) => {
          const path = err.path.join('.');
          acc[path] = {
            type: 'validation',
            message: t(err.message, currentLang) || err.message
          };
          return acc;
        }, {} as Record<string, any>);
        
        return { values: {}, errors };
      }
      throw error;
    }
  };
}
```

## Validation Utilities and Helpers

### 🛠️ **Custom Validation Functions**

#### Romanian CNP Validation
```typescript
export function validateCNPChecksum(cnp: string): boolean {
  if (!cnp || cnp.length !== 13) return false;
  
  const weights = [2, 7, 9, 1, 4, 6, 3, 5, 8, 2, 7, 9];
  let sum = 0;
  
  for (let i = 0; i < 12; i++) {
    const digit = parseInt(cnp.charAt(i), 10);
    if (isNaN(digit)) return false;
    sum += digit * weights[i];
  }
  
  const remainder = sum % 11;
  const checksum = remainder < 10 ? remainder : 1;
  const lastDigit = parseInt(cnp.charAt(12), 10);
  
  return checksum === lastDigit;
}
```

#### Debounced Validation
```typescript
export function createDebouncedValidator<T>(
  schema: ZodSchema<T>,
  delay: number = 300
) {
  let timeoutId: NodeJS.Timeout;
  
  return (data: unknown, callback: (errors: ValidationError[]) => void): void => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      const result = validateWithSchema(schema, data);
      callback(result.errors);
    }, delay);
  };
}
```

### 🎨 **UI Integration Patterns**

#### Form Field Component
```typescript
interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}

function FormField({ label, error, required, children }: FormFieldProps) {
  return (
    <div className="form-field">
      <label className={`form-label ${required ? 'required' : ''}`}>
        {label}
      </label>
      {children}
      {error && (
        <div className="form-error" role="alert">
          {error}
        </div>
      )}
    </div>
  );
}
```

#### Validation State Indicator
```typescript
function ValidationIndicator({ isValid, isValidating, error }: FieldValidationState) {
  if (isValidating) {
    return <span className="validation-spinner">⏳</span>;
  }
  
  if (error) {
    return <span className="validation-error">❌</span>;
  }
  
  if (isValid) {
    return <span className="validation-success">✅</span>;
  }
  
  return null;
}
```

## Performance Considerations

### ⚡ **Optimization Strategies**

#### Schema Memoization
```typescript
// Memoize schemas to prevent recreation on every render
const clientSchema = useMemo(() => createClientSchema(), []);

// Or use module-level schemas
import { clientSchema } from '../validation/schemas';
```

#### Selective Re-renders
```typescript
// Use React.memo for form components that shouldn't re-render
const FormField = React.memo(({ label, error, children }) => {
  return (
    <div className="form-field">
      <label>{label}</label>
      {children}
      {error && <div className="error">{error}</div>}
    </div>
  );
});
```

#### Debounced Validation
```typescript
// Prevent excessive validation calls during typing
const debouncedValidate = useMemo(
  () => debounce((value: string) => {
    trigger('fieldName'); // React Hook Form trigger validation
  }, 300),
  [trigger]
);
```

## Testing Strategies

### 🧪 **Schema Testing**
```typescript
describe('Client Validation Schema', () => {
  it('should validate valid Romanian CNP', () => {
    const validData = {
      name: 'Ion Popescu',
      nationalId: '1234567890123', // Valid CNP with correct checksum
      phoneNumber: '+40722123456',
      email: 'ion@example.com',
      address: 'Str. Victoriei nr. 15, București, 010064'
    };

    const result = createClientSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should reject invalid CNP checksum', () => {
    const invalidData = {
      nationalId: '1234567890124' // Invalid checksum
    };

    const result = createClientSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    expect(result.error?.errors[0].message).toBe('validation.client.nationalId.checksum');
  });
});
```

### 🎭 **Form Testing**
```typescript
describe('Client Form', () => {
  it('should display validation errors on invalid submission', async () => {
    render(<ClientForm />);
    
    const submitButton = screen.getByText('Create Client');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Name is required')).toBeInTheDocument();
      expect(screen.getByText('CNP is required')).toBeInTheDocument();
    });
  });

  it('should submit valid form data', async () => {
    const mockSubmit = jest.fn();
    render(<ClientForm onSubmit={mockSubmit} />);
    
    fireEvent.change(screen.getByPlaceholderText('Full Name'), {
      target: { value: 'Ion Popescu' }
    });
    fireEvent.change(screen.getByPlaceholderText('CNP'), {
      target: { value: '1234567890123' }
    });
    
    fireEvent.click(screen.getByText('Create Client'));
    
    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({
        name: 'Ion Popescu',
        nationalId: '1234567890123'
      });
    });
  });
});
```

## Migration and Adoption Guidelines

### 📈 **Gradual Migration Strategy**

1. **Phase 1**: Install Zod and React Hook Form
2. **Phase 2**: Create validation schemas for new forms
3. **Phase 3**: Migrate existing forms one at a time
4. **Phase 4**: Add advanced validation features (debouncing, cross-field validation)
5. **Phase 5**: Optimize performance and add comprehensive tests

### 🎯 **Best Practices**

#### ✅ **Do's**
- **Use TypeScript** for full type safety
- **Memoize schemas** to prevent unnecessary recreations
- **Validate on blur** rather than onChange for better UX
- **Provide clear error messages** with internationalization
- **Test validation logic** thoroughly with edge cases
- **Use debouncing** for expensive validations

#### ❌ **Don'ts**
- **Don't validate on every keystroke** (performance impact)
- **Don't trust client-side validation** for security
- **Don't create overly complex schemas** (split into smaller ones)
- **Don't forget accessibility** (proper error announcements)
- **Don't skip server-side validation** sync

## Integration with Backend

### 🔄 **Error Handling Patterns**

#### Server Validation Error Integration
```typescript
// Handle server-side validation errors
const handleServerErrors = (serverErrors: ApiValidationError[]) => {
  serverErrors.forEach(error => {
    setError(error.field as keyof FormData, {
      type: 'server',
      message: t(error.messageKey, getCurrentLanguage())
    });
  });
};

// API call with error handling
const onSubmit = async (data: FormData) => {
  try {
    await api.createClient(data);
  } catch (error) {
    if (error.validationErrors) {
      handleServerErrors(error.validationErrors);
    }
  }
};
```

This comprehensive framework integration ensures type-safe, performant, and user-friendly form validation throughout our enterprise application.