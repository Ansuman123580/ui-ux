import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FAQS = [
  {
    q: "How does this compare to other component libraries?",
    a: "Unlike typical libraries that only give you static cards or videos, Kinetic UI focuses specifically on high-end award-winning interactions (spring physics, cursor-reactive spotlights, WebGL shaders, 3D tilt, and holographic borders) that make modern websites feel truly premium."
  },
  {
    q: "Can I use these components in commercial client projects?",
    a: "Yes! 100%. Once you copy the code or install via CLI, it belongs in your codebase. You can use it in unlimited client projects, SaaS products, and personal websites with zero attribution required."
  },
  {
    q: "Do I need to install any heavy bloated runtime?",
    a: "No. The components are built with standard React and Tailwind CSS. The motion physics rely on lightweight Framer Motion, ensuring 60FPS fluid animations without impacting your Core Web Vitals."
  },
  {
    q: "How do I install components into my project?",
    a: "You can either copy and paste the clean React / Tailwind / CSS code straight from the component code inspector, or use our upcoming CLI tool: 'npx kinetic-ui add <component-name>'."
  }
];

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-20 border-t border-white/[0.08] relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20">
            COMMON QUESTIONS
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-4">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div 
                key={idx}
                className="rounded-2xl bg-zinc-950/60 border border-white/[0.08] overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 text-sm font-semibold text-white hover:text-cyan-300 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-cyan-400' : ''}`} />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-zinc-400 leading-relaxed border-t border-white/[0.04] pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
