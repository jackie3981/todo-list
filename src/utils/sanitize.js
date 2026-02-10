import DOMPurify from 'dompurify';

/**
 * Sanitize text input to prevent XSS attacks
 * @param {string} input - El texto a sanitizar
 * @returns {string} - Texto sanitizado
 */
export function sanitizeText(input) {
    if (typeof input !== 'string') {
        return '';
    }

    // Strict sanitization: remove any HTML tags and attributes, but keep the text content
    const sanitized = DOMPurify.sanitize(input.trim(), {
        ALLOWED_TAGS: [],      // No permitir ningún tag HTML
        ALLOWED_ATTR: [],      // No permitir ningún atributo
        KEEP_CONTENT: true,    // Mantener el contenido de texto
    });

    return sanitized;
}

/**
 * Sanitize email input to prevent XSS attacks
 * @param {string} email - El email a sanitizar
 * @returns {string} - Email sanitizado
 */
export function sanitizeEmail(email) {
    if (typeof email !== 'string') {
        return '';
    }

    const sanitized = DOMPurify.sanitize(email.trim(), {
        ALLOWED_TAGS: [],
        ALLOWED_ATTR: [],
    });

    return sanitized;
}

/**
 * Sanitize search term input to prevent XSS attacks
 * @param {string} searchTerm - Search term to sanitize
 * @returns {string} - Sanitized search term
 */
export function sanitizeSearchTerm(searchTerm) {
    if (typeof searchTerm !== 'string') {
        return '';
    }

    const sanitized = DOMPurify.sanitize(searchTerm.trim(), {
        ALLOWED_TAGS: [],
        ALLOWED_ATTR: [],
        KEEP_CONTENT: true,
    });

    return sanitized;
}