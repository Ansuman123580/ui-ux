import React, { useState } from 'react';
import { Check, Sparkles, Zap, ArrowRight, Download, LoaderCircle, Mail, ExternalLink, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

interface DownloadItem {
  name: string;
  url: string;
}

export const PricingSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [downloads, setDownloads] = useState<DownloadItem[]>([]);
  const [paymentError, setPaymentError] = useState('');
  const [deliveryInfo, setDeliveryInfo] = useState<{ sent: boolean; target: string; message?: string } | null>(null);

  const readJson = async (response: Response) => {
    const text = await response.text();
    try {
      return text ? JSON.parse(text) : {};
    } catch {
      throw new Error('Payment server response नहीं मिला। कृपया सुनिश्चित करें कि backend server सक्रिय है।');
    }
  };

  const validateEmail = (val: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
  };

  const handleUpgrade = async () => {
    if (!validateEmail(email)) {
      setPaymentError('कृपया मान्य Email Address दर्ज करें ताकि files आपके इनबॉक्स में डिलीवर की जा सकें।');
      return;
    }

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
        name: 'Obsidian Motion',
        description: 'Obsidian Motion Pack — ₹400 Lifetime Access',
        order_id: order.orderId,
        prefill: {
          email: email.trim(),
        },
        notes: {
          customer_email: email.trim(),
        },
        theme: { color: '#00f2fe' },
        handler: async (response: Record<string, string>) => {
          try {
            setIsLoading(true);
            const verifyResponse = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ ...response, email: email.trim() }),
            });
            const result = await readJson(verifyResponse);
            if (!verifyResponse.ok) throw new Error(result.error || 'Payment verification failed');
            
            setDownloads(result.downloads || []);
            setDeliveryInfo({
              sent: result.emailSent,
              target: result.emailTarget || email.trim(),
              message: result.mailStatus?.reason,
            });

            confetti({
              particleCount: 120,
              spread: 100,
              origin: { y: 0.6 },
              colors: ['#00f2fe', '#8a2be2', '#10b981', '#f59e0b'],
            });
          } catch (err) {
            setPaymentError(err instanceof Error ? err.message : 'Verification me samasya aayi');
          } finally {
            setIsLoading(false);
          }
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
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-gradient-to-tr from-cyan-500/10 via-purple-600/10 to-transparent rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-mono uppercase tracking-widest mb-4">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Special Verification Pass</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Unlock Full Awwwards Motion Pack
          </h2>
          <p className="text-zinc-400 text-sm mt-3 leading-relaxed">
            Razorpay payment verification test. Payment karte hi files screen aur aapke email par bhej di jayengi.
          </p>
        </div>

        <div className="max-w-xl mx-auto">
          <div className="relative p-8 rounded-3xl bg-zinc-950/80 border border-cyan-500/30 flex flex-col justify-between shadow-2xl shadow-cyan-500/10 backdrop-blur-2xl">
            <div className="absolute -top-3.5 right-6 px-3.5 py-1 rounded-full bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 text-zinc-950 text-[10px] font-black tracking-wider uppercase shadow-md flex items-center gap-1.5">
              <Zap className="w-3 h-3 fill-current" />
              <span>80% OFF • LIMITED TIME DEAL</span>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-white font-extrabold text-2xl flex items-center gap-2.5">
                  <span className="p-2 rounded-xl bg-cyan-400/10 border border-cyan-400/20 text-cyan-400">
                    <Zap className="w-5 h-5" />
                  </span>
                  Full Animation Vault
                </h3>
                <span className="text-xs font-mono text-cyan-300 px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                  Lifetime Pass
                </span>
              </div>
              <p className="text-zinc-400 text-xs mt-3 leading-relaxed">
                296+ Awwwards Motion references, 8+ live physics components, source code, and full Google Drive archive.
              </p>

              <div className="mt-6 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-baseline justify-between">
                <div>
                  <div className="flex items-baseline gap-2.5">
                    <span className="text-4xl sm:text-5xl font-black text-white tracking-tight">₹400</span>
                    <span className="text-sm sm:text-base text-zinc-500 font-mono line-through decoration-rose-500/80 decoration-2">₹2,000</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono font-bold">
                      SAVE 80%
                    </span>
                  </div>
                  <span className="text-[11px] text-cyan-400 font-mono mt-1 block">
                    एक बार का भुगतान • Lifetime updates included
                  </span>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    <ShieldCheck className="w-3 h-3" /> Razorpay Verified
                  </span>
                </div>
              </div>

              {/* Email Delivery Field */}
              <div className="mt-6">
                <label htmlFor="delivery-email" className="block text-xs font-mono text-zinc-300 mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-cyan-400" />
                    Delivery Email Address <span className="text-cyan-400">*</span>
                  </span>
                  <span className="text-[10px] text-zinc-500">Google Drive &amp; files sent here</span>
                </label>
                <div className="relative">
                  <input
                    id="delivery-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setPaymentError(''); }}
                    placeholder="name@gmail.com"
                    className="w-full px-4 py-3 rounded-xl bg-zinc-900/90 border border-white/10 text-white text-xs font-mono placeholder:text-zinc-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all shadow-inner"
                  />
                </div>
                <p className="mt-1.5 text-[11px] text-zinc-500 font-mono">
                  Payment hone ke baad download link isi email par bhej diya jayega.
                </p>
              </div>

              <ul className="mt-6 space-y-2.5 text-xs text-zinc-300">
                {[
                  '296+ Awwwards Motion Videos & Source files',
                  'Instant Google Drive Cloud Mirror link delivered',
                  'React 19 + Tailwind + Framer Motion components',
                  'Commercial license for client & personal projects',
                  'Verified through Razorpay UPI, Cards & Netbanking',
                ].map((feat, i) => (
                  <li key={i} className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={handleUpgrade}
              disabled={isLoading}
              className="mt-8 w-full py-4 rounded-xl bg-gradient-to-r from-cyan-400 via-teal-400 to-indigo-400 hover:opacity-95 text-zinc-950 font-black text-xs tracking-wider uppercase transition-all shadow-lg shadow-cyan-400/25 active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <LoaderCircle className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>₹400 me Pro Access lein (Razorpay)</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {paymentError && (
              <div className="mt-3.5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-mono text-center">
                {paymentError}
              </div>
            )}
          </div>
        </div>

        {/* Post-Payment Downloads & Delivery Confirmation */}
        {downloads.length > 0 && (
          <div className="max-w-2xl mx-auto mt-10 rounded-3xl border border-emerald-400/30 bg-emerald-950/20 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-emerald-400/10 border border-emerald-400/20 text-emerald-400 flex-shrink-0">
                <Check className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-400 font-bold">
                  PAYMENT VERIFIED • ACCESS UNLOCKED
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
                  Aapki files ready hain! 🎉
                </h3>
                
                {deliveryInfo?.sent ? (
                  <p className="mt-2 text-xs text-emerald-300/90 leading-relaxed font-mono">
                    ✅ Confirmation mail &amp; download access link <strong>{deliveryInfo.target}</strong> par bhej diya gaya hai (inbox &amp; spam folder check karein).
                  </p>
                ) : (
                  <p className="mt-2 text-xs text-zinc-300 leading-relaxed font-mono">
                    ⚡ Instant access links ready hain! Aap direct niche diye gaye links se files download kar sakte hain:
                  </p>
                )}

                <div className="mt-3.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] font-mono leading-relaxed flex items-start gap-2">
                  <span className="text-sm">🔒</span>
                  <div>
                    <strong>Anti-Piracy Protected:</strong> Yeh links aapke email se locked hain aur maximum <strong>3 baar hi download</strong> kiye ja sakte hain (24h validity). Kisi ke sath link share na karein, 3 downloads ke baad link permanently deactivate ho jayega.
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  {downloads.map((item, idx) => (
                    <a
                      key={idx}
                      href={item.url}
                      target={item.url.startsWith('http') ? '_blank' : undefined}
                      rel={item.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="flex items-center justify-between p-3.5 rounded-xl border border-white/10 bg-black/40 hover:bg-white/10 text-cyan-300 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <Download className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-semibold text-zinc-200 group-hover:text-white">
                          {item.name}
                        </span>
                      </div>
                      <ExternalLink className="w-4 h-4 text-zinc-500 group-hover:text-cyan-400 transition-colors" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
