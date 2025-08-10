// Detailed CRUD Testing with Better Selectors
import puppeteer from 'puppeteer';

(async () => {
  console.log('🚀 Starting DETAILED CRUD Testing...');
  
  const browser = await puppeteer.launch({ 
    headless: true,
    defaultViewport: { width: 1920, height: 1080 }
  });
  
  try {
    const page = await browser.newPage();
    
    // Enable console logging from the page
    page.on('console', msg => {
      console.log(`🖥️  BROWSER: ${msg.text()}`);
    });
    
    // Navigate to the application
    console.log('📍 Navigating to http://localhost:5173');
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Take initial screenshot
    await page.screenshot({ path: 'screenshots/detailed-start.png', fullPage: true });
    console.log('📷 Screenshot: detailed-start.png');
    
    // FIND ADD BUTTON - Try multiple selectors
    console.log('\n🔍 Looking for Add button...');
    
    const addSelectors = [
      'button .anticon-plus',
      'button[class*="plus"]',
      'button:has(.anticon-plus)',
      '.ant-btn:has(.anticon-plus)',
      'button[title*="Add"]',
      'button[aria-label*="Add"]',
      'button:contains("Add")',
      '[class*="add"] button',
      'button:first-of-type'
    ];
    
    let addButton = null;
    for (const selector of addSelectors) {
      try {
        addButton = await page.$(selector);
        if (addButton) {
          console.log(`✅ Found Add button with selector: ${selector}`);
          break;
        }
      } catch (e) {
        // Selector not valid, continue
      }
    }
    
    if (!addButton) {
      // Try finding all buttons and analyze them
      const allButtons = await page.evaluate(() => {
        const buttons = document.querySelectorAll('button');
        const buttonInfo = [];
        buttons.forEach((btn, index) => {
          buttonInfo.push({
            index,
            textContent: btn.textContent?.trim(),
            className: btn.className,
            innerHTML: btn.innerHTML,
            title: btn.title,
            ariaLabel: btn.getAttribute('aria-label')
          });
        });
        return buttonInfo;
      });
      
      console.log('\n📋 All buttons found:');
      allButtons.forEach((btn, i) => {
        console.log(`  ${i+1}. Text: "${btn.textContent}" | Class: "${btn.className}" | HTML: "${btn.innerHTML.substring(0, 100)}..."`);
      });
      
      // Use first button as add button
      addButton = await page.$('button');
      console.log('🎯 Using first button as Add button');
    }
    
    // TEST 1: Try clicking Add button
    if (addButton) {
      console.log('\n🧪 TEST 1: Clicking Add button...');
      await addButton.click();
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      await page.screenshot({ path: 'screenshots/detailed-after-add-click.png', fullPage: true });
      console.log('📷 Screenshot: detailed-after-add-click.png');
      
      // Look for form inputs
      const inputs = await page.evaluate(() => {
        const allInputs = document.querySelectorAll('input, textarea, select');
        const inputInfo = [];
        allInputs.forEach((input, index) => {
          inputInfo.push({
            index,
            type: input.type,
            placeholder: input.placeholder,
            id: input.id,
            name: input.name,
            className: input.className,
            value: input.value
          });
        });
        return inputInfo;
      });
      
      console.log('\n📝 Form inputs found:');
      if (inputs.length > 0) {
        inputs.forEach((input, i) => {
          console.log(`  ${i+1}. Type: ${input.type} | Placeholder: "${input.placeholder}" | ID: "${input.id}" | Name: "${input.name}"`);
        });
        
        // TEST 2: Fill form with valid data
        console.log('\n🧪 TEST 2: Filling form with valid data...');
        
        try {
          // Try filling name field
          const nameInput = await page.$('input[placeholder*="name" i], input[id*="name" i], input[name*="name" i]');
          if (nameInput) {
            await nameInput.type('John Doe Puppeteer Test');
            console.log('✅ Filled name field');
          }
          
          // Try filling phone field  
          const phoneInput = await page.$('input[placeholder*="phone" i], input[id*="phone" i], input[name*="phone" i]');
          if (phoneInput) {
            await phoneInput.type('+40-777-888-123');
            console.log('✅ Filled phone field');
          }
          
          // Try filling national ID field
          const nationalInput = await page.$('input[placeholder*="national" i], input[id*="national" i], input[name*="national" i], input[placeholder*="cnp" i]');
          if (nationalInput) {
            await nationalInput.type('1990807340999');
            console.log('✅ Filled national ID field');
          }
          
          await new Promise(resolve => setTimeout(resolve, 2000));
          await page.screenshot({ path: 'screenshots/detailed-form-filled.png', fullPage: true });
          console.log('📷 Screenshot: detailed-form-filled.png');
          
          // TEST 3: Try to save
          console.log('\n🧪 TEST 3: Attempting to save...');
          const saveButton = await page.$('button .anticon-check, button[class*="check"], button:contains("Save"), button[type="submit"]');
          if (saveButton) {
            await saveButton.click();
            await new Promise(resolve => setTimeout(resolve, 3000));
            console.log('✅ Clicked save button');
            
            await page.screenshot({ path: 'screenshots/detailed-after-save.png', fullPage: true });
            console.log('📷 Screenshot: detailed-after-save.png');
          } else {
            console.log('❌ Save button not found');
          }
          
        } catch (err) {
          console.error('❌ Form filling error:', err.message);
        }
        
      } else {
        console.log('❌ No form inputs found');
      }
    }
    
    // TEST 4: Check for any error/success messages
    console.log('\n🧪 TEST 4: Checking for messages...');
    
    const messages = await page.evaluate(() => {
      const messageSelectors = [
        '.ant-message',
        '.ant-notification',
        '.ant-alert', 
        '[class*="error"]',
        '[class*="success"]',
        '[class*="warning"]',
        '[class*="terminal"]',
        '[class*="console"]',
        '.ant-form-item-explain-error'
      ];
      
      const foundMessages = [];
      messageSelectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
          if (el.textContent?.trim()) {
            foundMessages.push({
              selector,
              text: el.textContent.trim(),
              className: el.className
            });
          }
        });
      });
      return foundMessages;
    });
    
    console.log('\n💬 Messages found:');
    if (messages.length > 0) {
      messages.forEach((msg, i) => {
        console.log(`  ${i+1}. [${msg.selector}] ${msg.text}`);
      });
    } else {
      console.log('  No messages detected');
    }
    
    await page.screenshot({ path: 'screenshots/detailed-final.png', fullPage: true });
    console.log('📷 Final screenshot: detailed-final.png');
    
    console.log('\n✅ DETAILED CRUD Testing completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    await page.screenshot({ path: 'screenshots/detailed-error.png', fullPage: true });
  } finally {
    await browser.close();
  }
})();