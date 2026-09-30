import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import PromptForm from './components/PromptForm';
import PromptOutput from './components/PromptOutput';
import SkeletonLoader from './components/SkeletonLoader';
import HistoryFeed from './components/HistoryFeed';
import Toast from './components/Toast';
import Footer from './components/Footer';
import {
  generatePromptApi,
  savePromptApi,
  fetchHistoryApi,
  deleteHistoryApi,
  checkHealthApi,
} from './services/api';

const STORAGE_KEY = 'promptforge_history_v1';

const getLocalHistory = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.warn('Failed to parse localStorage history:', e);
    return [];
  }
};

const saveLocalHistory = (items) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, 50)));
  } catch (e) {
    console.warn('Failed to write to localStorage:', e);
  }
};

export default function App() {
  // Form State
  const [topic, setTopic] = useState('');
  const [persona, setPersona] = useState('Developer');
  const [tone, setTone] = useState('Comprehensive & Actionable');
  const [outputFormat, setOutputFormat] = useState('Structured Markdown');

  // Generation & Output State
  const [generatedPromptData, setGeneratedPromptData] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // History State initialized from local storage
  const [historyItems, setHistoryItems] = useState(() => getLocalHistory());
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);

  // System & View State
  const [activeTab, setActiveTab] = useState('generator'); // 'generator' | 'history'
  const [serverStatus, setServerStatus] = useState(null);
  const [toasts, setToasts] = useState([]);

  const outputRef = useRef(null);

  // Toast notification manager
  const addToast = (toast) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Check backend server health on mount & sync history
  useEffect(() => {
    async function verifyHealth() {
      const status = await checkHealthApi();
      if (status) {
        setServerStatus(status);
      }
    }
    verifyHealth();
    loadHistory();
  }, []);

  // Fetch & Sync History Feed
  const loadHistory = async () => {
    try {
      setIsHistoryLoading(true);
      const local = getLocalHistory();
      if (local && local.length > 0) {
        setHistoryItems(local);
      }

      const res = await fetchHistoryApi();
      if (res && res.success && Array.isArray(res.data)) {
        // Merge server history with local history to ensure zero data loss
        const merged = [...res.data];
        local.forEach((localItem) => {
          const exists = merged.some(
            (m) =>
              String(m._id) === String(localItem._id) ||
              m.generatedPrompt === localItem.generatedPrompt
          );
          if (!exists) {
            merged.push(localItem);
          }
        });
        merged.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        setHistoryItems(merged);
        saveLocalHistory(merged);
      }
    } catch (err) {
      console.warn('Could not load history from server, using local history:', err.message);
    } finally {
      setIsHistoryLoading(false);
    }
  };

  // Generate Prompt Handler (automatically saves to history!)
  const handleGenerate = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (isGenerating) return;

    if (!topic || topic.trim().length < 3) {
      setGenerateError('Please enter at least 3 characters describing your topic.');
      return;
    }

    setGenerateError('');
    setIsGenerating(true);

    try {
      const result = await generatePromptApi({
        topic: topic.trim(),
        persona,
        tone,
        outputFormat,
      });

      setGeneratedPromptData(result);
      setIsSaved(true); // Automatically saved!

      // Immediately append/prepend to history items and persist locally
      const newHistoryItem = {
        _id: result._id || ('gen_' + Date.now()),
        topic: result.topic,
        persona: result.persona,
        personaTitle: result.personaTitle,
        tone: result.tone,
        outputFormat: result.outputFormat,
        generatedPrompt: result.generatedPrompt,
        tags: result.tags || [],
        tokensEstimate: result.tokensEstimate || 0,
        createdAt: result.createdAt || result.generatedAt || new Date().toISOString(),
      };

      setHistoryItems((prev) => {
        const withoutCurrent = prev.filter(
          (p) =>
            String(p._id) !== String(newHistoryItem._id) &&
            p.generatedPrompt !== newHistoryItem.generatedPrompt
        );
        const updated = [newHistoryItem, ...withoutCurrent];
        saveLocalHistory(updated);
        return updated;
      });

      addToast({
        type: 'success',
        title: 'Prompt Generated & Stored!',
        message: `Saved to your History Feed as ${result.personaTitle}`,
      });

      // Smooth scroll to output card on mobile and desktop
      setTimeout(() => {
        if (outputRef.current) {
          outputRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } catch (err) {
      const msg = err.message || 'Server error occurred during prompt generation';
      setGenerateError(msg);
      addToast({
        type: 'error',
        title: 'Generation Failed',
        message: msg,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Save Prompt to History Handler (explicit save/backup)
  const handleSave = async () => {
    if (!generatedPromptData || isSaving) return;

    try {
      setIsSaving(true);
      const res = await savePromptApi(generatedPromptData);

      setIsSaved(true);
      addToast({
        type: 'success',
        title: 'Saved to Library',
        message: res.storage === 'mongodb' ? 'Safely stored in MongoDB' : 'Safely stored in history',
      });
      loadHistory();
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Save Notice',
        message: err.message,
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Load Prompt from History into Editor
  const handleSelectHistoryItem = (item) => {
    setTopic(item.topic);
    setPersona(item.persona);
    if (item.tone) setTone(item.tone);
    if (item.outputFormat) setOutputFormat(item.outputFormat);
    setGeneratedPromptData({
      _id: item._id,
      topic: item.topic,
      persona: item.persona,
      personaTitle: item.personaTitle || item.persona,
      tone: item.tone || 'Comprehensive & Actionable',
      outputFormat: item.outputFormat || 'Structured Markdown',
      generatedPrompt: item.generatedPrompt,
      tokensEstimate: item.tokensEstimate || 0,
      tags: item.tags || [],
      generatedAt: item.createdAt,
    });
    setIsSaved(true);
    setActiveTab('generator');

    addToast({
      type: 'info',
      title: 'Prompt Loaded',
      message: `Loaded "${item.topic.substring(0, 30)}..." into workspace`,
    });

    setTimeout(() => {
      if (outputRef.current) {
        outputRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  // Delete Prompt from History
  const handleDeleteHistoryItem = async (id) => {
    try {
      deleteHistoryApi(id).catch((err) => console.warn('Server delete:', err.message));
      setHistoryItems((prev) => {
        const updated = prev.filter((item) => String(item._id) !== String(id));
        saveLocalHistory(updated);
        return updated;
      });
      addToast({
        type: 'info',
        title: 'Prompt Deleted',
        message: 'Removed from history feed',
      });
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Delete Failed',
        message: err.message,
      });
    }
  };

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught error:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="py-16 text-center max-w-md mx-auto">
          <div className="p-6 rounded-2xl glass-panel border border-rose-500/30">
            <p className="text-rose-400 font-semibold mb-2">Something went wrong rendering this view.</p>
            <p className="text-xs text-slate-400 mb-4 font-mono">{this.state.error?.message}</p>
            <button
              onClick={() => {
                this.setState({ hasError: false });
                window.location.reload();
              }}
              className="px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-semibold hover:bg-brand-500"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

  return (
    <div className="min-h-screen flex flex-col bg-[#080c14] text-slate-100 selection:bg-brand-600 selection:text-white relative">
      {/* Toast Notification Layer */}
      <Toast toasts={toasts} onDismiss={removeToast} />

      {/* Navigation Bar */}
      <Navbar
        serverStatus={serverStatus}
        historyCount={historyItems.length}
        activeTab={activeTab}
        onNavigate={setActiveTab}
      />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        <ErrorBoundary>
          {activeTab === 'generator' ? (
            <div key="generator-view" className="animate-fadeIn">
              {/* Hero Banner */}
              <Hero />

              {/* Interactive Generation Section */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
                {/* Form Column */}
                <div className="lg:col-span-6 space-y-6">
                  <PromptForm
                    topic={topic}
                    setTopic={setTopic}
                    persona={persona}
                    setPersona={setPersona}
                    tone={tone}
                    setTone={setTone}
                    outputFormat={outputFormat}
                    setOutputFormat={setOutputFormat}
                    onSubmit={handleGenerate}
                    isLoading={isGenerating}
                    error={generateError}
                  />
                </div>

                {/* Output Card / Skeleton Column */}
                <div ref={outputRef} className="lg:col-span-6 space-y-6">
                  {isGenerating ? (
                    <SkeletonLoader />
                  ) : generatedPromptData ? (
                    <PromptOutput
                      promptData={generatedPromptData}
                      onSave={handleSave}
                      isSaving={isSaving}
                      isSaved={isSaved}
                    />
                  ) : (
                    /* Default Placeholder before first generation */
                    <div className="glass-panel rounded-2xl p-8 sm:p-10 border border-slate-800/80 text-center relative overflow-hidden flex flex-col items-center justify-center min-h-[380px]">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-500/10 to-indigo-500/20 border border-brand-500/20 flex items-center justify-center text-brand-400 mb-4 shadow-inner">
                        <span className="text-2xl">✨</span>
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2">
                        Your Optimized Prompt Appears Here
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-400 max-w-sm mx-auto leading-relaxed">
                        Select a specialized persona on the left, enter your topic, and click <strong className="text-slate-200">"Generate Optimized Prompt"</strong>.
                      </p>
                      <div className="mt-6 flex flex-wrap justify-center gap-2">
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-mono bg-slate-900 border border-slate-800 text-slate-400">
                          🛡️ Defensive Guardrails
                        </span>
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-mono bg-slate-900 border border-slate-800 text-slate-400">
                          🧠 Chain of Thought
                        </span>
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-mono bg-slate-900 border border-slate-800 text-slate-400">
                          ⚡ 1-Click Copy
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Compact Quick History Preview underneath output */}
                  {historyItems.length > 0 && !isGenerating && (
                    <div className="pt-2">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                          Recent History ({historyItems.length})
                        </span>
                        <button
                          onClick={() => setActiveTab('history')}
                          className="text-xs text-brand-400 hover:text-brand-300 font-medium"
                        >
                          View all &rarr;
                        </button>
                      </div>
                      <div className="space-y-2">
                        {historyItems.slice(0, 2).map((item, idx) => (
                          <div
                            key={item?._id ? `${item._id}_${idx}` : `recent_${idx}`}
                            onClick={() => handleSelectHistoryItem(item)}
                            className="p-3 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-800/80 cursor-pointer flex items-center justify-between transition-colors"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-brand-500/20 text-brand-300">
                                {item?.persona || 'AI'}
                              </span>
                              <span className="text-xs text-slate-200 truncate max-w-xs">
                                {item?.topic || 'Untitled Prompt'}
                              </span>
                            </div>
                            <span className="text-[11px] text-brand-400 hover:underline flex-shrink-0">
                              Load
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* Dedicated History View */
            <div key="history-view" className="py-8 animate-fadeIn">
              <HistoryFeed
                historyItems={historyItems}
                isLoading={isHistoryLoading}
                onRefresh={loadHistory}
                onSelectPrompt={handleSelectHistoryItem}
                onDeletePrompt={handleDeleteHistoryItem}
              />
            </div>
          )}
        </ErrorBoundary>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
