import React from 'react';
import { HelpCircle } from 'lucide-react';

export default function Tooltip({ text }: { text: string }) {
  return (
    <div className="relative group inline-flex items-center ml-1 z-[60]">
      <HelpCircle className="w-3.5 h-3.5 text-[var(--color-brand-400)] hover:text-[var(--color-gold)] cursor-help transition-colors" />
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-56 p-2.5 bg-[var(--color-brand-800)] text-[var(--color-brand-100)] text-xs rounded-xl shadow-2xl z-[70] text-center border border-[var(--color-gold)]/20 leading-relaxed font-normal normal-case tracking-normal shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
        {text}
        {/* Arrow */}
        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent border-t-[var(--color-brand-800)]"></div>
      </div>
    </div>
  );
}
