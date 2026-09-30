// lib/cart.ts
import { CartItem } from './types';

const getCartKey = (storeCode: string) => `matjari_cart_${storeCode}`;

export function loadCart(storeCode: string): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(getCartKey(storeCode));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCart(storeCode: string, cart: CartItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(getCartKey(storeCode), JSON.stringify(cart));
    // ✅ أطلق حدث ليتحدّث عدّاد السلة في الهيدر
    window.dispatchEvent(new Event('cart-updated'));
  } catch {}
}

export function addToCart(storeCode: string, item: CartItem): CartItem[] {
  const cart = loadCart(storeCode);
  const existing = cart.findIndex((c) => c.productId === item.productId);
  if (existing >= 0) {
    cart[existing].quantity += item.quantity;
  } else {
    cart.push(item);
  }
  saveCart(storeCode, cart);
  return cart;
}

export function setCartItem(storeCode: string, item: CartItem): CartItem[] {
  const cart = loadCart(storeCode).filter((c) => c.productId !== item.productId);
  cart.push(item);
  saveCart(storeCode, cart);
  return cart;
}

export function updateQuantity(storeCode: string, productId: number, quantity: number): CartItem[] {
  let cart = loadCart(storeCode);
  if (quantity <= 0) {
    cart = cart.filter((c) => c.productId !== productId);
  } else {
    const item = cart.find((c) => c.productId === productId);
    if (item) item.quantity = quantity;
  }
  saveCart(storeCode, cart);
  return cart;
}

export function removeFromCart(storeCode: string, productId: number): CartItem[] {
  const cart = loadCart(storeCode).filter((c) => c.productId !== productId);
  saveCart(storeCode, cart);
  return cart;
}

export function clearCart(storeCode: string): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(getCartKey(storeCode));
}

export function getCartCount(storeCode: string): number {
  return loadCart(storeCode).reduce((sum, item) => sum + item.quantity, 0);
}

export function getCartTotal(storeCode: string): number {
  return loadCart(storeCode).reduce((sum, item) => sum + item.price * item.quantity, 0);
}

