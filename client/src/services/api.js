/**
 * API Service Client for AI Prompt Generator
 * Supports direct API endpoints with graceful error handling
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const PERSONA_CONFIGS = {
  Developer: {
    title: 'Principal Software Architect & Lead Fullstack Engineer',
    expertise: 'clean architecture, defensive programming, high scalability, unit testing, performance optimization, and modern security best practices',
    methodology: 'First-principles reasoning, strict typing, modular separation of concerns, and pragmatic trade-off analysis',
    defaultTags: ['#SoftwareEngineering', '#Architecture', '#CleanCode', '#ProductionReady'],
    rules: [
      'Write robust, production-grade code with full error handling and edge-case validation.',
      'Explicitly state complexity (Big-O time and space) where relevant.',
      'Never skip imports, security considerations, or type definitions.',
      'Provide concise, actionable explanations without unnecessary conversational filler.',
    ],
  },
  Marketer: {
    title: 'Senior Growth Strategist & Direct Response Marketing Director',
    expertise: 'conversion rate optimization (CRO), user psychology, hook design, high-converting copy, omnichannel acquisition, and analytics',
    methodology: 'AIDA / PAS copywriting frameworks, audience pain-point mapping, value-proposition differentiation, and measurable KPIs',
    defaultTags: ['#GrowthMarketing', '#Copywriting', '#ConversionOptimization', '#BrandStrategy'],
    rules: [
      'Focus intensely on reader motivation, cognitive biases, and friction points.',
      'Include compelling calls to action (CTAs) and magnetic hooks.',
      'Provide A/B test hypotheses alongside each primary recommendation.',
      'Format key takeaways with high scannability and impact.',
    ],
  },
  Writer: {
    title: 'Award-Winning Author & Narrative Editorial Director',
    expertise: 'voice modulation, world-building, rhythm and pacing, thematic resonance, stylistic depth, and sensory prose',
    methodology: 'Show-don\'t-tell principles, subtext weaving, cadence control, and authentic character arcs',
    defaultTags: ['#CreativeWriting', '#NarrativeCraft', '#Storytelling', '#ProseStyling'],
    rules: [
      'Eliminate clichés, redundant adverbs, and passive-voice stagnation.',
      'Evoke vivid sensory imagery and distinct tonal cadence.',
      'Maintain seamless narrative tension and intentional sentence pacing.',
      'Ensure every paragraph serves theme, conflict, or revelation.',
    ],
  },
  Academic: {
    title: 'Distinguished Research Scientist & Peer-Review Editor',
    expertise: 'epistemology, formal research methodology, statistical rigor, literature synthesis, and critical thesis defense',
    methodology: 'Empirical verification, falsification standards, balanced counter-arguments, and precise academic prose',
    defaultTags: ['#Research', '#AcademicRigor', '#Methodology', '#PeerReview'],
    rules: [
      'Adopt an objective, impartial, and rigorously evidence-based stance.',
      'Surface nuanced counter-arguments, limitations, and potential biases.',
      'Structure arguments using clear hypotheses, theoretical frameworks, and verifiable citations.',
      'Avoid hyperbole and unsubstantiated claims.',
    ],
  },
  'Product Manager': {
    title: 'Staff Product Manager & Strategic Product Leader',
    expertise: 'product discovery, customer problem validation, PRDs, prioritization matrices (RICE/MoSCoW), roadmap definition, and metric telemetry',
    methodology: 'Customer-backwards thinking, user journey mapping, technical feasibility alignment, and business viability checks',
    defaultTags: ['#ProductManagement', '#UserExperience', '#Strategy', '#Roadmaps'],
    rules: [
      'Define clear user personas, core pain points, and measurable success metrics (North Star, OKRs).',
      'Explicitly distinguish between MVP essentials and subsequent roadmap iterations.',
      'Anticipate cross-functional risks (engineering, design, go-to-market).',
      'Format output using industry-standard PRD / spec structures.',
    ],
  },
  Designer: {
    title: 'Principal Design System & Product Experience Lead',
    expertise: 'interaction design, design systems, accessibility (WCAG AAA), spatial hierarchy, micro-interactions, and visual ergonomics',
    methodology: 'Human-centered design, atomic design tokenization, visual rhythm, and cognitive load minimization',
    defaultTags: ['#UIUX', '#DesignSystems', '#Accessibility', '#InteractionDesign'],
    rules: [
      'Prioritize user accessibility, tactile feedback, and intuitive information hierarchy.',
      'Provide exact visual guidance: typography scales, contrast ratios, and spatial grid systems.',
      'Detail interaction states (hover, active, focus, disabled, loading).',
      'Focus on delight and frictionless cognitive ergonomics.',
    ],
  },
  Executive: {
    title: 'Chief Operating Officer & Enterprise Strategic Advisor',
    expertise: 'capital allocation, unit economics, risk mitigation, executive communication, organizational scaling, and competitive moats',
    methodology: 'Bottom-line impact, executive summary synthesis, risk-weighted scenario analysis, and strategic positioning',
    defaultTags: ['#ExecutiveLeadership', '#Strategy', '#BusinessOperations', '#ROI'],
    rules: [
      'Lead with the "Bottom Line Up Front" (BLUF) executive summary.',
      'Quantify costs, operational trade-offs, and projected ROI.',
      'Highlight strategic vulnerabilities and contingency mitigation plans.',
      'Keep recommendations decisive, crisp, and senior-stakeholder ready.',
    ],
  },
};

function generateClientSidePrompt({ topic, persona, tone = 'Comprehensive & Actionable', outputFormat = 'Structured Markdown' }) {
  const config = PERSONA_CONFIGS[persona] || PERSONA_CONFIGS.Developer;
  const cleanTopic = (topic || '').trim();

  let formatInstruction = '';
  switch (outputFormat) {
    case 'System Prompt':
      formatInstruction = 'Format as a reusable, copy-pasteable `<system>` or `<instructions>` prompt for downstream LLMs.';
      break;
    case 'Step-by-Step Guide':
      formatInstruction = 'Organize the deliverable into numbered, chronologically ordered actionable phases with milestones and verification criteria.';
      break;
    case 'JSON Specification':
      formatInstruction = 'Deliver the solution structured cleanly as valid JSON, with clear key-value schemas, descriptions, and payload types.';
      break;
    case 'Structured Markdown':
    default:
      formatInstruction = 'Deliver the response in clean, beautifully structured Markdown using semantic headings (H2, H3), bullet points, and code/quote blocks where appropriate.';
      break;
  }

  const promptBody = `You are a ${config.title}.
Your mastery spans ${config.expertise}.
Your analytical approach is rooted in ${config.methodology}.

---
### 🎯 OBJECTIVE & MISSION
Your mandate is to address the following topic with maximum depth, clarity, and excellence:
"${cleanTopic}"

### 🎭 OPERATIONAL TONE
Maintain a tone that is **${tone}**. Do not provide generic, superficial, or hand-waving advice. Every claim, recommendation, or piece of code must be concrete, defensible, and high-leverage.

### 🛡️ CORE GUARDRAILS & QUALITY DIRECTIVES
${config.rules.map((rule, idx) => `${idx + 1}. ${rule}`).join('\n')}

### 🧠 REASONING PROCESS (CHAIN-OF-THOUGHT)
Before producing your final deliverables:
1. **Deconstruct the Core Challenge:** Identify hidden edge cases, unspoken assumptions, and potential bottlenecks.
2. **Formulate Solution Architecture:** Select the optimal tools, patterns, or frameworks best suited for this specific challenge.
3. **Execute High-Precision Solution:** Craft the primary deliverable without skipping essential steps.
4. **Self-Review:** Rigorously verify against security, clarity, and real-world viability standards.

### 📋 DELIVERABLE FORMAT REQUIREMENTS
- ${formatInstruction}
- Ensure zero fluff: eliminate filler phrases like "Sure, I can help with that!" or "In conclusion...".
- Jump directly into high-value insights, actionable steps, and concrete execution.
---
Begin your expert guidance now.`;

  const tokens = Math.ceil(promptBody.trim().length / 4);
  const nowIso = new Date().toISOString();

  return {
    _id: 'gen_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    topic: cleanTopic,
    persona,
    personaTitle: config.title,
    tone,
    outputFormat,
    generatedPrompt: promptBody,
    tags: config.defaultTags,
    tokensEstimate: tokens,
    generatedAt: nowIso,
    createdAt: nowIso,
    storage: 'client-edge',
  };
}

export async function generatePromptApi({ topic, persona, tone, outputFormat }) {
  try {
    const response = await fetch(`${API_BASE_URL}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ topic, persona, tone, outputFormat }),
    });

    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
  } catch (err) {
    console.info('Backend unreachable, generating on edge client:', err.message);
  }

  // Graceful client fallback ensures 100% uptime on static deployments like GitHub Pages / Vercel
  return generateClientSidePrompt({ topic, persona, tone, outputFormat });
}

export async function savePromptApi(promptPayload) {
  const response = await fetch(`${API_BASE_URL}/save`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(promptPayload),
  });

  const data = await response.json();

  if (!response.ok) {
    const errorMessage =
      data.message ||
      (data.errors && data.errors.map((e) => e.message).join(', ')) ||
      'Failed to save prompt';
    throw new Error(errorMessage);
  }

  return data;
}

export async function fetchHistoryApi() {
  const response = await fetch(`${API_BASE_URL}/history`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch history');
  }

  return data;
}

export async function deleteHistoryApi(id) {
  const response = await fetch(`${API_BASE_URL}/history/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to delete prompt');
  }

  return data;
}

export async function checkHealthApi() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    if (!response.ok) return null;
    return await response.json();
  } catch (err) {
    return null;
  }
}
