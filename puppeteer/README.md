# Estopia E2E Testing Suite

Comprehensive end-to-end testing for the Estopia Property Management System using Puppeteer.

## Setup

### Prerequisites
- Node.js 18+
- Chrome/Chromium browser

### Installation
```bash
cd puppeteer
npm install
```

### Configuration Files
- `jest-puppeteer.config.js` - Puppeteer browser configuration
- `jest.setup.js` - Global test setup and utilities
- `package.json` - Dependencies and test scripts

## Test Structure

```
puppeteer/
├── tests/
│   ├── validation-bugs.test.js    # Bug hunting and validation tests
│   ├── crud-operations.test.js    # CRUD functionality tests
│   └── visual-regression.test.js  # Screenshot comparison tests
├── utils/
│   └── test-helpers.js            # Reusable test utilities
├── screenshots/                   # Test screenshots and snapshots
└── README.md                      # This file
```

## Running Tests

### All Tests
```bash
npm test
```

### Specific Test Types
```bash
# Validation bug tests (duplicate CNP, etc.)
npm run test:validation

# CRUD operation tests
npm run test:crud

# Visual regression tests
npm run test:screenshots
```

### Debug Mode (Visual Browser)
```bash
npm run test:debug
```

### Headless Mode (CI/CD)
```bash
npm run test:headless
```

## Test Categories

### 1. Validation Bug Tests (`validation-bugs.test.js`)
Tests for specific bugs mentioned:
- **Duplicate CNP validation** - Tests that duplicate client CNPs show proper error messages
- Empty required field validation
- Invalid email format validation
- Other entity validation edge cases

### 2. CRUD Operations (`crud-operations.test.js`)
Comprehensive testing of:
- **Create**: Adding new clients, assets, contracts, payments
- **Read**: Viewing lists and individual records
- **Update**: Editing existing records
- **Delete**: Removing records with confirmation

### 3. Visual Regression (Future)
- Screenshot comparisons
- UI consistency checks
- Cross-browser visual validation

## Test Helpers (`utils/test-helpers.js`)

### Navigation
```javascript
await helpers.navigateToSection('Clients');
```

### Form Operations
```javascript
await helpers.fillForm(['Name', 'Email', 'Phone']);
await helpers.submitForm();
```

### Validation Testing
```javascript
const result = await helpers.testDuplicateValidation('Clients', data, 'CNP');
```

### Screenshots
```javascript
await helpers.screenshot('test-description');
```

## Environment Variables

- `HEADLESS=false` - Run with visible browser
- `SLOWMO=50` - Slow down operations (milliseconds)
- `DEVTOOLS=true` - Open browser DevTools
- `CI=true` - CI/CD mode optimizations

## Expected Test Results

### ✅ Passing Tests
- Navigation between sections works
- Form inputs can be filled
- Screenshots are captured

### 🐛 Expected Failures (Bugs to Fix)
- **Duplicate CNP validation** - Should fail until bug is fixed
- Missing CRUD interfaces - Tests will skip if UI missing

## Debugging

### Visual Debugging
```bash
HEADLESS=false SLOWMO=100 npm test
```

### Screenshot Analysis
Check `screenshots/` directory for visual evidence of test states.

### Console Logs
Tests capture and display:
- Browser console errors
- Network request failures  
- JavaScript exceptions
- Page navigation events

## Integration with Main Project

Add to your main `package.json`:
```json
{
  "scripts": {
    "test:e2e": "cd puppeteer && npm test",
    "test:e2e:debug": "cd puppeteer && npm run test:debug"
  }
}
```

## CI/CD Integration

### GitHub Actions Example
```yaml
- name: Run E2E Tests
  run: |
    cd puppeteer
    npm ci
    npm run test:headless
```

## Customization

### Adding New Tests
1. Create test file in `tests/` directory
2. Use `EstopiaTestHelpers` for common operations
3. Follow existing naming patterns
4. Add appropriate screenshots

### Custom Selectors
Update `test-helpers.js` selectors object for your specific UI elements.

### Test Data
Modify test data arrays in each test file to match your validation rules.

## Troubleshooting

### Common Issues
- **No Add buttons found**: UI may use different interaction patterns
- **Form fields not found**: Check selector patterns in helpers
- **Screenshots empty**: Verify page load timing

### Debug Steps
1. Run with `HEADLESS=false` to see browser actions
2. Check screenshot files for visual state
3. Review console logs for JavaScript errors
4. Verify network requests complete successfully

## Future Enhancements

- [ ] Visual regression testing with jest-image-snapshot
- [ ] Cross-browser testing (Firefox, Safari)
- [ ] Mobile responsive testing
- [ ] Performance metric collection
- [ ] Test data cleanup/reset functionality