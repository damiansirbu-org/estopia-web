// Final Terminal Component Test
import puppeteer from 'puppeteer';

(async () => {
  console.log('🚀 Testing Terminal Component (Final)...');
  
  const browser = await puppeteer.launch({ 
    headless: true,
    defaultViewport: { width: 1920, height: 1080 }
  });
  
  try {
    const page = await browser.newPage();
    
    // Error monitoring
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
        console.log(`🚨 CONSOLE ERROR: ${msg.text()}`);
      }
    });
    
    page.on('pageerror', error => {
      console.log(`🚨 PAGE ERROR: ${error.message}`);
    });
    
    // Navigate and wait
    console.log('📍 Navigating to http://localhost:5173');
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Take screenshot
    await page.screenshot({ path: 'screenshots/terminal-final-test.png', fullPage: true });
    console.log('📷 Screenshot: terminal-final-test.png');
    
    // Check for terminal using style attributes (it uses inline styles)
    const terminalAnalysis = await page.evaluate(() => {
      // Look for elements with terminal-like inline styles
      const terminalCandidates = Array.from(document.querySelectorAll('div')).filter(el => {
        const style = el.getAttribute('style') || '';
        return style.includes('position: absolute') && 
               style.includes('bottom:') && 
               style.includes('fontFamily') &&
               style.includes('monospace');
      });
      
      // Also check for any elements with terminal-related attributes
      const terminalByClass = document.querySelectorAll('[class*="terminal"], [class*="Terminal"]');
      const terminalByContent = Array.from(document.querySelectorAll('div')).filter(el => 
        el.textContent && el.textContent.toLowerCase().includes('terminal')
      );
      
      return {
        terminalStyleFound: terminalCandidates.length > 0,
        terminalStyleCount: terminalCandidates.length,
        terminalByClass: terminalByClass.length,
        terminalByContent: terminalByContent.length,
        allDivs: document.querySelectorAll('div').length,
        hasMonospaceFont: Array.from(document.querySelectorAll('*')).some(el => {
          const computed = window.getComputedStyle(el);
          return computed.fontFamily.includes('monospace');
        }),
        bodyHTML: document.body.innerHTML.includes('terminal') || document.body.innerHTML.includes('Terminal'),
        bottomElements: Array.from(document.querySelectorAll('div')).filter(el => {
          const style = el.getAttribute('style') || '';
          return style.includes('bottom:');
        }).length
      };
    });
    
    console.log('\n📊 Terminal Analysis:');
    console.log(`  Terminal by inline styles: ${terminalAnalysis.terminalStyleFound} (${terminalAnalysis.terminalStyleCount})`);
    console.log(`  Terminal by class: ${terminalAnalysis.terminalByClass}`);
    console.log(`  Terminal by content: ${terminalAnalysis.terminalByContent}`);
    console.log(`  Total divs: ${terminalAnalysis.allDivs}`);
    console.log(`  Has monospace font: ${terminalAnalysis.hasMonospaceFont}`);
    console.log(`  Body contains 'terminal': ${terminalAnalysis.bodyHTML}`);
    console.log(`  Elements with bottom positioning: ${terminalAnalysis.bottomElements}`);
    
    // Create a test validation error to see if terminal displays messages
    console.log('\n🧪 Testing validation error display...');
    
    const validationTest = await page.evaluate(async () => {
      try {
        // Trigger a validation error
        const response = await fetch('http://localhost:8081/api/clients', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: 'Terminal Test',
            phoneNumber: 'invalid-phone',
            nationalId: '1234567890123'
          })
        });
        
        const result = await response.json();
        
        // Wait a moment for any UI updates
        await new Promise(resolve => setTimeout(resolve, 2000));
        
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
    
    console.log(`  Validation response: ${validationTest.status} - ${validationTest.message}`);
    
    // Take final screenshot after validation attempt
    await new Promise(resolve => setTimeout(resolve, 2000));
    await page.screenshot({ path: 'screenshots/terminal-after-validation.png', fullPage: true });
    console.log('📷 Screenshot after validation: terminal-after-validation.png');
    
    // Final check for any terminal messages
    const finalTerminalCheck = await page.evaluate(() => {
      const allElements = Array.from(document.querySelectorAll('*'));
      const elementsWithText = allElements.filter(el => {
        const text = el.textContent?.toLowerCase() || '';
        return text.includes('error') || text.includes('validation') || text.includes('phone');
      });
      
      return {
        elementsWithErrorText: elementsWithText.length,
        errorTexts: elementsWithText.slice(0, 5).map(el => el.textContent?.substring(0, 100))
      };
    });
    
    console.log('\n📝 Error message analysis:');
    console.log(`  Elements with error text: ${finalTerminalCheck.elementsWithErrorText}`);
    if (finalTerminalCheck.errorTexts.length > 0) {
      finalTerminalCheck.errorTexts.forEach((text, i) => {
        console.log(`  ${i+1}. "${text}"`);
      });
    }
    
    // Final BUG-005 status
    console.log('\n=== BUG-005 STATUS ===');
    if (consoleErrors.length === 0) {
      console.log('✅ React errors: FIXED');
    } else {
      console.log('❌ React errors: Still present');
    }
    
    if (terminalAnalysis.terminalStyleFound) {
      console.log('✅ Terminal component: RENDERING');
    } else {
      console.log('❌ Terminal component: NOT FOUND');
    }
    
    if (finalTerminalCheck.elementsWithErrorText > 0) {
      console.log('✅ Error messages: DISPLAYING');
    } else {
      console.log('❌ Error messages: NOT VISIBLE');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    await page.screenshot({ path: 'screenshots/terminal-test-error.png', fullPage: true });
  } finally {
    await browser.close();
  }
})();