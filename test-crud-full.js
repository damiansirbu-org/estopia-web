// Full CRUD Testing with Puppeteer - Headless
import puppeteer from 'puppeteer';

(async () => {
  console.log('🚀 Starting FULL CRUD Testing...');
  
  const browser = await puppeteer.launch({ 
    headless: true,
    defaultViewport: { width: 1920, height: 1080 }
  });
  
  try {
    const page = await browser.newPage();
    
    // Navigate to the application
    console.log('📍 Navigating to http://localhost:5173');
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
    
    // Wait for the app to load
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Take initial screenshot
    await page.screenshot({ path: 'screenshots/crud-start.png', fullPage: true });
    console.log('📷 Initial screenshot: crud-start.png');
    
    // TEST 1: CREATE - Add new client with VALID data
    console.log('\n🧪 TEST 1: CREATE - Valid client');
    const addButton = await page.$('button .anticon-plus, button[class*="plus"]');
    if (addButton) {
      await addButton.click();
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Fill form with VALID data
      await page.type('input[placeholder*="Name"], input[id*="name"]', 'John Doe Test');
      await page.type('input[placeholder*="Phone"], input[id*="phone"]', '+40-777-888-999');
      await page.type('input[placeholder*="National"], input[id*="national"]', '1990807340912');
      
      // Save
      const saveButton = await page.$('button .anticon-check, button[class*="check"]');
      if (saveButton) {
        await saveButton.click();
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
      
      await page.screenshot({ path: 'screenshots/crud-create-valid.png', fullPage: true });
      console.log('✅ CREATE Valid - Screenshot: crud-create-valid.png');
    }
    
    // TEST 2: CREATE - Add client with INVALID phone format
    console.log('\n🧪 TEST 2: CREATE - Invalid phone format');
    const addButton2 = await page.$('button .anticon-plus, button[class*="plus"]');
    if (addButton2) {
      await addButton2.click();
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Fill form with INVALID phone
      await page.type('input[placeholder*="Name"], input[id*="name"]', 'Jane Smith');
      await page.type('input[placeholder*="Phone"], input[id*="phone"]', '123-invalid-phone');
      await page.type('input[placeholder*="National"], input[id*="national"]', '1985123456789');
      
      // Try to save
      const saveButton2 = await page.$('button .anticon-check, button[class*="check"]');
      if (saveButton2) {
        await saveButton2.click();
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
      
      await page.screenshot({ path: 'screenshots/crud-create-invalid.png', fullPage: true });
      console.log('❌ CREATE Invalid Phone - Screenshot: crud-create-invalid.png');
    }
    
    // TEST 3: CREATE - Duplicate CNP test
    console.log('\n🧪 TEST 3: CREATE - Duplicate CNP');
    const addButton3 = await page.$('button .anticon-plus, button[class*="plus"]');
    if (addButton3) {
      await addButton3.click();
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Fill form with DUPLICATE CNP
      await page.type('input[placeholder*="Name"], input[id*="name"]', 'Duplicate CNP Test');
      await page.type('input[placeholder*="Phone"], input[id*="phone"]', '0721123456');
      await page.type('input[placeholder*="National"], input[id*="national"]', '1990807340912'); // Same as TEST 1
      
      // Try to save
      const saveButton3 = await page.$('button .anticon-check, button[class*="check"]');
      if (saveButton3) {
        await saveButton3.click();
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
      
      await page.screenshot({ path: 'screenshots/crud-create-duplicate.png', fullPage: true });
      console.log('🔄 CREATE Duplicate CNP - Screenshot: crud-create-duplicate.png');
    }
    
    // TEST 4: READ - Check if data appears in list
    console.log('\n🧪 TEST 4: READ - Data visibility');
    await page.reload({ waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    await page.screenshot({ path: 'screenshots/crud-read-list.png', fullPage: true });
    console.log('👀 READ List - Screenshot: crud-read-list.png');
    
    // Check terminal messages
    const terminalMessages = await page.evaluate(() => {
      const terminalElements = document.querySelectorAll('[class*="terminal"], [class*="console"], [class*="message"]');
      const messages = [];
      terminalElements.forEach(el => {
        if (el.textContent && el.textContent.trim()) {
          messages.push(el.textContent.trim());
        }
      });
      return messages;
    });
    
    console.log('\n📟 Terminal Messages Found:');
    if (terminalMessages.length > 0) {
      terminalMessages.forEach((msg, i) => console.log(`  ${i+1}. ${msg}`));
    } else {
      console.log('  No terminal messages detected');
    }
    
    // Check for any error messages on screen
    const errorMessages = await page.evaluate(() => {
      const errorElements = document.querySelectorAll('[class*="error"], [class*="danger"], .ant-form-item-explain-error');
      const errors = [];
      errorElements.forEach(el => {
        if (el.textContent && el.textContent.trim()) {
          errors.push(el.textContent.trim());
        }
      });
      return errors;
    });
    
    console.log('\n❗ Error Messages Found:');
    if (errorMessages.length > 0) {
      errorMessages.forEach((msg, i) => console.log(`  ${i+1}. ${msg}`));
    } else {
      console.log('  No error messages detected');
    }
    
    console.log('\n✅ CRUD Testing completed! Check screenshots/ folder for evidence.');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    await page.screenshot({ path: 'screenshots/crud-error.png', fullPage: true });
  } finally {
    await browser.close();
  }
})();