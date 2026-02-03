/**
 * Validation utilities for IurisAcademy
 */

/**
 * Validates email format
 */
export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
};

/**
 * Validates password strength
 * Requirements: min 8 characters
 */
export const validatePassword = (password: string): boolean => {
    return password.length >= 8;
};

/**
 * Validates password with detailed requirements
 */
export const validatePasswordStrength = (password: string): {
    isValid: boolean;
    errors: string[];
} => {
    const errors: string[] = [];

    if (password.length < 8) {
        errors.push('La contraseña debe tener al menos 8 caracteres');
    }

    if (!/[A-Z]/.test(password)) {
        errors.push('Debe incluir al menos una mayúscula');
    }

    if (!/[a-z]/.test(password)) {
        errors.push('Debe incluir al menos una minúscula');
    }

    if (!/[0-9]/.test(password)) {
        errors.push('Debe incluir al menos un número');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

/**
 * Sanitizes user input by removing dangerous characters
 */
export const sanitizeInput = (input: string): string => {
    return input
        .trim()
        .replace(/[<>]/g, '') // Remove < and >
        .replace(/javascript:/gi, '') // Remove javascript: protocol
        .replace(/on\w+=/gi, ''); // Remove event handlers
};

/**
 * Validates concept ID format (e.g., DC-TL-001)
 */
export const validateConceptId = (id: string): boolean => {
    const conceptIdRegex = /^[A-Z]{2}-[A-Z]{2}-\d{3}$/;
    return conceptIdRegex.test(id);
};

/**
 * Validates that a string is not empty or only whitespace
 */
export const isNotEmpty = (value: string): boolean => {
    return value.trim().length > 0;
};

/**
 * Validates string length
 */
export const validateLength = (
    value: string,
    min: number,
    max: number
): boolean => {
    const length = value.trim().length;
    return length >= min && length <= max;
};

/**
 * Validates Chilean RUT format
 */
export const validateRUT = (rut: string): boolean => {
    // Remove dots and hyphens
    const cleanRut = rut.replace(/[.-]/g, '');

    // Check format
    if (!/^\d{7,8}[0-9Kk]$/.test(cleanRut)) {
        return false;
    }

    const body = cleanRut.slice(0, -1);
    const verifier = cleanRut.slice(-1).toUpperCase();

    // Calculate verifier
    let sum = 0;
    let multiplier = 2;

    for (let i = body.length - 1; i >= 0; i--) {
        sum += parseInt(body[i]) * multiplier;
        multiplier = multiplier === 7 ? 2 : multiplier + 1;
    }

    const expectedVerifier = 11 - (sum % 11);
    const calculatedVerifier = expectedVerifier === 11 ? '0' : expectedVerifier === 10 ? 'K' : expectedVerifier.toString();

    return verifier === calculatedVerifier;
};

/**
 * Validates URL format
 */
export const validateURL = (url: string): boolean => {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
};

/**
 * Formats validation error messages
 */
export const formatValidationError = (field: string, error: string): string => {
    return `${field}: ${error}`;
};
