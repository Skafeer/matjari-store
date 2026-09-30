// app/[code]/cart/page.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import {
  ArrowRight, Trash2, Minus, Plus, ShoppingBag, Package,
  Check, Loader2, Phone, User, FileText, MapPin, AlertCircle,
} from 'lucide-react';
import { api } from '@/lib/api';
import {
  loadCart, updateQuantity, removeFromCart, clearCart,
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

  // Load cart
  useEffect(() => {
    if (code) setCart(loadCart(code));
  }, [code]);

  // Shipping cost
  const shipping = useMemo(() => {
    if (form.province.includes('البصرة')) return SHIPPING_BASRA;
    if (form.province) return SHIPPING_BAGHDAD;
    return 0;
  }, [form.province]);

  const subtotal = useMemo(
    () => (cart ? cart.reduce((s, i) => s + i.price * i.quantity, 0) : 0),
    [cart]
  );
  const total = subtotal + shipping;
  const totalItems = useMemo(
    () => (cart ? cart.reduce((s, i) => s + i.quantity, 0) : 0),
    [cart]
  );

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
    if (err) {
      setError(err);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setError(null);
    setSubmitting(true);

    try {
      const payload = {
        items: cart!.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
        })),
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
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e: any) {
      setError(e?.response?.data?.message || 'فشل إرسال الطلب، حاول مرة أخرى');
    } finally {
      setSubmitting(false);
    }
  };

  // ═══════════════════════════════════════════
  // ── Success State ──
  // ═══════════════════════════════════════════
  if (success) {
    return (
      <div className="mx-auto w-full max-w-lg px-6 md:px-8 py-16 md:py-20 text-center">
        <div
          className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 animate-scale-in"
          style={{ backgroundColor: 'var(--color-brand-light)' }}
        >
          <Check
            className="w-10 h-10"
            style={{ color: 'var(--color-brand)' }}
            strokeWidth={2.5}
          />
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 tracking-tight">
          تم استلام طلبك!
        </h1>
        <p className="text-sm text-gray-500 mb-8 leading-relaxed max-w-sm mx-auto">
          سنتواصل معك قريباً لتأكيد الطلب والتوصيل
        </p>

        <div className="bg-white rounded-2xl p-5 md:p-6 border border-gray-100 text-right mb-6 space-y-1">
          <SuccessRow label="رقم الطلب" value={`#${success.orderId}`} />
          <SuccessRow label="المتجر" value={success.storeName} />
          <SuccessRow
            label="الإجمالي"
            value={`${fmt(success.totalAmount)} د.ع`}
            highlight
          />
          <SuccessRow label="هاتف المتجر" value={success.storePhone} mono />
        </div>

        <Link
          href={`/${code}`}
          className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-xl text-white font-bold text-sm transition-all hover:opacity-95 active:scale-[0.98] shadow-[0_6px_16px_-6px_rgba(12,102,121,0.5)]"
          style={{ backgroundColor: 'var(--color-brand)' }}
        >
          <ShoppingBag className="w-4 h-4" />
          متابعة التسوق
        </Link>
      </div>
    );
  }

  // ═══════════════════════════════════════════
  // ── Loading ──
  // ═══════════════════════════════════════════
  if (cart === null) {
    return (
      <div className="mx-auto w-full max-w-lg px-6 py-20 text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-gray-400" />
      </div>
    );
  }

  // ═══════════════════════════════════════════
  // ── Empty Cart ──
  // ═══════════════════════════════════════════
  if (cart.length === 0) {
    return (
      <div className="mx-auto w-full max-w-lg px-6 md:px-8 py-16 md:py-20 text-center animate-fade-in">
        <div className="w-24 h-24 rounded-3xl bg-gray-100 flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="w-12 h-12 text-gray-400" strokeWidth={1.5} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">
          سلة التسوق فارغة
        </h2>
        <p className="text-sm text-gray-500 mb-7 max-w-sm mx-auto leading-relaxed">
          أضف منتجات لتبدأ التسوق من {`المتجر`}
        </p>
        <Link
          href={`/${code}`}
          className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-xl text-white font-bold text-sm transition-all hover:opacity-95 active:scale-[0.98]"
          style={{ backgroundColor: 'var(--color-brand)' }}
        >
          <ArrowRight className="w-4 h-4" />
          تصفح المنتجات
        </Link>
      </div>
    );
  }

  // ═══════════════════════════════════════════
  // ── Cart ──
  // ═══════════════════════════════════════════
  return (
    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 md:px-8 pt-6 md:pt-8 pb-20 md:pb-24">

      {/* ── Back ── */}
      <Link
        href={`/${code}`}
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 mb-6 md:mb-8 transition group"
      >
        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
        متابعة التسوق
      </Link>

      {/* ── Title ── */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
          سلة التسوق
        </h1>
        <p className="text-sm text-gray-500 mt-1 tabular-nums">
          {totalItems} {totalItems === 1 ? 'منتج' : 'منتجات'}
        </p>
      </div>

      {/* ── Error Banner ── */}
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 flex items-start gap-3 animate-fade-in">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-red-800">حدث خطأ</p>
            <p className="text-xs text-red-700 mt-0.5">{error}</p>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6 md:gap-8 items-start">

        {/* ═══════════════════════════════════════════ */}
        {/* ── Left — Items + Form ── */}
        {/* ═══════════════════════════════════════════ */}
        <div className="md:col-span-2 space-y-4 md:space-y-6">

          {/* ── Cart Items ── */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">

            {/* Header */}
            <div className="px-4 md:px-5 py-3.5 border-b border-gray-100">
              <h2 className="text-sm font-bold text-gray-900">
                المنتجات
              </h2>
            </div>

            {/* Items List */}
            <div className="divide-y divide-gray-100">
              {cart.map((item) => (
                <div
                  key={item.productId}
                  className="flex gap-3 md:gap-4 p-3.5 md:p-4"
                >
                  {/* Image */}
                  <Link
                    href={`/${code}/product/${item.productId}`}
                    className="flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-xl bg-gray-50 overflow-hidden border border-gray-100 hover:border-gray-200 transition"
                  >
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-contain p-1.5"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-6 h-6 text-gray-300" />
                      </div>
                    )}
                  </Link>

                  {/* Content */}
                  <div className="flex-1 min-w-0 flex flex-col">
                    <Link
                      href={`/${code}/product/${item.productId}`}
                      className="text-[13px] md:text-sm font-semibold text-gray-900 line-clamp-2 leading-snug mb-1.5 hover:opacity-80 transition"
                    >
                      {item.name}
                    </Link>

                    <div className="text-base md:text-lg font-bold text-gray-900 tabular-nums leading-none mb-auto">
                      {fmt(item.price)}
                      <span className="text-[11px] text-gray-500 font-medium mr-1">
                        {' '}د.ع
                      </span>
                    </div>

                    {/* Actions Row */}
                    <div className="flex items-center justify-between gap-2 mt-3">
                      {/* Qty Controls */}
                      <div className="inline-flex items-center gap-1 border border-gray-200 rounded-lg p-0.5">
                        <button
                          onClick={() => handleQty(item.productId, item.quantity - 1)}
                          className="w-7 h-7 rounded-md hover:bg-gray-100 flex items-center justify-center transition active:scale-90 disabled:opacity-40"
                          aria-label="إنقاص الكمية"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-7 text-center text-sm font-bold tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            handleQty(
                              item.productId,
                              Math.min(item.stock, item.quantity + 1)
                            )
                          }
                          disabled={item.quantity >= item.stock}
                          className="w-7 h-7 rounded-md hover:bg-gray-100 flex items-center justify-center transition active:scale-90 disabled:opacity-40"
                          aria-label="زيادة الكمية"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Remove */}
                      <button
                        onClick={() => handleRemove(item.productId)}
                        className="inline-flex items-center gap-1 text-xs font-medium text-gray-400 hover:text-red-600 transition"
                        aria-label="حذف المنتج"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        حذف
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Customer Info Form ── */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4 md:p-5">
            <h2 className="text-sm font-bold text-gray-900 mb-4 md:mb-5">
              معلومات التوصيل
            </h2>

            <div className="space-y-4">
              <FormField
                label="الاسم الكامل"
                required
                icon={<User className="w-3.5 h-3.5" />}
              >
                <input
                  type="text"
                  value={form.customerName}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, customerName: e.target.value }))
                  }
                  placeholder="مثال: أحمد محمد"
                  maxLength={100}
                  className="w-full h-11 px-3.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 focus:outline-none focus:border-[var(--color-brand)] focus:bg-white focus:ring-4 focus:ring-[color:var(--color-brand)]/10 transition-all"
                  dir="rtl"
                />
              </FormField>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  label="رقم الهاتف"
                  required
                  icon={<Phone className="w-3.5 h-3.5" />}
                >
                  <input
                    type="tel"
                    inputMode="numeric"
                    value={form.customerPhone}
                    onChange={(e) => {
                      const v = e.target.value.replace(/[^0-9]/g, '');
                      if (v.length <= 11)
                        setForm((f) => ({ ...f, customerPhone: v }));
                    }}
                    placeholder="07XXXXXXXXX"
                    className="w-full h-11 px-3.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 focus:outline-none focus:border-[var(--color-brand)] focus:bg-white focus:ring-4 focus:ring-[color:var(--color-brand)]/10 transition-all font-mono tabular-nums"
                    dir="ltr"
                  />
                </FormField>

                <FormField
                  label="رقم احتياطي"
                  hint="(اختياري)"
                  icon={<Phone className="w-3.5 h-3.5" />}
                >
                  <input
                    type="tel"
                    inputMode="numeric"
                    value={form.backupPhone}
                    onChange={(e) => {
                      const v = e.target.value.replace(/[^0-9]/g, '');
                      if (v.length <= 11)
                        setForm((f) => ({ ...f, backupPhone: v }));
                    }}
                    placeholder="07XXXXXXXXX"
                    className="w-full h-11 px-3.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 focus:outline-none focus:border-[var(--color-brand)] focus:bg-white focus:ring-4 focus:ring-[color:var(--color-brand)]/10 transition-all font-mono tabular-nums"
                    dir="ltr"
                  />
                </FormField>
              </div>

              <FormField
                label="المحافظة"
                required
                icon={<MapPin className="w-3.5 h-3.5" />}
              >
                <select
                  value={form.province}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, province: e.target.value }))
                  }
                  className="w-full h-11 px-3.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 focus:outline-none focus:border-[var(--color-brand)] focus:bg-white focus:ring-4 focus:ring-[color:var(--color-brand)]/10 transition-all appearance-none cursor-pointer"
                  dir="rtl"
                >
                  <option value="">اختر المحافظة</option>
                  {PROVINCES.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField
                label="العنوان بالتفصيل"
                required
                icon={<MapPin className="w-3.5 h-3.5" />}
              >
                <textarea
                  value={form.address}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, address: e.target.value }))
                  }
                  placeholder="المنطقة، الشارع، أقرب نقطة دالة..."
                  rows={3}
                  maxLength={500}
                  className="w-full px-3.5 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 focus:outline-none focus:border-[var(--color-brand)] focus:bg-white focus:ring-4 focus:ring-[color:var(--color-brand)]/10 transition-all resize-none"
                  dir="rtl"
                />
              </FormField>

              <FormField
                label="ملاحظات"
                hint="(اختياري)"
                icon={<FileText className="w-3.5 h-3.5" />}
              >
                <textarea
                  value={form.notes}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, notes: e.target.value }))
                  }
                  placeholder="أي تفاصيل إضافية..."
                  rows={2}
                  maxLength={300}
                  className="w-full px-3.5 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 focus:outline-none focus:border-[var(--color-brand)] focus:bg-white focus:ring-4 focus:ring-[color:var(--color-brand)]/10 transition-all resize-none"
                  dir="rtl"
                />
              </FormField>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════ */}
        {/* ── Right — Order Summary ── */}
        {/* ═══════════════════════════════════════════ */}
        <div className="md:col-span-1 md:sticky md:top-24">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 md:p-6">
            <h2 className="text-sm font-bold text-gray-900 mb-4">
              ملخص الطلب
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">المنتجات</span>
                <span className="font-semibold text-gray-900 tabular-nums">
                  {fmt(subtotal)} د.ع
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-500">التوصيل</span>
                <span className="font-semibold text-gray-900 tabular-nums">
                  {shipping > 0 ? `${fmt(shipping)} د.ع` : '—'}
                </span>
              </div>

              <div className="pt-3 mt-3 border-t border-gray-100 flex justify-between items-baseline">
                <span className="font-bold text-gray-900">الإجمالي</span>
                <span
                  className="text-xl md:text-2xl font-bold tabular-nums tracking-tight"
                  style={{ color: 'var(--color-brand)' }}
                >
                  {fmt(total)}
                  <span className="text-xs text-gray-500 font-medium mr-1">
                    {' '}د.ع
                  </span>
                </span>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full h-12 mt-6 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-70 hover:opacity-95 active:scale-[0.98] shadow-[0_6px_16px_-6px_rgba(12,102,121,0.5)]"
              style={{ backgroundColor: 'var(--color-brand)' }}
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  جاري الإرسال...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" strokeWidth={3} />
                  تأكيد الطلب
                </>
              )}
            </button>

            <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
              <TrustRow
                icon={<ShieldIcon />}
                text="الدفع عند الاستلام"
              />
              <TrustRow
                icon={<TruckIcon />}
                text="توصيل لجميع المحافظات"
              />
              <TrustRow
                icon={<PhoneIcon />}
                text="سنتواصل معك للتأكيد"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// ── Sub Components ──
// ═══════════════════════════════════════════
function FormField({
  label,
  required,
  hint,
  icon,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-xs font-bold text-gray-700 mb-1.5">
        {icon}
        {label}
        {required && <span className="text-red-500">*</span>}
        {hint && <span className="text-gray-400 font-normal">{hint}</span>}
      </label>
      {children}
    </div>
  );
}

function SuccessRow({
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
      <span className="text-xs text-gray-500">{label}</span>
      <span
        className={`text-sm font-bold ${highlight ? 'text-lg' : ''} ${
          mono ? 'font-mono' : ''
        } tabular-nums`}
        style={highlight ? { color: 'var(--color-brand)' } : { color: '#111827' }}
        dir={mono ? 'ltr' : undefined}
      >
        {value}
      </span>
    </div>
  );
}

function TrustRow({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2 text-xs text-gray-500">
      <div
        className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: 'var(--color-brand-light)', color: 'var(--color-brand)' }}
      >
        {icon}
      </div>
      <span>{text}</span>
    </div>
  );
}

function ShieldIcon() {
  return (
    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function TruckIcon() {
  return (
    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="3" width="15" height="13" />
      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}