import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Clock,
  Copy,
  Check,
  Trash2,
  Inbox,
  RefreshCw,
  ArrowUpRight,
  Search,
  Sparkles,
  Layers,
} from 'lucide-react';

export default function HistoryFeed({
  historyItems = [],
  isLoading = false,
  onRefresh,
  onSelectPrompt,
  onDeletePrompt,
}) {
  const [copiedId, setCopiedId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPersonaFilter, setSelectedPersonaFilter] = useState('ALL');

  // Copy prompt handler
  const handleCopy = async (id, promptText) => {
    if (!promptText) return;
    try {
      await navigator.clipboard.writeText(promptText);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  // Safe date formatter with guaranteed no-throw
  const formatDate = (dateString) => {
    if (!dateString) return 'Recently';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Recently';
      return date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (e) {
      return 'Recently';
    }
  };

  // Safe array of valid items
  const validItems = useMemo(() => {
    if (!Array.isArray(historyItems)) return [];
    return historyItems.filter((item) => item && typeof item === 'object');
  }, [historyItems]);

  // Unique list of personas for quick filter pills
  const availablePersonas = useMemo(() => {
    const set = new Set();
    validItems.forEach((it) => {
      if (it.persona) set.add(it.persona);
    });
    return Array.from(set);
  }, [validItems]);

  // Filtered items by search query and persona
  const filteredItems = useMemo(() => {
    return validItems.filter((item) => {
      const topic = (item.topic || '').toLowerCase();
      const prompt = (item.generatedPrompt || '').toLowerCase();
      const persona = (item.persona || '').toLowerCase();
      const query = searchQuery.trim().toLowerCase();

      const matchesSearch = !query || topic.includes(query) || prompt.includes(query) || persona.includes(query);
      const matchesPersona = selectedPersonaFilter === 'ALL' || item.persona === selectedPersonaFilter;

      return matchesSearch && matchesPersona;
    });
  }, [validItems, searchQuery, selectedPersonaFilter]);

  return (
    <div className="space-y-6">
      {/* Header and Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2.5">
            <Clock className="w-6 h-6 text-brand-400" />
            <span>Prompt History Feed</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-brand-500/20 text-brand-300 font-mono font-semibold border border-brand-500/30">
              {validItems.length} {validItems.length === 1 ? 'Prompt' : 'Prompts'}
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            All generated and saved prompts are automatically cataloged here for quick reuse.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-xs font-medium text-slate-200 transition-all shadow-sm active:scale-95"
              title="Refresh from server"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-brand-400' : 'text-slate-400'}`} />
              <span>Refresh</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar (shown when there are items) */}
      {validItems.length > 0 && (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search prompts by keyword, topic, persona..."
              className="w-full glass-input rounded-xl pl-9 pr-4 py-2 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-brand-500/40"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          {/* Persona Filter Pills */}
          {availablePersonas.length > 1 && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none text-xs">
              <button
                onClick={() => setSelectedPersonaFilter('ALL')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  selectedPersonaFilter === 'ALL'
                    ? 'bg-brand-500/25 text-brand-300 border border-brand-500/40'
                    : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                All ({validItems.length})
              </button>
              {availablePersonas.map((p) => (
                <button
                  key={p}
                  onClick={() => setSelectedPersonaFilter(p)}
                  className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all ${
                    selectedPersonaFilter === p
                      ? 'bg-brand-500/25 text-brand-300 border border-brand-500/40'
                      : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Main List Rendering */}
      {isLoading && validItems.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className="glass-card p-5 rounded-2xl border border-slate-800/80 animate-shimmer h-40"
            />
          ))}
        </div>
      ) : validItems.length === 0 ? (
        <div className="glass-panel p-10 sm:p-14 rounded-2xl border border-slate-800/80 text-center max-w-lg mx-auto my-8">
          <div className="w-14 h-14 rounded-2xl bg-brand-500/10 border border-brand-500/20 text-brand-400 flex items-center justify-center mx-auto mb-4 shadow-inner">
            <Inbox className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">No Prompts In History Yet</h3>
          <p className="text-xs sm:text-sm text-slate-400 max-w-sm mx-auto mb-6 leading-relaxed">
            Every prompt you create in the generator is automatically saved here so you never lose your work.
          </p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="glass-panel p-8 rounded-2xl border border-slate-800 text-center max-w-md mx-auto my-6">
          <p className="text-sm font-semibold text-slate-300 mb-1">No matches found</p>
          <p className="text-xs text-slate-400">
            No history prompts match "{searchQuery}". Try a different keyword or reset filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedPersonaFilter('ALL');
            }}
            className="mt-3 px-3 py-1.5 rounded-lg bg-brand-600 text-white text-xs font-medium hover:bg-brand-500"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredItems.map((item, index) => {
            const itemId = item._id || `item_${index}`;
            const isCopied = copiedId === itemId;
            const promptText = item.generatedPrompt || '';
            const topicText = item.topic || 'Untitled Prompt';
            const personaName = item.persona || 'Custom';
            const tokensCount = item.tokensEstimate || Math.round(promptText.length / 4);

            return (
              <div
                key={itemId}
                className="glass-card p-5 rounded-2xl border border-slate-800/80 flex flex-col justify-between hover:border-brand-500/50 hover:shadow-lg hover:shadow-brand-500/10 group transition-all duration-200"
              >
                <div>
                  {/* Card Meta Header */}
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] uppercase font-bold tracking-wider bg-brand-500/15 text-brand-300 border border-brand-500/25">
                      {personaName}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {formatDate(item.createdAt)}
                    </span>
                  </div>

                  {/* Topic Title */}
                  <h4 className="text-sm font-bold text-slate-100 group-hover:text-brand-300 transition-colors line-clamp-2 mb-2 leading-snug">
                    {topicText}
                  </h4>

                  {/* Prompt Text Snippet */}
                  <div className="relative mb-3">
                    <p className="text-xs text-slate-300 font-mono line-clamp-3 bg-slate-950/70 p-3 rounded-xl border border-slate-900 leading-relaxed select-text whitespace-pre-wrap">
                      {promptText}
                    </p>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs gap-2">
                  <div className="flex items-center gap-2 text-slate-400 font-mono text-[11px]">
                    <span>~{tokensCount} tokens</span>
                    {item.tone && (
                      <span className="hidden lg:inline text-slate-500">• {item.tone}</span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 ml-auto">
                    {/* Load Into Workspace */}
                    {onSelectPrompt && (
                      <button
                        onClick={() => onSelectPrompt(item)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-medium transition-colors"
                        title="Load prompt into generator workspace"
                      >
                        <ArrowUpRight className="w-3.5 h-3.5 text-brand-400" />
                        <span>Load</span>
                      </button>
                    )}

                    {/* Copy to Clipboard */}
                    <button
                      onClick={() => handleCopy(itemId, promptText)}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        isCopied
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'bg-brand-600/90 hover:bg-brand-600 text-white shadow-sm'
                      }`}
                      title="Copy full prompt to clipboard"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>

                    {/* Delete Item */}
                    {onDeletePrompt && (
                      <button
                        onClick={() => onDeletePrompt(item._id || itemId)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title="Delete from history"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
