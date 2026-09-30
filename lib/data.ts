// lib/data.ts
import { cache } from 'react';
import { api } from './api';

export const getStorePublic = cache(async (code: string) => {
  try {
    const res = await api.get(`/api/store/public/${code.toUpperCase()}`);
    return res.data;
  } catch {
    return null;
  }
});

export const getStoreProductPublic = cache(async (code: string, productId: number) => {
  try {
    const res = await api.get(`/api/store/public/${code.toUpperCase()}/product/${productId}`);
    return res.data;
  } catch {
    return null;
  }
});