# Estopia Web - Development Standards

## UI/UX Standards

### Message Display Standards
- **STD-MSG-001**: **NO popup messages or inline screen notifications allowed**
- **STD-MSG-002**: **ALL messages must be directed to the terminal panel at the bottom**
- **STD-MSG-003**: **For validation errors**: Only mark the field as invalid (red border), but error message appears in terminal
- **STD-MSG-004**: Terminal messages must include operation context (e.g., "Contract validation failed", "Client created successfully")
- **STD-MSG-005**: Use semantic message types: success, error, warning, info

### Validation Standards
- **STD-VAL-001**: Field validation errors display visually on the field (red border, error state)
- **STD-VAL-002**: Detailed validation messages appear only in terminal panel
- **STD-VAL-003**: Validation happens in real-time but messages are batched to terminal
- **STD-VAL-004**: Form fields must show visual invalid state without blocking user interaction
- **STD-VAL-005**: No tooltip or inline error text allowed on form fields

### Terminal Panel Standards
- **STD-TERM-001**: Terminal panel is the ONLY location for user feedback messages
- **STD-TERM-002**: Terminal messages must be clear, actionable, and contextual
- **STD-TERM-003**: Terminal supports message history and scrolling
- **STD-TERM-004**: Terminal messages include timestamps for user reference
- **STD-TERM-005**: Terminal can be cleared by user action
- **STD-TERM-006**: Terminal messages support copy functionality for debugging

## Code Architecture Standards

### Generic System Standards
- **STD-GEN-001**: Use generic EntityList component for all entity types
- **STD-GEN-002**: Entity configurations must be type-safe with full TypeScript support
- **STD-GEN-003**: All entity operations follow consistent patterns (CRUD + validation)
- **STD-GEN-004**: Custom renderers must be configurable per field type
- **STD-GEN-005**: No hardcoded entity-specific logic in generic components

### Component Standards
- **STD-COMP-001**: Functional components with hooks pattern only
- **STD-COMP-002**: Props must be fully typed with TypeScript interfaces
- **STD-COMP-003**: Component state management through hooks (useState, useEffect)
- **STD-COMP-004**: Custom hooks for reusable logic extraction
- **STD-COMP-005**: Context usage only for truly global state (theme, terminal, errors)

### TypeScript Standards
- **STD-TS-001**: Strict TypeScript mode must be enabled
- **STD-TS-002**: No `any` types allowed except in very specific cases with eslint-disable comment
- **STD-TS-003**: All interfaces and types must be properly exported and documented
- **STD-TS-004**: Generic types must be properly constrained with extends
- **STD-TS-005**: Union types preferred over enums for string constants

## Data Management Standards

### API Integration Standards
- **STD-API-001**: All API calls go through service layer (no direct axios in components)
- **STD-API-002**: Error handling must route to terminal display system
- **STD-API-003**: Loading states must be managed consistently across all operations
- **STD-API-004**: API responses must be typed with proper interfaces
- **STD-API-005**: No API calls during render phase (use useEffect hooks)

### State Management Standards
- **STD-STATE-001**: Local component state for component-specific data
- **STD-STATE-002**: Context for global application state only
- **STD-STATE-003**: No external state management libraries (Redux, Zustand) unless absolutely necessary
- **STD-STATE-004**: State updates must be immutable
- **STD-STATE-005**: Complex state logic extracted to custom hooks

### Form Management Standards
- **STD-FORM-001**: Use Ant Design Form component for all forms
- **STD-FORM-002**: Form validation integrated with terminal message system
- **STD-FORM-003**: Form refs must be properly typed and managed
- **STD-FORM-004**: Form field changes tracked for "dirty" state management
- **STD-FORM-005**: Form submission prevents multiple concurrent submissions

## Styling and UI Standards

### Ant Design Standards
- **STD-ANTD-001**: Use Ant Design components as primary UI library
- **STD-ANTD-002**: Consistent sizing: small, middle, large across similar components
- **STD-ANTD-003**: Theme customization through ConfigProvider only
- **STD-ANTD-004**: No direct CSS overrides of Ant Design styles
- **STD-ANTD-005**: Custom styling through theme tokens and design system

### Layout Standards
- **STD-LAYOUT-001**: Responsive design with mobile-first approach
- **STD-LAYOUT-002**: Consistent spacing using theme tokens
- **STD-LAYOUT-003**: Grid system for layout management
- **STD-LAYOUT-004**: Header navigation with consistent tab structure
- **STD-LAYOUT-005**: Terminal panel always visible at bottom

### Responsive Design Standards (ADR-RESP-001)
- **STD-RESP-001**: **NO hardcoded pixel values allowed** - Use relative units (%, em, rem, vh, vw) or design tokens
- **STD-RESP-002**: **Spacing must be proportional** - Use percentage-based margins/padding or design token multipliers
- **STD-RESP-003**: **Design tokens preferred** - Use theme tokens that can scale proportionally across devices
- **STD-RESP-004**: **Viewport-relative units** for container sizing (vh, vw, vmin, vmax)
- **STD-RESP-005**: **Flexbox and Grid** for responsive layouts instead of fixed positioning
- **STD-RESP-006**: **Media queries** when absolute breakpoints are necessary
- **STD-RESP-007**: **Container queries** preferred over media queries when available
- **STD-RESP-008**: **Minimum touch targets** of 44px (2.75rem) for mobile accessibility

