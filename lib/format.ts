// lib/format.ts

/**
 * تنسيق الأرقام بأرقام لاتينية (0-9) — الأفضل للأسعار العراقية
 */
export const fmt = (n: number): string =>
  Math.round(n).toLocaleString('en-US');

/**
 * تنسيق الأرقام للعرض مع فواصل
 */
export const fmtWithCommas = (n: number): string =>
  Math.round(n).toLocaleString('en-US', { useGrouping: true });

/**
 * تنسيق التاريخ بالعربية
 */
export const formatDate = (d: string): string => {
  if (!d) return '';
  return new Date(d).toLocaleDateString('ar-IQ', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * الحصول على أول صورة من المنتج
 */
export const getFirstImage = (product: any): string | null => {
  if (!product) return null;
  const imgs = product.images ? product.images.split(',').filter(Boolean) : [];
  return imgs[0] || product.imageUrl || null;
};

/**
 * الحصول على كل صور المنتج
 */
export const getAllImages = (product: any): string[] => {
  if (!product) return [];
  const imgs = product.images ? product.images.split(',').filter(Boolean) : [];
  return imgs.length > 0 ? imgs : (product.imageUrl ? [product.imageUrl] : []);
};