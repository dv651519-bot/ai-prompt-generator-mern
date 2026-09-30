import React from 'react';
import { Shield, Lock, Zap, Database, Terminal, Cpu } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-800/80 bg-[#060910] text-slate-400 py-12 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Security badges row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <Shield className="w-4 h-4 text-emerald-400" />
            <div>
              <p className="font-semibold text-slate-200">Helmet Protected</p>
              <p className="text-[11px] text-slate-500">Secure HTTP headers</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Lock className="w-4 h-4 text-indigo-400" />
            <div>
              <p className="font-semibold text-slate-200">Anti-NoSQL Injection</p>
              <p className="text-[11px] text-slate-500">express-mongo-sanitize</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Zap className="w-4 h-4 text-amber-400" />
            <div>
              <p className="font-semibold text-slate-200">Rate Limited (10/min)</p>
              <p className="text-[11px] text-slate-500">express-rate-limit active</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Database className="w-4 h-4 text-brand-400" />
            <div>
              <p className="font-semibold text-slate-200">MongoDB + Mongoose</p>
              <p className="text-[11px] text-slate-500">Strict schema validation</p>
            </div>
          </div>
        </div>

        {/* Bottom copyright & attribution */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-900 text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">PromptForge AI</span>
            <span>•</span>
            <span>Fullstack MERN Application</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>MongoDB</span>
            <span>•</span>
            <span>Express.js</span>
            <span>•</span>
            <span>React (Vite)</span>
            <span>•</span>
            <span>Tailwind CSS</span>
            <span>•</span>
            <span>Framer Motion</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
