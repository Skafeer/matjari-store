import Link from 'next/link';
import { Store, ArrowLeft, Sparkles, Shield, Zap } from 'lucide-react';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0c6679] via-[#0a5361] to-[#0c6679] flex items-center justify-center p-6">
      <div className="w-full max-w-lg text-center">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <div className="w-20 h-20 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
            <Store className="w-10 h-10 text-white" strokeWidth={1.8} />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-black text-white mb-3">متجري</h1>
        <p className="text-white/70 text-base mb-12 leading-relaxed max-w-sm mx-auto">
          منصة المتاجر الإلكترونية الأولى في العراق
        </p>

        {/* Features */}
        <div className="grid grid-cols-3 gap-3 mb-12">
          <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 flex flex-col items-center gap-2">
            <Zap className="w-6 h-6 text-amber-300" strokeWidth={2} />
            <span className="text-white text-xs font-semibold">سريع</span>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 flex flex-col items-center gap-2">
            <Shield className="w-6 h-6 text-emerald-300" strokeWidth={2} />
            <span className="text-white text-xs font-semibold">آمن</span>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 flex flex-col items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-300" strokeWidth={2} />
            <span className="text-white text-xs font-semibold">مجاني</span>
          </div>
        </div>

        {/* Info */}
        <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-6 mb-8">
          <p className="text-white/90 text-sm leading-relaxed">
            هل لديك رابط متجر من تطبيق <strong className="font-bold">تسليم</strong>؟
            <br />
            افتح الرابط مباشرة للبدء بالتسوق
          </p>
        </div>

        {/* Footer */}
        <p className="text-white/40 text-xs mt-12">
          © 2026 متجري — جميع الحقوق محفوظة
        </p>
      </div>
    </main>
  );
}