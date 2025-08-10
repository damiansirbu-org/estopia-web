/**
 * Puppeteer Test Helpers for Estopia Web Testing
 * Reusable utilities for UI automation and validation testing
 */

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class EstopiaTestHelpers {
  constructor(page) {
    this.page = page;
    this.baseUrl = 'https://sirbu.tplinkdns.com';
    this.selectors = {
      root: '#root',
      navigationButtons: 'button.flex',
      forms: 'form',
      inputs: 'input:not([type="hidden"])',
      submitButtons: 'button[type="submit"]',
      deleteButtons: '[data-testid*="delete"], button[title*="delete" i]',
      errorMessages: '.error, [class*="error"], .alert, [class*="alert"], [role="alert"]',
      successMessages: '.success, [class*="success"], [role="status"]'
    };
  }

  async goto(path = '/') {
    const url = this.baseUrl + path;
    console.log(`📍 Navigating to: ${url}`);
    await this.page.goto(url, {
      waitUntil: 'networkidle0',
      timeout: 30000
    });
    await this.page.waitForSelector(this.selectors.root, { timeout: 10000 });
    await delay(1000);
  }

  async clickButtonByText(text) {
    const buttons = await this.page.$$('button');
    for (const btn of buttons) {
      const btnText = await this.page.evaluate(el => el.textContent?.trim() || '', btn);
      if (btnText.toLowerCase().includes(text.toLowerCase())) {
        await btn.click();
        console.log(`✅ Clicked button: "${btnText}"`);
        await delay(1000);
        return true;
      }
    }
    console.log(`❌ Button not found: "${text}"`);
    return false;
  }

  async clickAddButton() {
    // Look for Plus icon button (EntityList Add functionality)
    const addButton = await this.page.$('button .anticon-plus, button[class*="plus"], button > svg[data-icon="plus"]');
    if (addButton) {
      await addButton.click();
      console.log('✅ Clicked Add button (Plus icon)');
      await delay(1000);
      return true;
    }
    
    // Fallback to any button containing plus icon
    const buttons = await this.page.$$('button');
    for (const btn of buttons) {
      const hasPlus = await this.page.evaluate(el => {
        const svg = el.querySelector('svg, .anticon');
        return svg && (svg.getAttribute('data-icon') === 'plus' || 
               svg.classList.contains('anticon-plus') ||
               el.innerHTML.includes('plus'));
      }, btn);
      if (hasPlus) {
        await btn.click();
        console.log('✅ Clicked Add button (Plus icon found)');
        await delay(1000);
        return true;
      }
    }
    
    console.log('❌ Add button (Plus icon) not found');
    return false;
  }

  async navigateToSection(sectionName) {
    console.log(`🧭 Navigating to ${sectionName} section...`);
    const success = await this.clickButtonByText(sectionName);
    if (success) {
      await delay(2000); // Wait for navigation
      await this.screenshot(`${sectionName.toLowerCase()}-section`);
    }
    return success;
  }

  async fillForm(data) {
    const inputs = await this.page.$$(this.selectors.inputs);
    let filledCount = 0;

    console.log(`📝 Filling form with ${data.length} values...`);

    for (let i = 0; i < Math.min(inputs.length, data.length); i++) {
      try {
        const input = inputs[i];
        const inputInfo = await this.page.evaluate(el => ({
          type: el.type,
          name: el.name,
          id: el.id,
          placeholder: el.placeholder,
          tagName: el.tagName.toLowerCase()
        }), input);

        if (inputInfo.tagName === 'select') {
          const options = await this.page.$$eval('select option', opts => 
            opts.map(opt => opt.value).filter(v => v !== '')
          );
          if (options.length > 0) {
            await this.page.select('select', options[0]);
            filledCount++;
            console.log(`  ✅ Selected option in dropdown ${i + 1}`);
          }
        } else if (inputInfo.type !== 'hidden' && inputInfo.type !== 'submit') {
          await input.click();
          await input.evaluate(el => el.select && el.select());
          await input.type(String(data[i]));
          filledCount++;
          console.log(`  ✅ Filled input ${i + 1}: ${data[i]} (${inputInfo.name || inputInfo.type})`);
        }
        await delay(300);
      } catch (e) {
        console.log(`  ⚠️ Could not fill input ${i + 1}: ${e.message.split('\n')[0]}`);
      }
    }

    console.log(`📝 Successfully filled ${filledCount}/${data.length} form fields`);
    return filledCount;
  }

  async submitForm() {
    console.log('🚀 Attempting to submit form...');
    
    // EntityList uses Enter key to save or CheckOutlined icon
    const checkButton = await this.page.$('button .anticon-check, button[class*="check"]');
    if (checkButton) {
      await checkButton.click();
      await delay(2000);
      console.log('✅ Form submitted via Check button');
      return true;
    }
    
    // Try Enter key on first input
    const firstInput = await this.page.$('input:not([type="hidden"])');
    if (firstInput) {
      await firstInput.press('Enter');
      await delay(2000);
      console.log('✅ Form submitted via Enter key');
      return true;
    }
    
    // Fallback to any submit button
    const submitBtn = await this.page.$(this.selectors.submitButtons);
    if (submitBtn) {
      await submitBtn.click();
      await delay(2000);
      console.log('✅ Form submitted via submit button');
      return true;
    }
    
    console.log('❌ No submit method found');
    return false;
  }

  async screenshot(name) {
    const filename = `./screenshots/${name}-${Date.now()}.png`;
    await this.page.screenshot({ 
      path: filename, 
      fullPage: true 
    });
    console.log(`📸 Screenshot saved: ${filename}`);
    return filename;
  }

  async getErrorMessages() {
    const errorElements = await this.page.$$(this.selectors.errorMessages);
    const errors = [];
    
    for (const el of errorElements) {
      const text = await this.page.evaluate(element => element.textContent?.trim(), el);
      if (text && text.length > 0) {
        errors.push(text);
      }
    }
    
    return errors;
  }

  async getSuccessMessages() {
    const successElements = await this.page.$$(this.selectors.successMessages);
    const messages = [];
    
    for (const el of successElements) {
      const text = await this.page.evaluate(element => element.textContent?.trim(), el);
      if (text && text.length > 0) {
        messages.push(text);
      }
    }
    
    return messages;
  }

  async waitForNetworkIdle() {
    await this.page.waitForLoadState('networkidle');
    await delay(1000);
  }

  // Validation-specific helpers
  async testValidation(formData, expectedError) {
    console.log(`🧪 Testing validation: expecting "${expectedError}"`);
    
    const beforeErrors = await this.getErrorMessages();
    await this.fillForm(formData);
    await this.submitForm();
    
    const afterErrors = await this.getErrorMessages();
    const newErrors = afterErrors.filter(error => !beforeErrors.includes(error));
    
    const hasExpectedError = newErrors.some(error => 
      error.toLowerCase().includes(expectedError.toLowerCase())
    );
    
    return {
      passed: hasExpectedError,
      errors: newErrors,
      expectedError
    };
  }

  async testDuplicateValidation(section, duplicateData, uniqueField) {
    console.log(`🔄 Testing duplicate ${uniqueField} validation in ${section}...`);
    
    // Navigate to section
    await this.navigateToSection(section);
    
    // Create first record
    if (await this.clickButtonByText('Add') || await this.clickButtonByText('Create') || await this.clickButtonByText('New')) {
      console.log('  📝 Creating first record...');
      await this.fillForm(duplicateData);
      await this.submitForm();
      await delay(1000);
      
      // Try to create duplicate
      if (await this.clickButtonByText('Add') || await this.clickButtonByText('Create') || await this.clickButtonByText('New')) {
        console.log(`  🔴 Creating duplicate record with same ${uniqueField}...`);
        await this.fillForm(duplicateData.map(val => val + ' DUPLICATE')); // Modify slightly except the duplicate field
        await this.submitForm();
        
        // Check for validation errors
        await delay(2000);
        const errors = await this.getErrorMessages();
        
        return {
          hasDuplicateError: errors.length > 0,
          errors: errors,
          field: uniqueField
        };
      }
    }
    
    return { hasDuplicateError: false, errors: [], field: uniqueField };
  }
}

module.exports = EstopiaTestHelpers;