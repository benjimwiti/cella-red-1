# Remove Verification Component from Auth Flow

## Tasks
- [ ] Update AuthFlow.tsx to remove verification step and adjust flow
- [ ] Update EmailStep.tsx step numbers (3 -> 2 for signup)
- [ ] Update ProfileSetupStep.tsx step numbers and back navigation
- [ ] Remove VerificationStep.tsx file (no longer needed)
- [ ] Test the updated auth flow

## Current Flow
Signup: Email -> Verification -> Profile -> Success
Login: Email -> Password -> Success

## New Flow
Signup: Email -> Profile -> Success
Login: Email -> Password -> Success
