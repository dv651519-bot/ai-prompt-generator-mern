import React from 'react';
import { motion } from 'framer-motion';
import { Code, Megaphone, Feather, GraduationCap, LayoutGrid, Palette, Briefcase } from 'lucide-react';

export const PERSONAS = [
  {
    id: 'Developer',
    label: 'Developer',
    icon: Code,
    role: 'Lead Architect',
    color: 'from-blue-500 to-indigo-600',
    description: 'Clean code, Big-O analysis, robust typing & error resilience.',
    sample: 'Design a distributed rate limiter in Redis with sliding window algorithm.',
  },
  {
    id: 'Marketer',
    label: 'Marketer',
    icon: Megaphone,
    role: 'Growth Strategist',
    color: 'from-fuchsia-500 to-rose-600',
    description: 'High-converting copy, psychological hooks, AIDA & CRO.',
    sample: 'Write an irresistible cold email sequence for a B2B SaaS security tool.',
  },
  {
    id: 'Writer',
    label: 'Writer',
    icon: Feather,
    role: 'Editorial Director',
    color: 'from-purple-500 to-brand-600',
    description: 'Sensory prose, immersive cadence, show-don\'t-tell & voice.',
    sample: 'Craft an atmospheric opening scene set in an abandoned underwater observatory.',
  },
  {
    id: 'Academic',
    label: 'Academic',
    icon: GraduationCap,
    role: 'Research Scientist',
    color: 'from-emerald-500 to-teal-600',
    description: 'Empirical rigor, thesis defense, citations & balanced critique.',
    sample: 'Critically analyze the trade-offs of Transformer attention mechanisms vs SSMs.',
  },
  {
    id: 'Product Manager',
    label: 'Product Manager',
    icon: LayoutGrid,
    role: 'Staff PM',
    color: 'from-amber-500 to-orange-600',
    description: 'PRDs, user stories, success metrics (OKRs) & prioritization.',
    sample: 'Draft a PRD for an AI-assisted onboarding feature to increase 30-day retention.',
  },
  {
    id: 'Designer',
    label: 'Designer',
    icon: Palette,
    role: 'Design System Lead',
    color: 'from-cyan-500 to-blue-600',
    description: 'Interaction ergonomics, accessibility, tokens & visual rhythm.',
    sample: 'Specify accessibility standards and interaction states for a multi-step stepper.',
  },
  {
    id: 'Executive',
    label: 'Executive',
    icon: Briefcase,
    role: 'Chief Operating Officer',
    color: 'from-violet-600 to-indigo-800',
    description: 'BLUF summaries, capital allocation, unit economics & moats.',
    sample: 'Synthesize a strategic decision memo evaluating build vs buy for customer support AI.',
  },
];

export default function PersonaSelector({ selectedPersona, onSelectPersona }) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Step 1: Choose Your Expert Persona
        </label>
        <span className="text-xs text-brand-400 font-mono">
          Selected: <strong className="text-white">{selectedPersona}</strong>
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
        {PERSONAS.map((p) => {
          const Icon = p.icon;
          const isSelected = selectedPersona === p.id;

          return (
            <motion.button
              key={p.id}
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectPersona(p.id)}
              className={`relative text-left p-3 rounded-xl transition-all duration-200 border ${
                isSelected
                  ? 'glass-card-active border-brand-500/80'
                  : 'glass-card border-slate-800/80 hover:border-slate-700'
              }`}
            >
              {isSelected && (
                <motion.div
                  layoutId="personaGlow"
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-brand-500/10 to-indigo-500/10 pointer-events-none"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}

              <div className="flex items-center gap-2 mb-1.5">
                <div
                  className={`p-1.5 rounded-lg bg-gradient-to-tr ${p.color} text-white shadow-sm`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white leading-tight">{p.label}</h4>
                  <span className="text-[10px] text-slate-400">{p.role}</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                {p.description}
              </p>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
