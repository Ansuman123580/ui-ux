import React, { useState, useEffect } from 'react';
import { X, Shield, FileText, RefreshCw, Truck, Mail, MapPin, Clock, Building, CheckCircle2 } from 'lucide-react';

export type PolicyTab = 'terms' | 'privacy' | 'refund' | 'shipping' | 'contact';

interface PolicyModalProps {
  initialTab?: PolicyTab;
  isOpen: boolean;
  onClose: () => void;
}

export const PolicyModal: React.FC<PolicyModalProps> = ({ initialTab = 'terms', isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<PolicyTab>(initialTab);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md">
      <div 
        className="relative w-full max-w-4xl max-h-[88vh] bg-[#0c0e14] border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-zinc-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-zinc-950/60">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-wide">OBSIDIAN MOTION • LEGAL &amp; POLICIES</h2>
              <p className="text-[11px] text-zinc-500 font-mono">Compliance &amp; Consumer Protection Policies</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-1 px-6 py-2.5 border-b border-white/[0.06] bg-zinc-900/40 overflow-x-auto text-xs font-mono">
          <button
            onClick={() => setActiveTab('terms')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'terms'
                ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-semibold'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Terms &amp; Conditions</span>
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'privacy'
                ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-semibold'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Privacy Policy</span>
          </button>
          <button
            onClick={() => setActiveTab('refund')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'refund'
                ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-semibold'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refund &amp; Cancellation</span>
          </button>
          <button
            onClick={() => setActiveTab('shipping')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'shipping'
                ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-semibold'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Shipping &amp; Delivery</span>
          </button>
          <button
            onClick={() => setActiveTab('contact')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'contact'
                ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-semibold'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Contact Us</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs sm:text-sm leading-relaxed">
          {activeTab === 'terms' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-400" />
                Terms and Conditions
              </h3>
              <p className="text-zinc-400">
                Last updated: October 2026. Welcome to <strong>Obsidian Motion</strong> (accessible at https://www.obsidianmotion.store). By purchasing or accessing our digital design assets and UI component libraries, you agree to comply with and be bound by the following Terms and Conditions.
              </p>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-3">
                <h4 className="font-semibold text-white">1. Nature of Products &amp; Services</h4>
                <p className="text-zinc-400 text-xs">
                  Obsidian Motion provides <strong>intangible digital goods</strong> comprising React UI code components, Tailwind CSS stylesheets, animation studies, motion references, and design templates for web developers and digital designers. We do not provide physical goods, cloud web hosting, or IT infrastructure services.
                </p>

                <h4 className="font-semibold text-white">2. Single-User Commercial Developer License</h4>
                <p className="text-zinc-400 text-xs">
                  Upon purchase of the Obsidian Motion Lifetime Pass (₹400 INR one-time payment), the purchaser is granted a non-exclusive, perpetual, worldwide single-developer license to:
                </p>
                <ul className="list-disc pl-5 text-xs text-zinc-400 space-y-1">
                  <li>Use the UI components and motion code in unlimited personal and commercial client websites or applications.</li>
                  <li>Modify, adapt, and customize the source code to suit project requirements.</li>
                </ul>
                <p className="text-zinc-400 text-xs mt-2">
                  <strong>Restrictions:</strong> You may not re-distribute, resell, lease, sublicense, or share the raw downloadable ZIP archives or component packages as a competing template pack or digital asset marketplace product.
                </p>

                <h4 className="font-semibold text-white">3. Pricing &amp; Payment Processing</h4>
                <p className="text-zinc-400 text-xs">
                  All transactions are charged in Indian Rupees (INR) as advertised on the checkout page. Payments are processed securely via <strong>Razorpay</strong> payment gateway with 256-bit SSL encryption. We do not capture or store your debit/credit card details, CVV, or banking credentials.
                </p>

                <h4 className="font-semibold text-white">4. Intellectual Property Rights</h4>
                <p className="text-zinc-400 text-xs">
                  All intellectual property rights, trademarks, and code repositories of Obsidian Motion remain the property of the creator (Ansuman Maharana). Your purchase conveys a license of use, not an assignment of ownership.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Shield className="w-4 h-4 text-cyan-400" />
                Privacy Policy
              </h3>
              <p className="text-zinc-400">
                Your privacy is of utmost importance to us. This Privacy Policy outlines what information Obsidian Motion collects and how it is protected.
              </p>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-3">
                <h4 className="font-semibold text-white">1. Information We Collect</h4>
                <p className="text-zinc-400 text-xs">
                  When you initiate a purchase on Obsidian Motion, we collect:
                </p>
                <ul className="list-disc pl-5 text-xs text-zinc-400 space-y-1">
                  <li><strong>Email Address:</strong> Required to deliver your licensed digital download links, order receipts, and technical update notifications.</li>
                  <li><strong>Transaction Identifiers:</strong> Razorpay Order ID and Payment ID generated upon checkout confirmation.</li>
                </ul>

                <h4 className="font-semibold text-white">2. How Your Information Is Used</h4>
                <p className="text-zinc-400 text-xs">
                  The collected information is strictly used for order fulfillment, customer support verification, generating anti-piracy secure download tokens, and sending relevant critical component updates.
                </p>

                <h4 className="font-semibold text-white">3. Payment Security &amp; Data Protection</h4>
                <p className="text-zinc-400 text-xs">
                  All payment transactions are handled through <strong>Razorpay Software Private Limited</strong>, a certified PCI-DSS Level 1 payment processor. Obsidian Motion does not store or process payment card numbers, UPI PINs, or banking passwords.
                </p>

                <h4 className="font-semibold text-white">4. Zero Data Selling</h4>
                <p className="text-zinc-400 text-xs">
                  We never sell, rent, or lease your personal information or email address to third-party advertisers or data brokers under any circumstances.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'refund' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-cyan-400" />
                Refund &amp; Cancellation Policy
              </h3>
              <p className="text-zinc-400">
                At Obsidian Motion, we stand behind the quality of our digital design assets and code libraries.
              </p>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-3">
                <h4 className="font-semibold text-white">1. Digital Products Policy</h4>
                <p className="text-zinc-400 text-xs">
                  Because our products are <strong>intangible, digitally downloadable assets and source code</strong> that are immediately accessible upon checkout, orders cannot be cancelled once digital download access has been granted.
                </p>

                <h4 className="font-semibold text-white">2. 7-Day Technical Satisfaction Guarantee</h4>
                <p className="text-zinc-400 text-xs">
                  We want you to be 100% confident in your purchase. If you experience any of the following issues:
                </p>
                <ul className="list-disc pl-5 text-xs text-zinc-400 space-y-1">
                  <li>Corrupted or broken download archive links that cannot be resolved by support.</li>
                  <li>Inability to access files after a verified successful payment.</li>
                  <li>Technical defects in source files that our team is unable to rectify within 48 hours of notification.</li>
                </ul>
                <p className="text-zinc-400 text-xs mt-2">
                  Please email our support desk at <strong className="text-cyan-300">support@obsidianmotion.store</strong> with your Razorpay Payment ID within <strong>7 days of purchase</strong>. If our technical team cannot solve the issue, a full 100% refund will be granted.
                </p>

                <h4 className="font-semibold text-white">3. Refund Processing Timeline</h4>
                <p className="text-zinc-400 text-xs">
                  Approved refunds are initiated via Razorpay back to your original payment method (Bank Account, UPI, or Credit/Debit Card) within <strong>24 to 48 hours</strong>, and reflect in your account within <strong>5 to 7 working days</strong> according to your bank&apos;s standard settlement cycle.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Truck className="w-4 h-4 text-cyan-400" />
                Shipping &amp; Delivery Policy (Digital Products)
              </h3>
              <p className="text-zinc-400">
                Obsidian Motion exclusively distributes digital software assets, React UI components, and design resources.
              </p>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-3">
                <h4 className="font-semibold text-white">1. Instant Electronic Delivery</h4>
                <p className="text-zinc-400 text-xs">
                  <strong>No physical shipments are involved.</strong> No physical parcel, CD/DVD, or printed material will be dispatched via courier or postal mail. All goods are delivered electronically.
                </p>

                <h4 className="font-semibold text-white">2. Delivery Mechanisms &amp; Timelines</h4>
                <ul className="list-disc pl-5 text-xs text-zinc-400 space-y-2">
                  <li>
                    <strong>Instant On-Screen Download:</strong> Immediately upon successful transaction confirmation through the Razorpay gateway, encrypted download links are unlocked directly on your screen (typically within 1–3 seconds).
                  </li>
                  <li>
                    <strong>Automated Email Delivery:</strong> A confirmation email containing your direct download links, order summary, and license token is automatically dispatched to the email address specified during checkout within <strong>1 to 5 minutes</strong>.
                  </li>
                </ul>

                <h4 className="font-semibold text-white">3. Delivery Fees</h4>
                <p className="text-zinc-400 text-xs">
                  Shipping and delivery fees are <strong>₹0.00 (Free)</strong> for all digital products.
                </p>

                <h4 className="font-semibold text-white">4. Support for Missing Delivery</h4>
                <p className="text-zinc-400 text-xs">
                  If you do not see the confirmation email within 10 minutes of payment (please ensure to inspect your Spam or Promotions folder), contact our support team at <strong className="text-cyan-300">support@obsidianmotion.store</strong> with your Payment ID, and we will manually re-issue your download links within 6 hours.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Mail className="w-4 h-4 text-cyan-400" />
                Contact Us &amp; Business Information
              </h3>
              <p className="text-zinc-400">
                Have questions or need technical support? We are here to help you.
              </p>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-white/5 space-y-1">
                    <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs">
                      <Building className="w-4 h-4" />
                      <span>Legal Business Name</span>
                    </div>
                    <p className="text-white text-xs font-mono">Obsidian Motion</p>
                    <p className="text-zinc-500 text-[11px]">Operated by Ansuman Maharana (Individual / Proprietor)</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-white/5 space-y-1">
                    <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs">
                      <Mail className="w-4 h-4" />
                      <span>Customer Support Email</span>
                    </div>
                    <p className="text-white text-xs font-mono">support@obsidianmotion.store</p>
                    <p className="text-zinc-500 text-[11px]">Secondary: ansumanmaharana7@gmail.com</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-white/5 space-y-1">
                    <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs">
                      <MapPin className="w-4 h-4" />
                      <span>Operational Address</span>
                    </div>
                    <p className="text-white text-xs">Bhubaneswar, Odisha, India</p>
                    <p className="text-zinc-500 text-[11px]">PIN: 751024</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-white/5 space-y-1">
                    <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs">
                      <Clock className="w-4 h-4" />
                      <span>Support Hours &amp; SLA</span>
                    </div>
                    <p className="text-white text-xs">Mon – Sat: 10:00 AM – 7:00 PM IST</p>
                    <p className="text-emerald-400 text-[11px] flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Average response time: &lt; 12 hours
                    </p>
                  </div>
                </div>

                <div className="pt-2 text-[11px] text-zinc-500 font-mono">
                  * Note: All customer inquiries regarding access keys, component usage, and payment status are answered directly by our developer support team.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-white/[0.08] bg-zinc-950/80 flex items-center justify-between text-[11px] font-mono text-zinc-500">
          <span>Obsidian Motion • Digital Software Assets</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
