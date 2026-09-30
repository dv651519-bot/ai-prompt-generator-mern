import React from 'react';
import { Sparkles, Terminal, ShieldCheck, Database, Layers } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Navbar({ serverStatus, historyCount = 0, onNavigate, activeTab }) {
  const isOnline = !!serverStatus;
  const isDbConnected = serverStatus?.database?.includes('connected') && !serverStatus?.database?.includes('disconnected');

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-[#080c14]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('generator')}>
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-500 to-fuchsia-500 shadow-lg shadow-brand-500/25">
            <Sparkles className="w-5 h-5 text-white" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-fuchsia-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-fuchsia-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                PromptForge
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20">
                MERN v1.0
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono hidden sm:block">AI Prompt Optimization Engine</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => onNavigate('generator')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'generator'
                ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            Generator
          </button>
          <button
            onClick={() => onNavigate('history')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'history'
                ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <span>History</span>
            {historyCount > 0 && (
              <span className="px-1.5 py-0.2 text-[11px] rounded-full bg-brand-500/30 text-brand-200">
                {historyCount}
              </span>
            )}
          </button>
        </nav>

        {/* System Health Indicators */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-xs font-mono">
            <span
              className={`w-2 h-2 rounded-full ${
                isOnline ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]' : 'bg-rose-500'
              }`}
            />
            <span className="text-slate-400">API:</span>
            <span className={isOnline ? 'text-emerald-400' : 'text-rose-400'}>
              {isOnline ? 'Active' : 'Offline'}
            </span>

            <span className="text-slate-700">|</span>

            <span className="text-slate-400">DB:</span>
            <span className={isDbConnected ? 'text-emerald-400' : 'text-amber-400'}>
              {isDbConnected ? 'MongoDB' : 'In-Memory'}
            </span>
          </div>

          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-xs font-medium text-slate-300 transition-colors"
          >
            <ShieldCheck className="w-4 h-4 text-brand-400" />
            <span className="hidden sm:inline">Secure Stack</span>
          </a>
        </div>
      </div>
    </header>
  );
}
