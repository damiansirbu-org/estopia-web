// Quick i18n test
import puppeteer from 'puppeteer';

(async () => {
  console.log('🚀 Testing i18n implementation...');
  
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
    
    // Take a screenshot
    await page.screenshot({ path: 'screenshots/i18n-test.png', fullPage: true });
    console.log('📷 Screenshot saved: screenshots/i18n-test.png');
    
    // Check if terminal component is present
    const terminalExists = await page.$eval('*', () => {
      return !!document.querySelector('div[style*="position: absolute"]');
    }).catch(() => false);
    
    console.log('📟 Terminal component present:', terminalExists);
    
    // Check for any console errors
    const logs = [];
    page.on('console', msg => {
      logs.push(`${msg.type()}: ${msg.text()}`);
    });
    
    // Try clicking something to generate messages
    try {
      const addButton = await page.$('button .anticon-plus, button[class*="plus"]');
      if (addButton) {
        console.log('🔘 Found Add button, clicking...');
        await addButton.click();
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    } catch (e) {
      console.log('⚠️ Could not find/click Add button:', e.message);
    }
    
    // Check for i18n elements
    const hasTranslations = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      for (let el of elements) {
        if (el.textContent && el.textContent.includes('Add') || el.textContent.includes('Search') || el.textContent.includes('Reset')) {
          return true;
        }
      }
      return false;
    });
    
    console.log('🌐 Translation elements found:', hasTranslations);
    
    // Print recent console logs
    if (logs.length > 0) {
      console.log('📝 Console output:');
      logs.slice(-10).forEach(log => console.log(`  ${log}`));
    }
    
    console.log('✅ i18n test completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
})();