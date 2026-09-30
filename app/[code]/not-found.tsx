// app/[code]/not-found.tsx
import Link from 'next/link';
import { Store, Home } from 'lucide-react';

export default function StoreNotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-3xl bg-gray-100 flex items-center justify-center mx-auto mb-6">
          <Store className="w-10 h-10 text-gray-400" strokeWidth={1.8} />
        </div>
        <h1 className="text-2xl font-black text-gray-800 mb-3">
          المتجر غير موجود
        </h1>
        <p className="text-gray-500 text-sm leading-relaxed mb-8">
          قد يكون الرابط غير صحيح، أو المتجر معطّل حالياً.
          <br />
          تأكد من الرابط وحاول مرة أخرى.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-bold text-sm transition"
          style={{ backgroundColor: '#0c6679' }}
        >
          <Home className="w-4 h-4" />
          العودة للرئيسية
        </Link>
      </div>
    </div>
  );
}