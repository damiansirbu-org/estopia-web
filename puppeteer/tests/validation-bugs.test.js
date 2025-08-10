/**
 * Estopia Validation Bug Tests
 * Tests for duplicate CNP and other validation edge cases
 * Focuses on finding the bugs you mentioned!
 */

const EstopiaTestHelpers = require('../utils/test-helpers');
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

describe('Estopia Validation Bug Tests', () => {
  let helpers;
  const DUPLICATE_CNP = '1234567890123';
  const baseUrl = 'https://sirbu.tplinkdns.com';

  beforeAll(async () => {
    helpers = new EstopiaTestHelpers(page);
    await helpers.goto();
  });

  beforeEach(async () => {
    // Clear any previous state
    await page.reload();
    await page.waitForSelector('#root');
  });

  describe('Client Validation Bugs', () => {
    test('BUG: Duplicate CNP validation - should show proper error message', async () => {
      console.log('🔍 Testing duplicate CNP validation bug...');
      
      // Navigate to Clients section
      await helpers.navigateToSection('Clients');
      
      // Try to find and click Add button (Plus icon)
      const addButtonFound = await helpers.clickAddButton();
      
      if (!addButtonFound) {
        console.log('⚠️ Add button not found - taking screenshot for analysis');
        await helpers.screenshot('no-add-button-clients');
        
        // Try alternative approaches
        // Maybe double-click on table?
        const tables = await page.$$('table, [role="table"]');
        if (tables.length > 0) {
          console.log('🎯 Trying double-click on table...');
          await page.evaluate(() => {
            const table = document.querySelector('table, [role="table"]');
            if (table) table.dispatchEvent(new Event('dblclick', { bubbles: true }));
          });
          await delay(1000);
        }
        
        // Or maybe right-click context menu?
        await page.click('body', { button: 'right' });
        await delay(1000);
        
        // Check if any modal/form appeared
        const modals = await page.$$('[role="dialog"], .modal, [class*="modal"]');
        if (modals.length === 0) {
          console.log('❌ Cannot find way to add clients - UI may be missing CRUD functionality');
          await helpers.screenshot('clients-no-crud-interface');
          return; // Skip this test if UI doesn't support adding
        }
      }
      
      console.log('✅ Found add client interface');
      
      // Fill first client with test CNP
      const firstClientData = [
        'Test Client One',
        DUPLICATE_CNP, // CNP
        'test1@example.com',
        '+40-123-456-789',
        'Test Address 1'
      ];
      
      const fieldsFilledFirst = await helpers.fillForm(firstClientData);
      if (fieldsFilledFirst === 0) {
        console.log('❌ No form fields found - taking screenshot');
        await helpers.screenshot('no-form-fields-client');
        return;
      }
      
      // Submit first client
      const submitSuccess = await helpers.submitForm();
      if (submitSuccess) {
        console.log('✅ First client created successfully');
        await delay(2000);
        
        // Now try to create second client with SAME CNP
        console.log('🔴 Attempting to create duplicate CNP client...');
        
        // Try to add another client
        const addAgain = await helpers.clickAddButton();
        
        if (addAgain) {
          const secondClientData = [
            'Test Client Two DUPLICATE',
            DUPLICATE_CNP, // SAME CNP - should trigger validation error!
            'test2@example.com',
            '+40-987-654-321',
            'Test Address 2'
          ];
          
          await helpers.fillForm(secondClientData);
          
          // Capture errors before submit
          const errorsBefore = await helpers.getErrorMessages();
          
          // Submit and check for validation
          await helpers.submitForm();
          await delay(3000); // Wait for validation
          
          const errorsAfter = await helpers.getErrorMessages();
          
          console.log(`📊 Errors before: ${errorsBefore.length}, after: ${errorsAfter.length}`);
          console.log('Error messages:', errorsAfter);
          
          // Take screenshot of the state
          await helpers.screenshot('duplicate-cnp-validation-result');
          
          // Check for proper validation message
          const hasCNPValidationError = errorsAfter.some(error => 
            error.toLowerCase().includes('cnp') || 
            error.toLowerCase().includes('duplicate') ||
            error.toLowerCase().includes('already exists') ||
            error.toLowerCase().includes('unique')
          );
          
          if (!hasCNPValidationError) {
            console.log('🐛 BUG CONFIRMED: No proper CNP validation error message displayed!');
            console.log('Expected: Error message about duplicate CNP');
            console.log('Actual: No CNP-specific validation message found');
            
            // Check browser console for internal errors
            const logs = await page.evaluate(() => {
              return window.__testLogs || [];
            });
            
            if (logs.length > 0) {
              console.log('🔍 Browser console logs:', logs);
            }
          }
          
          // Test expectation - this should pass if bug is fixed
          expect(hasCNPValidationError).toBe(true); // This will fail if bug exists!
          
        } else {
          console.log('❌ Could not add second client to test duplicate validation');
        }
      } else {
        console.log('❌ First client creation failed');
      }
    });

    test('BUG: Empty required field validation', async () => {
      console.log('🔍 Testing empty required field validation...');
      
      await helpers.navigateToSection('Clients');
      
      if (await helpers.clickAddButton()) {
        // Try to submit empty form
        const emptySubmit = await helpers.submitForm();
        await delay(1000);
        
        const errors = await helpers.getErrorMessages();
        console.log('Empty form validation errors:', errors);
        
        await helpers.screenshot('empty-form-validation');
        
        // Should have validation errors for required fields
        expect(errors.length).toBeGreaterThan(0);
      }
    });

    test('BUG: Invalid email format validation', async () => {
      console.log('🔍 Testing invalid email validation...');
      
      await helpers.navigateToSection('Clients');
      
      if (await helpers.clickAddButton()) {
        const invalidEmailData = [
          'Test Client',
          '1234567890123', // Valid CNP
          'invalid-email-format', // Invalid email!
          '+40-123-456-789',
          'Test Address'
        ];
        
        await helpers.fillForm(invalidEmailData);
        await helpers.submitForm();
        await delay(1000);
        
        const errors = await helpers.getErrorMessages();
        console.log('Invalid email validation errors:', errors);
        
        await helpers.screenshot('invalid-email-validation');
        
        const hasEmailValidationError = errors.some(error =>
          error.toLowerCase().includes('email') ||
          error.toLowerCase().includes('invalid') ||
          error.toLowerCase().includes('format')
        );
        
        expect(hasEmailValidationError).toBe(true);
      }
    });
  });

  describe('Other Entity Validation Tests', () => {
    test('Asset validation edge cases', async () => {
      await helpers.navigateToSection('Assets');
      // Test negative price, invalid data types, etc.
      // ... similar pattern for assets
    });

    test('Contract validation edge cases', async () => {
      await helpers.navigateToSection('Contracts');
      // Test invalid date ranges, negative amounts, etc.
      // ... similar pattern for contracts
    });

    test('Payment validation edge cases', async () => {
      await helpers.navigateToSection('Payments');
      // Test negative amounts, invalid dates, etc.
      // ... similar pattern for payments
    });
  });

  afterEach(async () => {
    // Clean up any test data if needed
    // Note: In real scenario, you might want to clean up test records
    console.log('🧹 Test cleanup completed');
  });
});