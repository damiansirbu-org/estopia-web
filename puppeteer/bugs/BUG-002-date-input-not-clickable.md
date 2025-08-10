# BUG-002: Date Input Fields Not Clickable

**ID**: BUG-002  
**Date**: 2025-08-10  
**Status**: HIGH  
**Priority**: P1  
**Environment**: Production (https://sirbu.tplinkdns.com)  
**Reporter**: Automated Testing Protocol  

## Summary
Date picker components in Contract and Payment forms cannot be filled using standard input methods.

## Technical Details

**Error**: "Node is either not clickable or not an Element"  
**Affected Forms**: Contract (input 2), Payment (input 2)  
**Form Fill Success Rate**: 2/4 fields for contracts, 3/4 fields for payments  

## Evidence

**Test Logs**:
```
Contract Form:
✅ Filled input 1: Puppeteer Test Contract (text)
⚠️ Could not fill input 2: Node is either not clickable or not an Element
✅ Filled input 3: 5000.00 (text)
⚠️ Could not fill input 4: Node is either not clickable or not an Element
📝 Successfully filled 2/4 form fields

Payment Form:
✅ Filled input 1: 1500.00 (text)  
⚠️ Could not fill input 2: Node is either not clickable or not an Element
✅ Filled input 3: Monthly rent payment via Puppeteer (text)
✅ Filled input 4: Rent (text)
📝 Successfully filled 3/4 form fields
```

**Screenshots**:
- `screenshots/contract-created-1754832437409.png`
- `screenshots/payment-created-1754832444902.png`

## Root Cause
Date picker components (likely Ant Design DatePicker) require special interaction methods, not standard `.type()` calls.

## Impact
- **Severity**: HIGH - Partial form completion
- **Business Impact**: Contract and Payment creation may fail due to missing required dates
- **Testing Impact**: Automated tests cannot fully validate these entities

## Proposed Fix
Update test helpers to handle date picker components:
```javascript
// Add date picker handling in test-helpers.js
async handleDatePicker(input, dateValue) {
  const isDatePicker = await input.evaluate(el => 
    el.closest('.ant-picker') !== null);
  if (isDatePicker) {
    await input.click();
    await this.page.keyboard.type(dateValue);
    await this.page.keyboard.press('Enter');
    return true;
  }
  return false;
}
```

## Test Status
- 🔄 Requires specialized date picker interaction implementation
- 🔄 Need to identify exact date picker component type (Ant Design)
- 🔄 Update fillForm() method to handle date inputs

## Related Files
- `puppeteer/utils/test-helpers.js` (fillForm method)
- Frontend date picker components in Contract/Payment forms