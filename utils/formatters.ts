/**
 * Text formatting and normalization utilities
 */

/**
 * Normalizes text by removing accents and converting to lowercase
 */
export const normalizeText = (text: string): string => {
    return text
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();
};

/**
 * Capitalizes first letter of each word
 */
export const titleCase = (text: string): string => {
    return text
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

/**
 * Truncates text to specified length with ellipsis
 */
export const truncate = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength - 3) + '...';
};

/**
 * Formats time ago (e.g., "2h ago", "5m ago")
 */
export const formatTimeAgo = (dateString: string): string => {
    const now = new Date();
    const date = new Date(dateString);
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    const intervals = {
        año: 31536000,
        mes: 2592000,
        semana: 604800,
        día: 86400,
        hora: 3600,
        minuto: 60
    };

    for (const [name, secondsInInterval] of Object.entries(intervals)) {
        const interval = Math.floor(seconds / secondsInInterval);
        if (interval >= 1) {
            return interval === 1
                ? `Hace 1 ${name}`
                : `Hace ${interval} ${name}s`;
        }
    }

    return 'Hace un momento';
};

/**
 * Formats date to readable Spanish format
 */
export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    return date.toLocaleDateString('es-CL', options);
};

/**
 * Pluralizes a word based on count
 */
export const pluralize = (
    count: number,
    singular: string,
    plural: string
): string => {
    return count === 1 ? singular : plural;
};

/**
 * Generates initials from name
 */
export const getInitials = (name: string): string => {
    return name
        .split(' ')
        .map(word => word.charAt(0).toUpperCase())
        .slice(0, 2)
        .join('');
};

/**
 * Formats number with thousands separator
 */
export const formatNumber = (num: number): string => {
    return num.toLocaleString('es-CL');
};

/**
 * Generates a slug from text
 */
export const slugify = (text: string): string => {
    return normalizeText(text)
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
};
