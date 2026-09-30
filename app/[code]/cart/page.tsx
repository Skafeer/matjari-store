// app/[code]/cart/page.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import {
  ArrowRight, Trash2, Minus, Plus, ShoppingBag, Package,
  Check, Loader2, Phone, User, FileText, MapPin,
} from 'lucide-react';
import { api } from '@/lib/api';
import {
  loadCart, updateQuantity, removeFromCart, clearCart, getCartTotal,
} from '@/lib/cart';
import { fmt } from '@/lib/format';
import { PROVINCES, CartItem } from '@/lib/types';

const SHIPPING_BAGHDAD = 5000;
const SHIPPING_BASRA = 3000;

export default function CartPage() {
  const router = useRouter();
  const { code: rawCode } = useParams<{ code: string }>();
  const code = (rawCode || '').toUpperCase();

  const [cart, setCart] = useState<CartItem[] | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{
    orderId: number;
    totalAmount: number;
    storeName: string;
    storePhone: string;
  } | null>(null);

  const [form, setForm] = useState({
    customerName: '',
    customerPhone: '',
    backupPhone: '',
    province: '',
    address: '',
    notes: '',
  });

  // تحميل السلة
  useEffect(() => {
    if (code) setCart(loadCart(code));
  }, [code]);

  const shipping = useMemo(() => {
    if (form.province.includes('البصرة')) return SHIPPING_BASRA;
    if (form.province) return SHIPPING_BAGHDAD;
    return 0;
  }, [form.province]);

  const subtotal = useMemo(() => (cart ? cart.reduce((s, i) => s + i.price * i.quantity, 0) : 0), [cart]);
  const total = subtotal + shipping;

  const handleQty = (productId: number, qty: number) => {
    if (!cart) return;
    const next = updateQuantity(code, productId, qty);
    setCart([...next]);
  };

  const handleRemove = (productId: number) => {
    if (!cart) return;
    const next = removeFromCart(code, productId);
    setCart([...next]);
  };

  const validate = (): string | null => {
    if (!cart || cart.length === 0) return 'السلة فارغة';
    if (!form.customerName.trim() || form.customerName.trim().length < 2)
      return 'أدخل اسمك الكامل';
    if (!/^07[0-9]{9}$/.test(form.customerPhone.trim()))
      return 'رقم الهاتف يجب أن يبدأ بـ 07 ويكون 11 رقم';
    if (form.backupPhone && !/^07[0-9]{9}$/.test(form.backupPhone.trim()))
      return 'رقم الهاتف الاحتياطي غير صحيح';
    if (!form.province) return 'اختر المحافظة';
    if (!form.address.trim() || form.address.trim().length < 5)
      return 'أدخل العنوان بالتفصيل';
    return null;
  };

  const handleSubmit = async () => {
    const err = validate();
    if (err) { setError(err); return; }
    setError(null);
    setSubmitting(true);

    try {
      const payload = {
        items: cart!.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        customerName: form.customerName.trim(),
        customerPhone: form.customerPhone.trim(),
        backupPhone: form.backupPhone.trim() || undefined,
        province: form.province,
        address: form.address.trim(),
        notes: form.notes.trim() || undefined,
      };

      const { data } = await api.post(`/api/store/public/${code}/order`, payload);

      clearCart(code);
      setCart([]);
      setSuccess(data);
    } catch (e: any) {
      setError(e?.response?.data?.message || 'فشل إرسال الطلب، حاول مرة أخرى');
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Success ───
  if (success) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <div
          className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6"
          style={{ backgroundColor: 'var(--color-brand-light)' }}
        >
          <Check className="w-10 h-10" style={{ color: 'var(--color-brand)' }} strokeWidth={2.5} />
        </div>
        <h1 className="text-2xl font-black text-gray-900 mb-2">تم استلام طلبك!</h1>
        <p className="text-gray-600 mb-8 leading-relaxed">
          سنتواصل معك قريباً لتأكيد الطلب والتوصيل
        </p>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 text-right mb-6">
          <Row label="رقم الطلب" value={`#${success.orderId}`} />
          <Row label="المتجر" value={success.storeName} />
          <Row label="الإجمالي" value={`${fmt(success.totalAmount)} د.ع`} highlight />
          <Row label="هاتف المتجر" value={success.storePhone} mono />
        </div>

        <div className="flex flex-col gap-2">
          <Link
            href={`/${code}`}
            className="h-12 rounded-2xl text-white font-bold flex items-center justify-center"
            style={{ backgroundColor: 'var(--color-brand)' }}
          >
            متابعة التسوق
          </Link>
        </div>
      </div>
    );
  }

  // ─── Loading ───
  if (cart === null) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-gray-400" />
      </div>
    );
  }

  // ─── Empty ───
  if (cart.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 rounded-3xl bg-gray-100 flex items-center justify-center mx-auto mb-5">
          <ShoppingBag className="w-10 h-10 text-gray-400" strokeWidth={1.8} />
        </div>
        <h2 className="text-xl font-bold text-gray-700 mb-2">السلة فارغة</h2>
        <p className="text-gray-500 text-sm mb-6">أضف منتجات لتبدأ التسوق</p>
        <Link
          href={`/${code}`}
          className="inline-flex items-center gap-2 px-6 h-12 rounded-2xl text-white font-bold"
          style={{ backgroundColor: 'var(--color-brand)' }}
        >
          <ArrowRight className="w-4 h-4" />
          تصفح المنتجات
        </Link>
      </div>
    );
  }

  // ─── Cart ───
  return (
    <div className="max-w-4xl mx-auto px-4 py-6 md:py-10 pb-32">
      <Link
        href={`/${code}`}
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 mb-6 transition"
      >
        <ArrowRight className="w-4 h-4" />
        متابعة التسوق
      </Link>

      <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-6">سلة التسوق</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {/* ─── Left: items + form ─── */}
        <div className="md:col-span-2 space-y-4">

          {/* Items */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            {cart.map((item) => (
              <div key={item.productId} className="flex gap-3 p-3 border-b border-gray-100 last:border-0">
                <div className="w-20 h-20 rounded-xl bg-gray-50 flex-shrink-0 overflow-hidden">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-6 h-6 text-gray-300" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0 flex flex-col">
                  <h3 className="text-sm font-bold text-gray-900 line-clamp-2 mb-1">{item.name}</h3>
                  <div className="text-base font-black" style={{ color: 'var(--color-brand)' }}>
                    {fmt(item.price)} <span className="text-xs text-gray-500">د.ع</span>
                  </div>

                  <div className="flex items-center justify-between mt-auto pt-2">
                    <div className="inline-flex items-center gap-2 border border-gray-200 rounded-xl p-0.5">
                      <button
                        onClick={() => handleQty(item.productId, item.quantity - 1)}
                        className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center"
                        aria-label="نقص"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-7 text-center text-sm font-black">{item.quantity}</span>
                      <button
                        onClick={() => handleQty(item.productId, Math.min(item.stock, item.quantity + 1))}
                        disabled={item.quantity >= item.stock}
                        className="w-7 h-7 rounded-lg hover:bg-gray-100 disabled:opacity-40 flex items-center justify-center"
                        aria-label="زيادة"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => handleRemove(item.productId)}
                      className="w-8 h-8 rounded-lg hover:bg-red-50 flex items-center justify-center text-red-500 transition"
                      aria-label="حذف"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Customer info */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4 md:p-5">
            <h2 className="font-bold text-gray-900 mb-4">معلومات التوصيل</h2>

            <Field label="الاسم الكامل" icon={<User className="w-4 h-4" />}>
              <input
                type="text"
                value={form.customerName}
                onChange={(e) => setForm(f => ({ ...f, customerName: e.target.value }))}
                placeholder="مثال: أحمد محمد"
                className="w-full h-11 px-3 rounded-xl border border-gray-200 focus:border-[var(--color-brand)] focus:outline-none text-sm bg-gray-50 focus:bg-white transition"
                maxLength={100}
              />
            </Field>

            <Field label="رقم الهاتف" icon={<Phone className="w-4 h-4" />}>
              <input
                type="tel"
                inputMode="numeric"
                value={form.customerPhone}
                onChange={(e) => {
                  const v = e.target.value.replace(/[^0-9]/g, '');
                  if (v.length <= 11) setForm(f => ({ ...f, customerPhone: v }));
                }}
                placeholder="07XXXXXXXXX"
                className="w-full h-11 px-3 rounded-xl border border-gray-200 focus:border-[var(--color-brand)] focus:outline-none text-sm bg-gray-50 focus:bg-white transition"
                dir="ltr"
              />
            </Field>

            <Field label="رقم احتياطي (اختياري)" icon={<Phone className="w-4 h-4" />}>
              <input
                type="tel"
                inputMode="numeric"
                value={form.backupPhone}
                onChange={(e) => {
                  const v = e.target.value.replace(/[^0-9]/g, '');
                  if (v.length <= 11) setForm(f => ({ ...f, backupPhone: v }));
                }}
                placeholder="07XXXXXXXXX"
                className="w-full h-11 px-3 rounded-xl border border-gray-200 focus:border-[var(--color-brand)] focus:outline-none text-sm bg-gray-50 focus:bg-white transition"
                dir="ltr"
              />
            </Field>

            <Field label="المحافظة" icon={<MapPin className="w-4 h-4" />}>
              <select
                value={form.province}
                onChange={(e) => setForm(f => ({ ...f, province: e.target.value }))}
                className="w-full h-11 px-3 rounded-xl border border-gray-200 focus:border-[var(--color-brand)] focus:outline-none text-sm bg-gray-50 focus:bg-white transition"
              >
                <option value="">اختر المحافظة</option>
                {PROVINCES.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </Field>

            <Field label="العنوان بالتفصيل" icon={<MapPin className="w-4 h-4" />}>
              <textarea
                value={form.address}
                onChange={(e) => setForm(f => ({ ...f, address: e.target.value }))}
                placeholder="المنطقة، الشارع، أقرب نقطة دالة..."
                rows={3}
                maxLength={500}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-[var(--color-brand)] focus:outline-none text-sm bg-gray-50 focus:bg-white transition resize-none"
              />
            </Field>

            <Field label="ملاحظات (اختياري)" icon={<FileText className="w-4 h-4" />}>
              <textarea
                value={form.notes}
                onChange={(e) => setForm(f => ({ ...f, notes: e.target.value }))}
                placeholder="أي تفاصيل إضافية..."
                rows={2}
                maxLength={300}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-[var(--color-brand)] focus:outline-none text-sm bg-gray-50 focus:bg-white transition resize-none"
              />
            </Field>

            {error && (
              <div className="mt-3 p-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-700 font-semibold">
                {error}
              </div>
            )}
          </div>
        </div>

        {/* ─── Right: summary ─── */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 md:sticky md:top-20">
            <h2 className="font-bold text-gray-900 mb-4">ملخص الطلب</h2>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>المنتجات</span>
                <span className="font-semibold">{fmt(subtotal)} د.ع</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>التوصيل</span>
                <span className="font-semibold">
                  {shipping > 0 ? `${fmt(shipping)} د.ع` : '—'}
                </span>
              </div>
              <div className="border-t border-gray-100 pt-3 mt-3 flex justify-between items-baseline">
                <span className="font-bold text-gray-900">الإجمالي</span>
                <span className="text-xl font-black" style={{ color: 'var(--color-brand)' }}>
                  {fmt(total)} <span className="text-sm text-gray-500">د.ع</span>
                </span>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full h-14 mt-6 rounded-2xl text-white font-bold text-base flex items-center justify-center gap-2 transition disabled:opacity-70 hover:opacity-95 active:scale-[0.98]"
              style={{ backgroundColor: 'var(--color-brand)' }}
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  جاري الإرسال...
                </>
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  تأكيد الطلب
                </>
              )}
            </button>

            <p className="text-xs text-gray-400 text-center mt-3">
              الدفع عند الاستلام — سيتم التواصل معك للتأكيد
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  icon,
  children,
}: {
  label: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-3">
      <label className="flex items-center gap-1.5 text-xs font-bold text-gray-700 mb-1.5">
        {icon}
        {label}
      </label>
      {children}
    </div>
  );
}

function Row({
  label,
  value,
  highlight,
  mono,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  mono?: boolean;
}) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-500">{label}</span>
      <span
        className={`text-sm font-bold ${highlight ? 'text-lg' : ''} ${mono ? 'font-mono' : ''}`}
        style={highlight ? { color: 'var(--color-brand)' } : { color: '#111827' }}
        dir={mono ? 'ltr' : undefined}
      >
        {value}
      </span>
    </div>
  );
}