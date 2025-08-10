# BUG-004: Duplicate CNP Validation Missing

**ID**: BUG-004  
**Date**: 2025-08-10  
**Status**: FIXED  
**Priority**: P1  
**Environment**: Production (https://sirbu.tplinkdns.com)  
**Reporter**: User Report + Automated Testing Protocol  

## Summary
**ORIGINAL USER REPORT**: "if you add 2 identical cnps it does not show proper message but internals error or something"

System was allowing duplicate CNP (Romanian National ID) values without proper validation.

## Technical Details

**Evidence from Production**: 
- Two clients existed with sequential CNPs: `1820807340911` and `1820807340912`
- While not identical, this indicated potential validation weaknesses

**Root Cause**: 
- ClientService.java lacked uniqueness check before database insertion
- Only database-level unique constraint existed, causing internal errors instead of user-friendly messages

## Evidence

**Production Data** (from screenshots):
```
Client 1: Damian - CNP 1820807340911
Client 2: Damian - CNP 1820807340912  
```

**Test Results**: Could not test duplicate validation due to BUG-001 blocking client creation entirely.

## Fix Applied

**Added YAVI Validation** in `ClientValidationService.java`:
```java
// Additional uniqueness validation - STD-YAVI-005
if (clientRepository.existsByNationalId(clientDTO.getNationalId())) {
    throw new ValidationException("validation.client.nationalId.unique", null);
}
```

**Message Keys Added**:
- English: "A client with this National ID already exists"  
- Romanian: "Există deja un client cu acest CNP"

## Standards Compliance

✅ **STD-YAVI-001**: Using YAVI validation framework only  
✅ **STD-YAVI-002**: Created dedicated ClientValidationService  
✅ **STD-SVC-VAL-002**: validateAndThrow() method implemented  
✅ **STD-I18N-002**: Message keys follow validation.client.nationalId.unique pattern  
✅ **STD-I18N-001**: English and Romanian support added  

## Impact
- **Severity**: HIGH - Data integrity violation  
- **Business Impact**: Prevents duplicate client records  
- **Compliance**: Ensures unique Romanian CNP requirement  

## Test Status
- ✅ Validation logic implemented in ClientValidationService
- ✅ Repository method existsByNationalId() already available
- ✅ Message keys added for both languages
- 🔄 Requires testing once BUG-001 (phone validation) is resolved

## Related Files
- `src/main/java/com/estopia/service/ClientValidationService.java` (NEW)
- `src/main/java/com/estopia/service/ClientService.java` (UPDATED)
- `src/main/resources/messages.properties` (UPDATED)
- `src/main/resources/messages_ro.properties` (UPDATED)

## Follow-up Testing Required
Once BUG-001 is resolved, test:
1. Create client with unique CNP ✅ Should succeed  
2. Attempt duplicate CNP ❌ Should show user-friendly error
3. Verify error message localization (EN/RO)