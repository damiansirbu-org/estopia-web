# Estopia Web - Development TODOs & Action Items

## 🔥 **CRITICAL OUTSTANDING ISSUES (From Previous Sessions)**

### Backend Validation Issues
- [ ] **CRITICAL: Payment Entity Validation Problems** (Outstanding from 2025-07-31)
  - [ ] Check PaymentValidationService.buildValidator() implementation
  - [ ] Verify all message keys exist in messages_ro.properties for Payment entity
  - [ ] Test Payment CRUD operations thoroughly
  - [ ] Check if Payment has clientId/contractId fields that need null vs zero fix
  - [ ] Verify Payment entity field mappings for error highlighting
  - [ ] Check PaymentList.tsx for similar help message removal needs

### Service Layer Validation 
- [ ] **HIGH PRIORITY: Implement CNP Uniqueness Validation in Service Layer**
  - [ ] Add uniqueness validation to ClientValidationService 
  - [ ] Check if national_id already exists in database before save
  - [ ] Return proper YAVI validation error with Romanian localized message
  - [ ] Integration: Add to existing YAVI validation chain in ClientService.createClient()
  - [ ] Expected behavior: Terminal message "CNP: CNP-ul există deja în sistem"

### Cross-Project Backend Issues
- [ ] **Investigate YAVI Localization**: Ensure all entities show Romanian messages consistently
- [ ] **Database Constraint Handling**: Proper error messages for all unique constraints
- [ ] **Null vs Zero Handling**: Verify all foreign key fields send null instead of 0

### Architecture Standards Compliance (From ADRs)
- [ ] **STD-MSG-001**: Verify terminal-only messaging is enforced across all components
- [ ] **Generic Entity System**: Ensure all entities use the generic EntityList pattern
- [ ] **YAVI Validation**: Complete migration from Bean Validation to YAVI framework
- [ ] **Dynamic Validator Building**: Ensure thread-safe localized validator creation

## 🚀 **PRIORITY 1: CRITICAL FIXES**

### Framework & Styling Consistency
- [ ] **Unify Styling Approach**: Eliminate mixed Tailwind + inline styles throughout the application
  - [ ] Replace inline styles in `App.tsx` with Tailwind utilities
  - [ ] Convert complex inline styles to custom Tailwind components
  - [ ] Establish single styling methodology (Tailwind-first approach)

### Design Token System Implementation
- [ ] **Integrate Design Tokens with Tailwind**: Extend `tailwind.config.js` with existing design tokens
  - [ ] Add custom colors from `tokens.ts` to Tailwind theme
  - [ ] Create utility classes for state colors (save, delete, add)
  - [ ] Implement spacing scale from design tokens
  - [ ] Add typography system to Tailwind config

### Magic Numbers Elimination
- [ ] **Replace Hardcoded Values**: Convert all magic numbers to named constants
  - [ ] Create constants for viewport heights (`23.5vh`, `22vh`)
  - [ ] Replace hardcoded colors (`#fefce8`, `#fef2f2`, `#f0f9ff`) with design tokens
  - [ ] Define layout constants in theme configuration
  - [ ] Update `TerminalPanel` and `App.tsx` with proper constants

## 🔧 **PRIORITY 2: PERFORMANCE OPTIMIZATION**

### Component Optimization
- [ ] **Optimize EntityList Component**: Reduce complexity and improve performance
  - [ ] Split 576-line `EntityList.tsx` into smaller sub-components
  - [ ] Extract row rendering logic to separate components
  - [ ] Reduce `useCallback` dependencies in change detection
  - [ ] Implement `React.memo` for table rows to prevent unnecessary re-renders

### Code Splitting Implementation
- [ ] **Implement Lazy Loading**: Add code splitting for better performance
  - [ ] Convert page components to lazy-loaded components
  - [ ] Implement `React.Suspense` with loading states
  - [ ] Add dynamic imports for non-critical components
  - [ ] Optimize bundle size with proper chunking

### Virtualization (Future Enhancement)
- [ ] **Table Virtualization**: For large datasets (when needed)
  - [ ] Research React virtualization libraries
  - [ ] Implement virtual scrolling for tables with 1000+ rows
  - [ ] Add pagination controls as fallback

## 🎯 **PRIORITY 3: MODERN FRAMEWORK INTEGRATION**

### Tailwind CSS Enhancement
- [ ] **Advanced Tailwind Configuration**: Leverage full Tailwind potential
  - [ ] Create custom utility classes for common patterns
  - [ ] Implement component variants system
  - [ ] Add responsive design improvements
  - [ ] Configure Tailwind JIT mode optimizations

