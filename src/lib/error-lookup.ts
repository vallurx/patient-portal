const errorLookupTable = {
    EMAIL_NOT_FOUND: 'We didn\'t recognize your email. If you don\'t have an account, please register with us.',
    INVALID_PASSWORD: 'Your password is incorrect.',
    EMAIL_ALREADY_CONFIRMED: 'Your email has already been confirmed. Redirecting to your dashboard...',
    EMAIL_UNCONFIRMED: 'Your email has not been confirmed yet. Please check your email to login.',
};

export type ErrorTypes = keyof typeof errorLookupTable;

export const getError = (error: ErrorTypes) => {
    return errorLookupTable[error];
}