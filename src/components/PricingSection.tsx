import React, { useState } from 'react';
import { Check, Sparkles, Zap, ArrowRight, Download, LoaderCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

export const PricingSection: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [downloads, setDownloads] = useState<{ name: string; url: string }[]>([]);
  const [paymentError, setPaymentError] = useState('');

  const readJson = async (response: Response) => {
    const text = await response.text();
    try {
      return text ? JSON.parse(text) : {};
    } catch {
      throw new Error('Payment server response नहीं मिला। `npm run dev` से दोनों servers शुरू करें।');
    }
  };

  const handleUpgrade = async () => {
    setIsLoading(true);
    setPaymentError('');
    try {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      await new Promise<void>((resolve, reject) => {
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Razorpay checkout load नहीं हुआ'));
        document.body.appendChild(script);
      });
      const orderResponse = await fetch('/api/create-order', { method: 'POST' });
      const order = await readJson(orderResponse);
      if (!orderResponse.ok) throw new Error(order.error || 'Order create नहीं हुआ');

      const Razorpay = (window as unknown as { Razorpay: new (options: Record<string, unknown>) => { open: () => void } }).Razorpay;
      const checkout = new Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: 'Kinetic UI',
        description: 'Awwwards Animation Pack — Lifetime Access',
        order_id: order.orderId,
        theme: { color: '#22d3ee' },
        handler: async (response: Record<string, string>) => {
          const verifyResponse = await fetch('/api/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(response),
          });
          const result = await readJson(verifyResponse);
          if (!verifyResponse.ok) throw new Error(result.error || 'Payment verify नहीं हुआ');
          setDownloads(result.downloads);
          confetti({ particleCount: 100, spread: 90, origin: { y: 0.6 }, colors: ['#00f2fe', '#8a2be2', '#10b981', '#f59e0b'] });
        },
      });
      checkout.open();
    } catch (error) {
      setPaymentError(error instanceof Error ? error.message : 'Payment शुरू नहीं हो सका');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="pricing" className="py-24 border-t border-white/[0.08] relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20">
            INDIA PRO ACCESS &amp; LIFETIME PASS
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white mt-4 tracking-tight">
            Level up your frontend skill
          </h2>
          <p className="text-zinc-400 text-sm mt-3">
            एक बार का भुगतान। Lifetime updates। Razorpay से UPI, कार्ड और Netbanking payment।
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="relative p-8 rounded-3xl bg-gradient-to-b from-zinc-900 to-zinc-950 border-2 border-cyan-500/40 flex flex-col justify-between shadow-2xl shadow-cyan-500/10 backdrop-blur-xl">
            <div className="absolute -top-3 right-6 px-3 py-1 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 text-zinc-950 text-[10px] font-extrabold tracking-wider uppercase shadow-lg">
              ONE-TIME ACCESS
            </div>

            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-white font-bold text-xl flex items-center gap-2">
                  <Zap className="w-5 h-5 text-cyan-400" /> Awwwards Motion Pack
                </h3>
                <span className="text-xs font-mono text-cyan-400 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">Lifetime</span>
              </div>
              <p className="text-zinc-400 text-xs mt-2">
                चारों Awwwards animation ZIP packs और lifetime updates unlock करें।
              </p>

              <div className="mt-6 flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-white">₹1,000</span>
                <span className="text-xs text-cyan-400 font-mono">एक बार का भुगतान</span>
              </div>

              <ul className="mt-8 space-y-3 text-xs text-zinc-200">
                {[
                  '300+ PRO Awwwards Components',
                  'WebGL, Three.js & GLSL Shaders',
                  'Exclusive Figma & Framer files included',
                  'Razorpay UPI, Cards & Netbanking checkout',
                  'Private GitHub Repository Access',
                  'Weekly New Component Drops',
                  'Priority 1-on-1 Support & Custom Tweaks',
                ].map((feat, i) => (
                  <li key={i} className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-cyan-400" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={handleUpgrade}
              disabled={isLoading}
              className="mt-8 w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400 hover:opacity-90 text-zinc-950 font-bold text-xs tracking-wider uppercase transition-all shadow-lg shadow-cyan-400/20 active:scale-95 flex items-center justify-center gap-2"
            >
              {isLoading ? <LoaderCircle className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>{isLoading ? 'Checkout तैयार हो रहा है…' : 'Razorpay से Pro Access लें'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            {paymentError && <p className="mt-3 text-center text-xs text-rose-400">{paymentError}</p>}
          </div>
        </div>

        {downloads.length > 0 && (
          <div className="max-w-4xl mx-auto mt-8 rounded-3xl border border-emerald-400/30 bg-emerald-400/10 p-6">
            <h3 className="text-white font-bold">Payment successful — ZIP downloads</h3>
            <p className="mt-1 text-xs text-zinc-300">इन links की validity 24 घंटे है।</p>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {downloads.map((download) => (
                <a key={download.url} href={download.url} className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-xs text-cyan-300 hover:bg-white/10">
                  <Download className="w-4 h-4" />
                  <span className="truncate">{download.name}</span>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
