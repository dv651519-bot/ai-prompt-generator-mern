import React from 'react';
import { motion } from 'framer-motion';

export default function SkeletonLoader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="glass-panel rounded-2xl border border-slate-800 p-5 sm:p-7 shadow-2xl relative overflow-hidden backdrop-blur-xl"
    >
      {/* Top Header Placeholder */}
      <div className="flex items-center justify-between pb-5 border-b border-slate-800/80 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-800 animate-shimmer" />
          <div className="space-y-2">
            <div className="w-24 h-4 rounded bg-slate-800 animate-shimmer" />
            <div className="w-48 h-3 rounded bg-slate-800/70 animate-shimmer" />
          </div>
        </div>
        <div className="flex gap-2">
          <div className="w-24 h-8 rounded-lg bg-slate-800 animate-shimmer" />
          <div className="w-28 h-8 rounded-lg bg-slate-800 animate-shimmer" />
        </div>
      </div>

      {/* Body Lines Placeholder */}
      <div className="space-y-4">
        <div className="h-4 w-3/4 rounded bg-slate-800/80 animate-shimmer" />
        <div className="h-4 w-full rounded bg-slate-800/60 animate-shimmer" />
        <div className="h-4 w-5/6 rounded bg-slate-800/70 animate-shimmer" />

        <div className="py-2">
          <div className="h-5 w-1/3 rounded bg-slate-800 animate-shimmer mb-2" />
          <div className="h-3.5 w-full rounded bg-slate-800/50 animate-shimmer" />
          <div className="h-3.5 w-4/5 rounded bg-slate-800/50 animate-shimmer mt-2" />
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/60 space-y-2.5">
          <div className="h-3.5 w-2/3 rounded bg-slate-800 animate-shimmer" />
          <div className="h-3.5 w-full rounded bg-slate-800/60 animate-shimmer" />
          <div className="h-3.5 w-3/4 rounded bg-slate-800/60 animate-shimmer" />
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-800/60">
          <div className="flex gap-2">
            <div className="h-6 w-20 rounded bg-slate-800 animate-shimmer" />
            <div className="h-6 w-24 rounded bg-slate-800 animate-shimmer" />
          </div>
          <div className="h-4 w-32 rounded bg-slate-800/50 animate-shimmer" />
        </div>
      </div>
    </motion.div>
  );
}