### Visual Feedback Standards
- **STD-VIS-001**: Loading states must be consistent (Spin component)
- **STD-VIS-002**: Interactive elements must have hover and focus states
- **STD-VIS-003**: Color usage must follow semantic meaning (red=error, green=success)
- **STD-VIS-004**: Icons used consistently from Lucide React library
- **STD-VIS-005**: Animation usage minimal and purposeful

## Code Quality Standards

### File Organization Standards
- **STD-FILE-001**: Feature-based folder structure over type-based
- **STD-FILE-002**: Index files for clean imports where appropriate
- **STD-FILE-003**: Consistent naming: PascalCase for components, camelCase for utilities
- **STD-FILE-004**: One default export per file for components
- **STD-FILE-005**: Types and interfaces in separate files when shared

### Import Standards
- **STD-IMP-001**: Absolute imports for src/ paths using Vite configuration
- **STD-IMP-002**: Group imports: React imports, third-party, local imports
- **STD-IMP-003**: Import only what is needed (no default import for utils)
- **STD-IMP-004**: Type-only imports marked with `import type`
- **STD-IMP-005**: No circular dependencies allowed

### Performance Standards
- **STD-PERF-001**: Use React.memo for components with expensive renders
- **STD-PERF-002**: useMemo and useCallback for expensive computations and stable references
- **STD-PERF-003**: Lazy loading for routes and heavy components
- **STD-PERF-004**: Bundle size monitoring and optimization
- **STD-PERF-005**: Avoid unnecessary re-renders through proper dependency arrays

## Development Workflow Standards

### Build Standards
- **STD-BUILD-001**: Vite as build tool and development server
- **STD-BUILD-002**: TypeScript compilation must pass with zero errors
- **STD-BUILD-003**: ESLint must pass with configured rules
- **STD-BUILD-004**: Build output must be optimized for production
- **STD-BUILD-005**: Environment variables properly configured for different environments
- **STD-BUILD-006**: **MANDATORY**: After ANY code changes, run `./estopia-web.sh clean fix build` and fix all errors/warnings before proceeding

### Framework Decision Standards (ADR-FRAMEWORK-001)
- **STD-FRAMEWORK-001**: **MANDATORY**: ALWAYS consult official documentation (updated 2025) before implementing any framework features
- **STD-FRAMEWORK-002**: **Multi-source verification required** - Use minimum 3 independent sources for technical decisions
- **STD-FRAMEWORK-003**: **Official docs first** - Always check framework's official documentation before Stack Overflow or other sources
- **STD-FRAMEWORK-004**: **Version compatibility** - Verify all solutions work with current framework versions in use
- **STD-FRAMEWORK-005**: **Best practices enforcement** - Follow officially recommended patterns and avoid deprecated approaches

### Testing Standards (Future)
- **STD-TEST-001**: Unit tests for complex utility functions
- **STD-TEST-002**: Component testing for critical user flows
- **STD-TEST-003**: Integration tests for API service layer
- **STD-TEST-004**: Test coverage monitoring and reporting
- **STD-TEST-005**: End-to-end testing for complete user workflows

### Documentation Standards
- **STD-DOC-001**: README with setup and development instructions
- **STD-DOC-002**: Architecture documentation with diagrams
- **STD-DOC-003**: Code comments for complex business logic only
- **STD-DOC-004**: API integration documentation
- **STD-DOC-005**: Deployment and environment setup documentation

## Error Handling Standards

### Exception Management
- **STD-ERR-001**: All errors caught and routed to terminal display
- **STD-ERR-002**: Network errors handled gracefully with retry mechanisms
- **STD-ERR-003**: Validation errors processed and displayed appropriately
- **STD-ERR-004**: Development vs production error detail levels
- **STD-ERR-005**: Error logging for debugging and monitoring

### User Experience Error Standards
- **STD-UX-ERR-001**: Users never see raw error objects or stack traces
- **STD-UX-ERR-002**: Error messages are actionable and user-friendly
- **STD-UX-ERR-003**: System remains usable even when individual operations fail
- **STD-UX-ERR-004**: Error recovery mechanisms provided where possible
- **STD-UX-ERR-005**: Critical errors prevent dangerous user actions

## Security Standards

### Frontend Security
- **STD-SEC-001**: No sensitive data stored in localStorage or sessionStorage
- **STD-SEC-002**: API keys and configuration in environment variables
- **STD-SEC-003**: Input sanitization before display (XSS prevention)
- **STD-SEC-004**: HTTPS enforcement in production
- **STD-SEC-005**: Content Security Policy implementation

### Data Handling Security
- **STD-DATA-SEC-001**: No sensitive data in browser console logs
- **STD-DATA-SEC-002**: Proper error message sanitization
- **STD-DATA-SEC-003**: Client-side validation as UX enhancement only
- **STD-DATA-SEC-004**: Token-based authentication integration ready
- **STD-DATA-SEC-005**: Role-based UI element visibility (future)