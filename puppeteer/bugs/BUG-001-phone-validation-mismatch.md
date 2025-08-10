# BUG-001: Phone Number Validation Format Mismatch

**ID**: BUG-001  
**Date**: 2025-08-10  
**Status**: CRITICAL  
**Priority**: P0  
**Environment**: Production (https://sirbu.tplinkdns.com)  
**Reporter**: Automated Testing Protocol  

## Summary
Backend validation expects domestic phone format but frontend sends international format, causing all client creation to fail.

## Technical Details

**Frontend Input**: `+40-777-888-999`  
**Backend Pattern**: `^0\\d{9}$` (expects: `0777888999`)  
**Result**: ValidationException - "Phone number must be 10 digits starting with 0"

## Evidence

**Test Log**:
```
✅ Filled input 4: +40-777-888-999 (text)
🔴 Page Error: Client validation failed
🔴 Page Error: [WARNING] Client validation failed
```

**Screenshots**: 
- `screenshots/client-created-1754832562140.png`
- `screenshots/clients-section-1754832556654.png`

## Root Cause
ClientValidationService.java line 32: Pattern mismatch between frontend international format and backend domestic format.

## Impact
- **Severity**: CRITICAL - No clients can be created
- **Business Impact**: Complete data entry failure
- **User Experience**: Internal validation errors instead of helpful messages

## Fix Applied
Updated backend validation pattern to accept both formats:
```java
.pattern("^(\\+40-\\d{3}-\\d{3}-\\d{3}|0\\d{9})$")
```

## Test Status
- ✅ Pattern updated in ClientValidationService
- ✅ Message keys updated with new format description  
- 🔄 Requires backend restart and re-testing

## Related Files
- `src/main/java/com/estopia/service/ClientValidationService.java`
- `src/main/resources/messages.properties`
- `src/main/resources/messages_ro.properties`