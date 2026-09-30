// lib/colors.ts
import { StoreColor } from './types';

export interface ColorSet {
  hex: string;
  dark: string;
  light: string;
  name: string;
}

export const COLORS: Record<StoreColor, ColorSet> = {
  primary: { hex: '#0c6679', dark: '#0a5361', light: '#e8f4f7', name: 'تركوازي' },
  emerald: { hex: '#10b981', dark: '#059669', light: '#d1fae5', name: 'أخضر' },
  blue:    { hex: '#3b82f6', dark: '#2563eb', light: '#dbeafe', name: 'أزرق' },
  purple:  { hex: '#8b5cf6', dark: '#7c3aed', light: '#ede9fe', name: 'بنفسجي' },
  rose:    { hex: '#f43f5e', dark: '#e11d48', light: '#ffe4e6', name: 'وردي' },
  amber:   { hex: '#f59e0b', dark: '#d97706', light: '#fef3c7', name: 'ذهبي' },
  orange:  { hex: '#f97316', dark: '#ea580c', light: '#ffedd5', name: 'برتقالي' },
  teal:    { hex: '#14b8a6', dark: '#0d9488', light: '#ccfbf1', name: 'فيروزي' },
  indigo:  { hex: '#6366f1', dark: '#4f46e5', light: '#e0e7ff', name: 'نيلي' },
  pink:    { hex: '#ec4899', dark: '#db2777', light: '#fce7f3', name: 'زهر' },
  cyan:    { hex: '#06b6d4', dark: '#0891b2', light: '#cffafe', name: 'سماوي' },
  slate:   { hex: '#475569', dark: '#334155', light: '#e2e8f0', name: 'رمادي' },
};

export function getColor(key: string | undefined): ColorSet {
  return COLORS[(key as StoreColor) || 'primary'] || COLORS.primary;
}