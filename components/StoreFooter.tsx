// components/StoreFooter.tsx
import { Phone, ShoppingBag } from 'lucide-react';
import { InstagramIcon, FacebookIcon, TikTokIcon } from './BrandIcons';
import { Store } from '@/lib/types';

function normalizeSocialUrl(handle: string, base: string): string {
  if (!handle) return '';
  if (handle.startsWith('http://') || handle.startsWith('https://')) return handle;
  const clean = handle.replace(/^@/, '').trim();
  return `${base}${clean}`;
}

export default function StoreFooter({ store }: { store: Store }) {
  const instagramUrl = normalizeSocialUrl(store.instagram, 'https://instagram.com/');
  const facebookUrl = normalizeSocialUrl(store.facebook, 'https://facebook.com/');
  const tiktokUrl = normalizeSocialUrl(store.tiktok, 'https://tiktok.com/@');
  const hasSocial = instagramUrl || facebookUrl || tiktokUrl;

  return (
    <footer className="bg-white border-t border-gray-100 mt-20 md:mt-28">
      <div className="max-w-6xl mx-auto px-5 md:px-6 py-10 md:py-14">

        {/* ─── Store Identity ─── */}
        <div className="text-center mb-8 md:mb-10">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm"
            style={{ backgroundColor: 'var(--color-brand-light)' }}
          >
            <ShoppingBag
              className="w-7 h-7"
              style={{ color: 'var(--color-brand)' }}
              strokeWidth={1.8}
            />
          </div>
          <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 tracking-tight">
            {store.name}
          </h3>
          {store.description && (
            <p className="text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
              {store.description}
            </p>
          )}
        </div>

        {/* ─── Contact ─── */}
        <div className="flex flex-col items-center gap-4 mb-8 md:mb-10">
          {/* Phone */}
          {store.phone && (
            <a
              href={`tel:${store.phone}`}
              className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-100 transition-all duration-200 group"
              dir="ltr"
            >
              <Phone className="w-4 h-4 text-gray-500 group-hover:text-gray-900 transition" />
              <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 font-mono tabular-nums transition">
                {store.phone}
              </span>
            </a>
          )}

          {/* Social */}
          {hasSocial && (
            <div className="flex items-center gap-2.5">
              {instagramUrl && (
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-xl bg-pink-50 flex items-center justify-center hover:bg-pink-100 hover:scale-105 active:scale-95 transition-all duration-200"
                  aria-label="Instagram"
                >
                  <InstagramIcon className="w-5 h-5 text-pink-600" />
                </a>
              )}

              {facebookUrl && (
                <a
                  href={facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center hover:bg-blue-100 hover:scale-105 active:scale-95 transition-all duration-200"
                  aria-label="Facebook"
                >
                  <FacebookIcon className="w-5 h-5 text-blue-600" />
                </a>
              )}

              {tiktokUrl && (
                <a
                  href={tiktokUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 hover:scale-105 active:scale-95 transition-all duration-200"
                  aria-label="TikTok"
                >
                  <TikTokIcon className="w-5 h-5 text-gray-900" />
                </a>
              )}
            </div>
          )}
        </div>

        {/* ─── Bottom ─── */}
        <div className="pt-6 md:pt-8 border-t border-gray-100">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-right">
            <p className="text-xs text-gray-400 tabular-nums">
              © {new Date().getFullYear()} {store.name} — جميع الحقوق محفوظة
            </p>
            <p className="text-[11px] text-gray-400 flex items-center gap-1.5">
              <span>مدعوم بواسطة</span>
              <span className="font-bold" style={{ color: 'var(--color-brand)' }}>
                بازاري
              </span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}