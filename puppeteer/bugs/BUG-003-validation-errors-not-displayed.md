# BUG-003: Validation Errors Not Displayed to Users

**ID**: BUG-003  
**Date**: 2025-08-10  
**Status**: MEDIUM  
**Priority**: P2  
**Environment**: Production (https://sirbu.tplinkdns.com)  
**Reporter**: Automated Testing Protocol  

## Summary
Backend validation errors (400 status) are not properly displayed in the frontend UI, causing poor user experience.

## Technical Details

**Observed Behavior**: 
- Backend returns 400 with ValidationException
- Frontend shows no visible error messages to user
- Test framework detects console errors but UI appears "successful"

**Expected Behavior**:
- Validation errors should display as field-level error messages
- Form should remain in edit mode until validation passes
- User should see clear, localized error messages

## Evidence

**Console Logs**:
```
🔴 Page Error: Failed to load resource: the server responded with a status of 400 ()
🔴 Page Error: [WARNING] Client validation failed
✅ Form submitted via Check button  [INCORRECT - should show errors]
```

**Test Results**:
- All entity creation shows 400 validation errors in console
- No visible error messages in UI screenshots
- Forms appear to "succeed" despite backend rejecting data

**Screenshots**:
- `screenshots/client-created-1754832562140.png` - No visible error messages
- All entity creation screenshots show clean UI despite validation failures

## Root Cause
Frontend error handling not properly parsing ValidationException responses from backend.

## Impact
- **Severity**: MEDIUM - Functional but poor UX
- **User Experience**: Users don't understand why data isn't saving
- **Business Impact**: Users may think system is broken or unreliable
- **Support Impact**: Increased support requests due to unclear error states

## Investigation Needed

1. **Frontend Error Handling**: Check how ValidationException from backend is processed
2. **Error Display Components**: Verify if error message components exist and are working
3. **GlobalExceptionMapper**: Ensure backend is returning proper field-level errors

**Files to Check**:
- Frontend: `src/utils/errors/AxiosErrorHandler.ts`
- Frontend: `src/components/generic/EntityList.tsx` error display
- Backend: `src/main/java/com/estopia/exception/GlobalExceptionMapper.java`

## Proposed Fix

**Frontend**: Enhance error message display in EntityList component
```typescript
// Display validation errors from backend response
if (error.response?.data?.fieldErrors) {
  setFieldErrors(error.response.data.fieldErrors);
}
```

**Backend**: Ensure GlobalExceptionMapper returns structured field errors
```java
// Return field errors in proper format for frontend
return Response.status(400)
  .entity(ErrorResponse.builder()
    .fieldErrors(fieldErrorList)
    .build())
  .build();
```

## Test Status
- 🔄 Requires frontend error handling investigation
- 🔄 Backend error response format verification needed
- 🔄 End-to-end error display testing required

## Related Files
- `src/utils/errors/AxiosErrorHandler.ts`
- `src/components/generic/EntityList.tsx`
- `src/main/java/com/estopia/exception/GlobalExceptionMapper.java`