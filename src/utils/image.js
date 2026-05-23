const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export const buildImageSrc = (imageUrl, fallback = '/images/placeholder.jpg') => {
    if (!imageUrl) return fallback;
    if (/^https?:\/\//i.test(imageUrl)) return imageUrl;
    const normalizedPath = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
    return `${API_BASE_URL}${normalizedPath}`;
};

export const getAvatarSrc = (avatar) => {
    if (!avatar) return "/images/default-avatar.png";
    if (avatar.startsWith("http") || avatar.startsWith("blob")) return avatar;
    const normalizedPath = avatar.startsWith('/') ? avatar : `/${avatar}`;
    return `${API_BASE_URL}${normalizedPath}`;
};
