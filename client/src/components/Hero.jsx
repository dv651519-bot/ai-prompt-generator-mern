import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-6 pb-8 sm:pt-10 sm:pb-10 text-center">
      {/* Ambient background glows */}
      <div className="ambient-glow-purple top-[-100px] left-1/2 -translate-x-1/2" />
      <div className="ambient-glow-blue top-[100px] left-[20%] opacity-40" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6">
        {/* Animated Badge */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/25 text-brand-300 text-xs sm:text-sm font-medium mb-5 backdrop-blur-md shadow-inner"
        >
          <Sparkles className="w-3.5 h-3.5 text-brand-400 animate-pulse" />
          <span>Next-Generation AI Prompt Engineering</span>
          <span className="w-1 h-1 rounded-full bg-brand-400" />
          <span className="text-slate-400">Production MERN Architecture</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-5 leading-tight sm:leading-[1.15]"
        >
          Transform Basic Ideas into{' '}
          <span className="bg-gradient-to-r from-brand-400 via-indigo-300 to-fuchsia-400 bg-clip-text text-transparent">
            Elite AI System Prompts
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto mb-4 font-normal leading-relaxed"
        >
          Stop writing vague prompts. Select a battle-tested persona, input your core topic, and let our synthesis engine inject reasoning guardrails, role priming, and structured output formatting.
        </motion.p>
      </div>
    </section>
  );
}

