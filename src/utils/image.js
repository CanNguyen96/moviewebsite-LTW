const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export const buildImageSrc = (imageUrl, fallback = '/images/placeholder.jpg') => {
    if (!imageUrl) return fallback;
    if (/^https?:\/\//i.test(imageUrl)) return imageUrl;
    const normalizedPath = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
    return `${API_BASE_URL}${normalizedPath}`;
};
