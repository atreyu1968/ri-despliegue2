import { customAlphabet } from 'nanoid';

// Configurable lengths for different types of codes
const REGISTRATION_CODE_LENGTH = 8;
const RECOVERY_CODE_LENGTH = 6;

// Custom alphabets for readable codes (no similar-looking characters)
const REGISTRATION_ALPHABET = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
const RECOVERY_ALPHABET = '0123456789';

// Create nanoid generators with custom alphabets
const generateRegistrationId = customAlphabet(REGISTRATION_ALPHABET, REGISTRATION_CODE_LENGTH);
const generateRecoveryId = customAlphabet(RECOVERY_ALPHABET, RECOVERY_CODE_LENGTH);

export const generateRegistrationCode = () => generateRegistrationId();
export const generateRecoveryCode = () => generateRecoveryId();