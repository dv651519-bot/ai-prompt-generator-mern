import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toasts, onDismiss }) {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          const isError = toast.type === 'error';
          const isSuccess = toast.type === 'success';

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.9 }}
              transition={{ duration: 0.25 }}
              className={`pointer-events-auto p-3.5 rounded-xl shadow-2xl border flex items-start gap-3 backdrop-blur-xl ${
                isError
                  ? 'bg-rose-950/90 border-rose-500/40 text-rose-200'
                  : isSuccess
                  ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-200'
                  : 'bg-slate-900/95 border-slate-700/80 text-slate-200'
              }`}
            >
              <div className="mt-0.5 flex-shrink-0">
                {isError ? (
                  <AlertCircle className="w-4 h-4 text-rose-400" />
                ) : isSuccess ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Info className="w-4 h-4 text-brand-400" />
                )}
              </div>

              <div className="flex-1 text-xs leading-relaxed">
                {toast.title && <div className="font-semibold mb-0.5">{toast.title}</div>}
                <div className="text-slate-300">{toast.message}</div>
              </div>

              <button
                onClick={() => onDismiss(toast.id)}
                className="text-slate-400 hover:text-white transition-colors p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
