// Test React ErrorProvider Fix
import puppeteer from 'puppeteer';

(async () => {
  console.log('🚀 Testing React ErrorProvider Fix...');
  
  const browser = await puppeteer.launch({ 
    headless: true,
    defaultViewport: { width: 1920, height: 1080 }
  });
  
  try {
    const page = await browser.newPage();
    
    // Capture console errors
    const consoleErrors = [];
    const pageErrors = [];
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
        console.log(`🚨 CONSOLE ERROR: ${msg.text()}`);
      } else {
        console.log(`🖥️  BROWSER ${msg.type().toUpperCase()}: ${msg.text()}`);
      }
    });
    
    page.on('pageerror', error => {
      pageErrors.push(error.message);
      console.log(`🚨 PAGE ERROR: ${error.message}`);
    });
    
    // Navigate and wait
    console.log('📍 Navigating to http://localhost:5173');
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Take screenshot
    await page.screenshot({ path: 'screenshots/react-fix-test.png', fullPage: true });
    console.log('📷 Screenshot: react-fix-test.png');
    
    // Check for terminal component
    const terminalCheck = await page.evaluate(() => {
      const terminalElements = document.querySelectorAll('[class*="terminal"], [class*="Terminal"]');
      return {
        terminalFound: terminalElements.length > 0,
        terminalCount: terminalElements.length,
        hasErrorBoundary: !!document.querySelector('[class*="error-boundary"], [class*="ErrorBoundary"]'),
        formElements: document.querySelectorAll('form, .ant-form').length,
        inputElements: document.querySelectorAll('input').length
      };
    });
    
    console.log('\n📊 Component Status:');
    console.log(`  Terminal found: ${terminalCheck.terminalFound}`);
    console.log(`  Terminal count: ${terminalCheck.terminalCount}`);
    console.log(`  Form elements: ${terminalCheck.formElements}`);
    console.log(`  Input elements: ${terminalCheck.inputElements}`);
    
    console.log('\n🔍 Error Analysis:');
    console.log(`  Console errors: ${consoleErrors.length}`);
    console.log(`  Page errors: ${pageErrors.length}`);
    
    if (consoleErrors.length === 0 && pageErrors.length === 0) {
      console.log('✅ No React errors detected!');
    } else {
      console.log('❌ React errors still present:');
      consoleErrors.forEach((err, i) => console.log(`  ${i+1}. ${err}`));
      pageErrors.forEach((err, i) => console.log(`  ${i+1}. ${err}`));
    }
    
    if (terminalCheck.terminalFound) {
      console.log('✅ Terminal component is now rendering!');
    } else {
      console.log('❌ Terminal component still not found');
    }
    
    // BUG-005 Status
    if (consoleErrors.length === 0 && pageErrors.length === 0 && terminalCheck.terminalFound) {
      console.log('\n🎉 BUG-005 FIXED: ErrorProvider working, Terminal rendering!');
    } else {
      console.log('\n🔄 BUG-005 PARTIAL: Some issues remain');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    await page.screenshot({ path: 'screenshots/react-fix-error.png', fullPage: true });
  } finally {
    await browser.close();
  }
})();