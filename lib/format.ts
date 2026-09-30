// lib/format.ts
export const fmt = (n: number) => Math.round(n).toLocaleString('en-US');

export const formatDate = (d: string) => {
  if (!d) return '';
  return new Date(d).toLocaleDateString('ar-IQ', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const getFirstImage = (product: any): string | null => {
  if (!product) return null;
  const imgs = product.images ? product.images.split(',').filter(Boolean) : [];
  return imgs[0] || product.imageUrl || null;
};

export const getAllImages = (product: any): string[] => {
  if (!product) return [];
  const imgs = product.images ? product.images.split(',').filter(Boolean) : [];
  return imgs.length > 0 ? imgs : (product.imageUrl ? [product.imageUrl] : []);
};