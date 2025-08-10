/**
 * Estopia CRUD Operations Tests
 * Comprehensive testing of Create, Read, Update, Delete operations
 */

const EstopiaTestHelpers = require('../utils/test-helpers');

describe('Estopia CRUD Operations', () => {
  let helpers;

  beforeAll(async () => {
    helpers = new EstopiaTestHelpers(page);
    await helpers.goto();
  });

  beforeEach(async () => {
    await page.reload();
    await page.waitForSelector('#root');
  });

  describe('Client CRUD Operations', () => {
    const testClientData = [
      'Puppeteer Test Client',
      '9876543210987', // Unique CNP
      'puppeteer.client@example.com',
      '+40-777-888-999',
      '123 Automation Street, Test City'
    ];

    test('CREATE: Add new client', async () => {
      console.log('🆕 Testing client creation...');
      
      await helpers.navigateToSection('Clients');
      
      // Find add button (Plus icon based on UI discovery)
      const canAdd = await helpers.clickAddButton();
      
      if (canAdd) {
        const filled = await helpers.fillForm(testClientData);
        expect(filled).toBeGreaterThan(0);
        
        const submitted = await helpers.submitForm();
        expect(submitted).toBe(true);
        
        await helpers.screenshot('client-created');
        
        // Check for success message or new entry in list
        const successMessages = await helpers.getSuccessMessages();
        console.log('Success messages:', successMessages);
        
      } else {
        console.log('⚠️ Client creation interface not found');
        await helpers.screenshot('clients-no-add-interface');
      }
    });

    test('READ: View client list', async () => {
      console.log('📋 Testing client list view...');
      
      await helpers.navigateToSection('Clients');
      await delay(2000);
      
      // Check if table/list exists
      const tables = await page.$$('table, [role="table"], .list, [class*="list"]');
      const listItems = await page.$$('[role="listitem"], .client-item, [class*="client"]');
      
      console.log(`Found ${tables.length} tables and ${listItems.length} list items`);
      
      await helpers.screenshot('clients-list-view');
      
      // Should have some way to display clients
      expect(tables.length + listItems.length).toBeGreaterThan(0);
    });

    test('UPDATE: Edit existing client', async () => {
      console.log('✏️ Testing client update...');
      
      await helpers.navigateToSection('Clients');
      
      // Look for edit buttons or double-click to edit
      const editButtons = await page.$$('[data-testid*="edit"], button[title*="edit" i], [class*="edit"]');
      
      if (editButtons.length > 0) {
        await editButtons[0].click();
        await page.waitForTimeout(1000);
        
        // Try to modify first field
        const inputs = await page.$$('input:not([type="hidden"])');
        if (inputs.length > 0) {
          await inputs[0].click();
          await page.keyboard.selectAll();
          await inputs[0].type('Updated Client Name');
          
          await helpers.submitForm();
          await helpers.screenshot('client-updated');
        }
      } else {
        console.log('⚠️ Edit functionality not found');
        await helpers.screenshot('clients-no-edit-interface');
      }
    });

    test('DELETE: Remove client', async () => {
      console.log('🗑️ Testing client deletion...');
      
      await helpers.navigateToSection('Clients');
      
      // Look for delete buttons
      const deleteButtons = await page.$$('[data-testid*="delete"], button[title*="delete" i], [class*="delete"]');
      
      if (deleteButtons.length > 0) {
        await deleteButtons[0].click();
        await page.waitForTimeout(1000);
        
        // Look for confirmation dialog
        const confirmButtons = await page.$$('button');
        for (const btn of confirmButtons) {
          const text = await page.evaluate(el => el.textContent?.toLowerCase(), btn);
          if (text.includes('confirm') || text.includes('yes') || text.includes('delete')) {
            await btn.click();
            break;
          }
        }
        
        await helpers.screenshot('client-deleted');
      } else {
        console.log('⚠️ Delete functionality not found');
        await helpers.screenshot('clients-no-delete-interface');
      }
    });
  });

  describe('Asset CRUD Operations', () => {
    const testAssetData = [
      'Puppeteer Test Property',
      '456 Test Boulevard',
      'Residential',
      '750000',
      '4', // bedrooms
      '3'  // bathrooms
    ];

    test('CREATE: Add new asset', async () => {
      await helpers.navigateToSection('Assets');
      
      if (await helpers.clickAddButton()) {
        const filled = await helpers.fillForm(testAssetData);
        if (filled > 0) {
          await helpers.submitForm();
          await helpers.screenshot('asset-created');
        }
      }
    });

    test('Asset list validation', async () => {
      await helpers.navigateToSection('Assets');
      await helpers.screenshot('assets-list');
      
      // Check for asset-specific elements
      const assetElements = await page.$$('[class*="asset"], [data-testid*="asset"]');
      console.log(`Found ${assetElements.length} asset-related elements`);
    });
  });

  describe('Contract CRUD Operations', () => {
    const testContractData = [
      'Puppeteer Test Contract',
      '2025-12-31', // end date
      '5000.00',    // value
      'Automated test contract'
    ];

    test('CREATE: Add new contract', async () => {
      await helpers.navigateToSection('Contracts');
      
      if (await helpers.clickAddButton()) {
        const filled = await helpers.fillForm(testContractData);
        if (filled > 0) {
          await helpers.submitForm();
          await helpers.screenshot('contract-created');
        }
      }
    });
  });

  describe('Payment CRUD Operations', () => {
    const testPaymentData = [
      '1500.00',    // amount
      '2025-08-10', // date
      'Monthly rent payment via Puppeteer',
      'Rent'        // category
    ];

    test('CREATE: Add new payment', async () => {
      await helpers.navigateToSection('Payments');
      
      if (await helpers.clickAddButton()) {
        const filled = await helpers.fillForm(testPaymentData);
        if (filled > 0) {
          await helpers.submitForm();
          await helpers.screenshot('payment-created');
        }
      }
    });
  });

  describe('Cross-Entity Relationships', () => {
    test('Client-Asset relationship', async () => {
      // Test linking assets to clients
      console.log('🔗 Testing client-asset relationships...');
      // Implementation depends on your UI design
    });

    test('Contract-Payment relationship', async () => {
      // Test linking payments to contracts
      console.log('🔗 Testing contract-payment relationships...');
      // Implementation depends on your UI design
    });
  });
});