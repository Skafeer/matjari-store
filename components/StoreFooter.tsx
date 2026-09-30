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
    <footer className="bg-white border-t border-gray-100 mt-12">
      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Store name */}
        <div className="text-center mb-6">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3"
            style={{ backgroundColor: 'var(--color-brand-light)' }}
          >
            <ShoppingBag
              className="w-6 h-6"
              style={{ color: 'var(--color-brand)' }}
              strokeWidth={2}
            />
          </div>
          <h3 className="font-bold text-gray-800 mb-1">{store.name}</h3>
          {store.description && (
            <p className="text-xs text-gray-500 max-w-md mx-auto leading-relaxed">
              {store.description}
            </p>
          )}
        </div>

        {/* Phone */}
        {store.phone && (
          <a
            href={`tel:${store.phone}`}
            className="flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition mb-4"
            dir="ltr"
          >
            <Phone className="w-4 h-4" />
            <span className="font-mono">{store.phone}</span>
          </a>
        )}

        {/* Social */}
        {hasSocial && (
          <div className="flex items-center justify-center gap-3 mb-6">
            {instagramUrl && (
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center hover:bg-pink-100 transition"
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
                className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center hover:bg-blue-100 transition"
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
                className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition"
                aria-label="TikTok"
              >
                <TikTokIcon className="w-5 h-5 text-gray-900" />
              </a>
            )}
          </div>
        )}

        {/* Bottom */}
        <div className="pt-6 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} {store.name} — جميع الحقوق محفوظة
          </p>
          <p className="text-[10px] text-gray-300 mt-1">
            مدعوم بواسطة متجري
          </p>
        </div>
      </div>
    </footer>
  );
}