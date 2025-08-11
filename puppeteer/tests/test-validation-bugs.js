// Targeted Validation Bug Testing
import puppeteer from 'puppeteer';

(async () => {
  console.log('🚀 Testing Validation Bugs with Puppeteer...');
  
  const browser = await puppeteer.launch({ 
    headless: true,
    defaultViewport: { width: 1920, height: 1080 }
  });
  
  try {
    const page = await browser.newPage();
    
    // Navigate and wait for app
    console.log('📍 Navigating to http://localhost:5173');
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // BUG TEST 1: Phone Validation (BUG-001)
    console.log('\n🧪 BUG TEST 1: Phone validation with international format');
    
    // Use direct API call through browser context to test backend validation
    const phoneTest = await page.evaluate(async () => {
      try {
        const response = await fetch('http://localhost:8081/api/clients', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: 'Phone Test User',
            phoneNumber: '+40-777-888-999',  // International format
            nationalId: '1990807340001'
          })
        });
        
        const result = await response.json();
        return { 
          status: response.status, 
          success: result.success,
          message: result.message,
          data: result.data 
        };
      } catch (error) {
        return { error: error.message };
      }
    });
    
    console.log(`  Status: ${phoneTest.status}`);
    console.log(`  Success: ${phoneTest.success}`);
    if (phoneTest.message) console.log(`  Message: ${phoneTest.message}`);
    if (phoneTest.error) console.log(`  Error: ${phoneTest.error}`);
    
    if (phoneTest.status === 201 && phoneTest.success) {
      console.log('✅ BUG-001 FIXED: International phone format accepted');
    } else {
      console.log('❌ BUG-001 FAILED: International phone format rejected');
    }
    
    // BUG TEST 2: Duplicate CNP Validation (BUG-004)
    console.log('\n🧪 BUG TEST 2: Duplicate CNP validation');
    
    const duplicateTest = await page.evaluate(async () => {
      try {
        const response = await fetch('http://localhost:8081/api/clients', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: 'Duplicate CNP Test',
            phoneNumber: '0721123456',
            nationalId: '1990807340001'  // Same CNP as above
          })
        });
        
        const result = await response.json();
        return { 
          status: response.status, 
          success: result.success,
          message: result.message,
          errors: result.errors 
        };
      } catch (error) {
        return { error: error.message };
      }
    });
    
    console.log(`  Status: ${duplicateTest.status}`);
    console.log(`  Success: ${duplicateTest.success}`);
    if (duplicateTest.message) console.log(`  Message: ${duplicateTest.message}`);
    if (duplicateTest.errors) console.log(`  Errors: ${JSON.stringify(duplicateTest.errors)}`);
    
    if (duplicateTest.status === 400 && !duplicateTest.success && 
        duplicateTest.message && duplicateTest.message.includes('already exists')) {
      console.log('✅ BUG-004 FIXED: Duplicate CNP properly rejected');
    } else {
      console.log('❌ BUG-004 FAILED: Duplicate CNP not properly handled');
    }
    
    // BUG TEST 3: Invalid Phone Format (Should fail)
    console.log('\n🧪 BUG TEST 3: Invalid phone format validation');
    
    const invalidPhoneTest = await page.evaluate(async () => {
      try {
        const response = await fetch('http://localhost:8081/api/clients', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: 'Invalid Phone Test',
            phoneNumber: '123-invalid-phone',  // Invalid format
            nationalId: '1990807340002'
          })
        });
        
        const result = await response.json();
        return { 
          status: response.status, 
          success: result.success,
          message: result.message,
          errors: result.errors 
        };
      } catch (error) {
        return { error: error.message };
      }
    });
    
    console.log(`  Status: ${invalidPhoneTest.status}`);
    console.log(`  Success: ${invalidPhoneTest.success}`);
    if (invalidPhoneTest.message) console.log(`  Message: ${invalidPhoneTest.message}`);
    
    if (invalidPhoneTest.status === 400 && !invalidPhoneTest.success) {
      console.log('✅ VALIDATION WORKING: Invalid phone format properly rejected');
    } else {
      console.log('❌ VALIDATION ISSUE: Invalid phone format was accepted');
    }
    
    // Take screenshot of current state
    await page.screenshot({ path: 'screenshots/validation-test-complete.png', fullPage: true });
    console.log('\n📷 Screenshot: validation-test-complete.png');
    
    // BUG TEST 4: Frontend UI Validation Display
    console.log('\n🧪 BUG TEST 4: Frontend validation message display');
    
    // Check if frontend has proper error handling components
    const frontendValidation = await page.evaluate(() => {
      // Look for error display components
      const errorElements = document.querySelectorAll([
        '.ant-form-item-explain-error',
        '.ant-form-item-has-error',
        '.ant-message',
        '.ant-notification',
        '[class*="error"]',
        '[class*="terminal"]'
      ].join(', '));
      
      return {
        errorElementsFound: errorElements.length,
        terminalPresent: !!document.querySelector('[class*="terminal"]'),
        formElementsPresent: document.querySelectorAll('form, .ant-form').length > 0,
        inputElements: document.querySelectorAll('input').length
      };
    });
    
    console.log(`  Error display elements: ${frontendValidation.errorElementsFound}`);
    console.log(`  Terminal present: ${frontendValidation.terminalPresent}`);
    console.log(`  Forms present: ${frontendValidation.formElementsPresent}`);
    console.log(`  Input elements: ${frontendValidation.inputElements}`);
    
    if (frontendValidation.terminalPresent) {
      console.log('✅ FRONTEND: Terminal component detected');
    } else {
      console.log('❌ FRONTEND: Terminal component not found');
    }
    
    console.log('\n=== VALIDATION TESTING SUMMARY ===');
    console.log('BUG-001 (Phone Format): ' + (phoneTest.status === 201 ? '✅ FIXED' : '❌ FAILED'));
    console.log('BUG-004 (Duplicate CNP): ' + (duplicateTest.status === 400 ? '✅ FIXED' : '❌ FAILED'));
    console.log('Frontend Terminal: ' + (frontendValidation.terminalPresent ? '✅ PRESENT' : '❌ MISSING'));
    console.log('===================================');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    await page.screenshot({ path: 'screenshots/validation-error.png', fullPage: true });
  } finally {
    await browser.close();
  }
})();