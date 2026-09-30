import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Wand2, Send, CornerDownLeft, Lightbulb, Trash2 } from 'lucide-react';
import PersonaSelector, { PERSONAS } from './PersonaSelector';

const TONES = [
  'Comprehensive & Actionable',
  'Direct & Technical',
  'Creative & Inspiring',
  'Persuasive & Engaging',
  'Academic & Analytical',
];

const OUTPUT_FORMATS = [
  'Structured Markdown',
  'System Prompt',
  'Step-by-Step Guide',
  'JSON Specification',
];

export default function PromptForm({
  topic,
  setTopic,
  persona,
  setPersona,
  tone,
  setTone,
  outputFormat,
  setOutputFormat,
  onSubmit,
  isLoading,
  error,
}) {
  const textareaRef = useRef(null);

  // Auto-expand textarea height as user types
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(
        Math.max(textareaRef.current.scrollHeight, 100),
        320
      )}px`;
    }
  }, [topic]);

  // Handle Ctrl+Enter to submit
  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      if (!isLoading && topic.trim().length >= 3) {
        onSubmit(e);
      }
    }
  };

  const currentPersonaObj = PERSONAS.find((p) => p.id === persona);

  const applySampleTopic = () => {
    if (currentPersonaObj?.sample) {
      setTopic(currentPersonaObj.sample);
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-5 sm:p-7 border border-slate-800/80 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-72 h-72 bg-brand-500/5 rounded-full blur-3xl pointer-events-none" />

      <form onSubmit={onSubmit} className="space-y-6">
        {/* Step 1: Persona Selection */}
        <PersonaSelector selectedPersona={persona} onSelectPersona={setPersona} />

        {/* Step 2: Base Topic Input with Auto-Expanding Textarea */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="topic-input" className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Step 2: Define Your Core Topic or Challenge
            </label>
            <div className="flex items-center gap-3">
              {currentPersonaObj?.sample && (
                <button
                  type="button"
                  onClick={applySampleTopic}
                  className="flex items-center gap-1 text-xs text-brand-400 hover:text-brand-300 transition-colors"
                >
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span>Try sample</span>
                </button>
              )}
              {topic && (
                <button
                  type="button"
                  onClick={() => setTopic('')}
                  className="flex items-center gap-1 text-xs text-slate-400 hover:text-rose-400 transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Clear</span>
                </button>
              )}
            </div>
          </div>

          <div className="relative">
            <textarea
              id="topic-input"
              ref={textareaRef}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`e.g., Explain the core architecture of Kafka, or ${currentPersonaObj?.sample || 'Explain event-driven architecture...'}`}
              maxLength={500}
              rows={3}
              className="w-full glass-input rounded-xl p-4 text-sm sm:text-base text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-brand-500/50 resize-none font-sans"
              disabled={isLoading}
            />
            <div className="absolute bottom-3 right-3 flex items-center gap-2 text-[11px] text-slate-500 font-mono">
              <span className={topic.length >= 450 ? 'text-amber-400 font-bold' : ''}>
                {topic.length}/500
              </span>
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2"
            >
              <span>⚠️</span>
              <span>{error}</span>
            </motion.div>
          )}
        </div>

        {/* Step 3: Customization Options (Tone & Output Format) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1 border-t border-slate-800/80">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Operational Tone
            </label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full glass-input rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-200 bg-slate-900/90 cursor-pointer"
              disabled={isLoading}
            >
              {TONES.map((t) => (
                <option key={t} value={t} className="bg-slate-900 text-slate-200">
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Deliverable Format
            </label>
            <select
              value={outputFormat}
              onChange={(e) => setOutputFormat(e.target.value)}
              className="w-full glass-input rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-200 bg-slate-900/90 cursor-pointer"
              disabled={isLoading}
            >
              {OUTPUT_FORMATS.map((f) => (
                <option key={f} value={f} className="bg-slate-900 text-slate-200">
                  {f}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Submit Action */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <div className="text-xs text-slate-400 flex items-center gap-1.5 font-mono order-2 sm:order-1">
            <CornerDownLeft className="w-3.5 h-3.5 text-slate-400" />
            <span>Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">Enter</kbd> to optimize</span>
          </div>

          <motion.button
            type="submit"
            disabled={isLoading || topic.trim().length < 3}
            whileHover={!isLoading && topic.trim().length >= 3 ? { scale: 1.02 } : {}}
            whileTap={!isLoading && topic.trim().length >= 3 ? { scale: 0.98 } : {}}
            className={`w-full sm:w-auto order-1 sm:order-2 px-6 py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-lg transition-all ${
              isLoading || topic.trim().length < 3
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
                : 'bg-gradient-to-r from-brand-600 via-indigo-600 to-fuchsia-600 hover:from-brand-500 hover:to-fuchsia-500 text-white shadow-brand-500/25 border border-brand-400/30'
            }`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Synthesizing Prompt...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4 text-white" />
                <span>Generate Optimized Prompt</span>
              </>
            )}
          </motion.button>
        </div>
      </form>
    </div>
  );
}
