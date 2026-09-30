import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Copy,
  Check,
  Bookmark,
  BookmarkCheck,
  Download,
  Share2,
  Sparkles,
  Layers,
  Clock,
  Hash,
  Eye,
  Code2,
} from 'lucide-react';

export default function PromptOutput({ promptData, onSave, isSaving, isSaved }) {
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState('raw'); // 'raw' or 'preview'

  if (!promptData) return null;

  const {
    topic,
    persona,
    personaTitle,
    tone,
    outputFormat,
    generatedPrompt,
    tokensEstimate,
    tags = [],
    generatedAt,
  } = promptData;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedPrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([generatedPrompt], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `prompt-${persona.toLowerCase()}-${Date.now()}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 25, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="glass-panel rounded-2xl border border-slate-700/80 shadow-2xl relative overflow-hidden backdrop-blur-xl"
    >
      {/* Decorative gradient top bar */}
      <div className="h-1.5 w-full bg-gradient-to-r from-brand-500 via-indigo-500 to-fuchsia-500" />

      {/* Header bar */}
      <div className="p-4 sm:p-6 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-4 bg-slate-900/40">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-brand-500/15 text-brand-400 border border-brand-500/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider font-semibold px-2 py-0.5 rounded-md bg-brand-500/20 text-brand-300 border border-brand-500/30">
                {persona}
              </span>
              <span className="text-xs text-slate-400 font-mono hidden sm:inline">•</span>
              <span className="text-xs text-slate-300 font-medium hidden sm:inline">
                {personaTitle}
              </span>
            </div>
            <h3 className="text-sm font-semibold text-white mt-0.5 line-clamp-1">
              {topic}
            </h3>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 ml-auto">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-900/80 p-0.5 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setViewMode('raw')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors ${
                viewMode === 'raw'
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Prompt</span>
            </button>
            <button
              onClick={() => setViewMode('preview')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors ${
                viewMode === 'preview'
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview</span>
            </button>
          </div>

          {/* Download Button */}
          <button
            onClick={handleDownload}
            title="Download Prompt as Markdown (.md)"
            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-300 transition-colors"
          >
            <Download className="w-4 h-4" />
          </button>

          {/* Save to History Button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onSave}
            disabled={isSaving || isSaved}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              isSaved
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-slate-800/90 hover:bg-slate-700 text-slate-200 border-slate-700'
            }`}
          >
            {isSaved ? (
              <>
                <BookmarkCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Saved</span>
              </>
            ) : (
              <>
                <Bookmark className="w-3.5 h-3.5 text-brand-400" />
                <span>{isSaving ? 'Saving...' : 'Save Prompt'}</span>
              </>
            )}
          </motion.button>

          {/* Copy to Clipboard Button with animated Checkmark */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleCopy}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-md transition-all ${
              copied
                ? 'bg-emerald-600 text-white shadow-emerald-500/30'
                : 'bg-brand-600 hover:bg-brand-500 text-white shadow-brand-500/30'
            }`}
          >
            <AnimatePresence mode="wait" initial={false}>
              {copied ? (
                <motion.span
                  key="copied"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  className="flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span>Copied!</span>
                </motion.span>
              ) : (
                <motion.span
                  key="copy"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  className="flex items-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Prompt</span>
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* Main Prompt Body */}
      <div className="p-4 sm:p-6">
        {viewMode === 'raw' ? (
          <div className="relative">
            <pre className="font-mono text-xs sm:text-sm text-slate-200 leading-relaxed bg-[#0b0f19] p-4 sm:p-5 rounded-xl border border-slate-800/90 overflow-x-auto whitespace-pre-wrap selection:bg-brand-600/40">
              {generatedPrompt}
            </pre>
          </div>
        ) : (
          <div className="bg-[#0b0f19] p-4 sm:p-6 rounded-xl border border-slate-800/90 prose prose-invert max-w-none text-xs sm:text-sm leading-relaxed text-slate-300">
            {generatedPrompt.split('\n\n').map((paragraph, index) => {
              if (paragraph.startsWith('### ')) {
                return (
                  <h3
                    key={index}
                    className="text-sm font-bold text-brand-300 mt-4 mb-2 pb-1 border-b border-slate-800"
                  >
                    {paragraph.replace('### ', '')}
                  </h3>
                );
              }
              if (paragraph.startsWith('---')) {
                return <hr key={index} className="my-4 border-slate-800" />;
              }
              return (
                <p key={index} className="my-2 whitespace-pre-line text-slate-300">
                  {paragraph}
                </p>
              );
            })}
          </div>
        )}

        {/* Prompt Metadata Footer */}
        <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1 px-2 py-1 rounded bg-slate-900 border border-slate-800 font-mono">
              <Hash className="w-3 h-3 text-brand-400" />
              <span>~{tokensEstimate} estimated tokens</span>
            </span>

            <span className="flex items-center gap-1 px-2 py-1 rounded bg-slate-900 border border-slate-800">
              <Layers className="w-3 h-3 text-indigo-400" />
              <span>Format: {outputFormat}</span>
            </span>

            <span className="flex items-center gap-1 px-2 py-1 rounded bg-slate-900 border border-slate-800">
              <span>Tone: {tone}</span>
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-brand-500/10 text-brand-300 border border-brand-500/20"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