### React 19 Features (Optional)
- [ ] **Modern React Hooks**: Consider upgrading to React 19 features
  - [ ] Evaluate `useActionState` for form handling
  - [ ] Implement `useOptimistic` for optimistic updates
  - [ ] Research `use` API for data fetching improvements

### Ant Design Integration
- [ ] **Enhanced Ant Design Integration**: Better theme customization
  - [ ] Integrate design tokens with Ant Design theme system
  - [ ] Customize Ant Design components with brand colors
  - [ ] Implement consistent component sizing across the app

## 📋 **PRIORITY 4: CODE QUALITY & MAINTENANCE**

### Component Architecture
- [ ] **Component Refactoring**: Improve component structure
  - [ ] Extract reusable UI components from EntityList
  - [ ] Create proper component hierarchy
  - [ ] Implement consistent prop interfaces
  - [ ] Add proper component documentation

### Error Handling Enhancement
- [ ] **Improve Error Handling**: Enhance user experience
  - [ ] Add error boundaries for component-level error handling
  - [ ] Implement retry mechanisms for failed API calls
  - [ ] Add proper loading states throughout the application
  - [ ] Enhance terminal error messaging

### Testing Implementation
- [ ] **Add Testing Suite**: Ensure code reliability
  - [ ] Set up Jest and React Testing Library
  - [ ] Add unit tests for utility functions
  - [ ] Implement component testing for EntityList
  - [ ] Add integration tests for CRUD operations
  - [ ] Set up end-to-end testing with Playwright

## 🛠️ **PRIORITY 5: DEVELOPER EXPERIENCE**

### Documentation
- [ ] **Improve Documentation**: Better developer onboarding
  - [ ] Document component props and usage
  - [ ] Create style guide for the application
  - [ ] Add architecture decision records (ADRs)
  - [ ] Document the generic entity system

### Development Tools
- [ ] **Enhanced Development Setup**: Improve DX
  - [ ] Add more detailed ESLint rules
  - [ ] Implement Prettier for code formatting
  - [ ] Add pre-commit hooks for code quality
  - [ ] Set up Storybook for component development

### Build & Deployment
- [ ] **Optimize Build Process**: Improve deployment
  - [ ] Implement bundle analysis
  - [ ] Add build performance monitoring
  - [ ] Set up environment-specific configurations
  - [ ] Implement proper error tracking

## 🚦 **FUTURE ENHANCEMENTS (LOW PRIORITY)**

### Advanced Features
- [ ] **Accessibility Improvements**: WCAG compliance
  - [ ] Add proper ARIA labels and roles
  - [ ] Implement keyboard navigation improvements
  - [ ] Add screen reader support
  - [ ] Test with accessibility tools

### Internationalization
- [ ] **i18n Implementation**: Multi-language support
  - [ ] Set up react-i18next
  - [ ] Extract all text strings to translation files
  - [ ] Implement language switching
  - [ ] Add RTL language support

### Progressive Web App
- [ ] **PWA Features**: Enhanced user experience
  - [ ] Add service worker for offline functionality
  - [ ] Implement app manifest
  - [ ] Add push notification support
  - [ ] Cache management strategy

## 📊 **TRACKING & METRICS**

### Performance Monitoring
- [ ] **Add Performance Tracking**: Monitor application health
  - [ ] Implement Web Vitals monitoring
  - [ ] Add bundle size tracking
  - [ ] Monitor render performance
  - [ ] Track user interaction metrics

### Quality Metrics
- [ ] **Code Quality Monitoring**: Maintain high standards
  - [ ] Set up code coverage reporting
  - [ ] Implement technical debt tracking
  - [ ] Add dependency vulnerability scanning
  - [ ] Monitor bundle analysis reports

---

## 🏆 **EXCELLENCE AREAS (MAINTAIN)**

These areas are already outstanding and should be preserved:

- ✅ **Generic Entity System**: Industry-leading abstraction
- ✅ **TypeScript Integration**: Enterprise-grade type safety
- ✅ **Context Architecture**: Perfect React best practices
- ✅ **Service Layer Design**: Exceptional separation of concerns
- ✅ **Terminal-Only Messaging**: Innovative UI pattern
- ✅ **Dynamic Row Coloring**: Sophisticated state management

---

*Last Updated: January 2025*
*Review Score: 8.5/10 - Exceptional Quality with Room for Consistency Improvements*