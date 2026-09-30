const { validationResult } = require('express-validator');
const Prompt = require('../models/Prompt');
const { generateOptimizedPrompt } = require('../services/promptEngine');
const { getDBStatus } = require('../config/db');

// In-memory fallback cache if MongoDB is temporarily unavailable or in local offline mode
let inMemoryHistory = [];

/**
 * @desc    Generate optimized AI prompt
 * @route   POST /api/generate
 * @access  Public
 */
const generatePrompt = async (req, res, next) => {
  try {
    // Validate request inputs
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        errors: errors.array().map((err) => ({
          field: err.path || err.param,
          message: err.msg,
        })),
      });
    }

    const { topic, persona, tone, outputFormat } = req.body;

    // Generate prompt using advanced prompt engineering engine
    const promptData = generateOptimizedPrompt({
      topic,
      persona,
      tone,
      outputFormat,
    });

    const isDbConnected = getDBStatus();
    let savedRecord = null;
    const nowIso = new Date().toISOString();

    const recordPayload = {
      topic: promptData.topic,
      persona: promptData.persona,
      personaTitle: promptData.personaTitle,
      tone: promptData.tone,
      outputFormat: promptData.outputFormat,
      generatedPrompt: promptData.prompt,
      tags: promptData.tags || [],
      tokensEstimate: promptData.tokensEstimate || 0,
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    // Auto-persist directly to database or in-memory history
    if (isDbConnected) {
      try {
        savedRecord = await Prompt.create(recordPayload);
      } catch (dbErr) {
        console.warn('[MongoDB Save Error, fallback to in-memory]:', dbErr.message);
      }
    }

    if (!savedRecord) {
      savedRecord = {
        _id: 'gen_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
        ...recordPayload,
      };
      // Prepend to in-memory history
      inMemoryHistory.unshift(savedRecord);
      if (inMemoryHistory.length > 50) inMemoryHistory.pop();
    }

    return res.status(200).json({
      success: true,
      data: {
        _id: savedRecord._id,
        topic: promptData.topic,
        persona: promptData.persona,
        personaTitle: promptData.personaTitle,
        tone: promptData.tone,
        outputFormat: promptData.outputFormat,
        generatedPrompt: promptData.prompt,
        tags: promptData.tags,
        tokensEstimate: promptData.tokensEstimate,
        generatedAt: nowIso,
        createdAt: nowIso,
        storage: isDbConnected && savedRecord._id && !savedRecord._id.toString().startsWith('gen_') ? 'mongodb' : 'in-memory',
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Save generated prompt to history
 * @route   POST /api/save
 * @access  Public
 */
const savePrompt = async (req, res, next) => {
  try {
    // Validate request inputs
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        errors: errors.array().map((err) => ({
          field: err.path || err.param,
          message: err.msg,
        })),
      });
    }

    const { _id, topic, persona, tone, outputFormat, generatedPrompt, tags, tokensEstimate } = req.body;

    const isDbConnected = getDBStatus();
    const nowIso = new Date().toISOString();

    if (isDbConnected) {
      // Check for existing duplicate to prevent clutter
      const existing = await Prompt.findOne({ generatedPrompt }).lean();
      if (existing) {
        return res.status(200).json({
          success: true,
          message: 'Prompt already saved in database',
          data: existing,
          storage: 'mongodb',
        });
      }

      const newPrompt = await Prompt.create({
        topic,
        persona,
        tone: tone || 'Comprehensive & Actionable',
        outputFormat: outputFormat || 'Structured Markdown',
        generatedPrompt,
        tags: tags || [],
        tokensEstimate: tokensEstimate || 0,
      });

      return res.status(201).json({
        success: true,
        message: 'Prompt saved to database successfully',
        data: newPrompt,
        storage: 'mongodb',
      });
    } else {
      // Check if already in inMemoryHistory
      const existingIndex = inMemoryHistory.findIndex(
        (p) => (_id && p._id === _id) || p.generatedPrompt === generatedPrompt
      );

      if (existingIndex !== -1) {
        return res.status(200).json({
          success: true,
          message: 'Prompt already stored in history',
          data: inMemoryHistory[existingIndex],
          storage: 'in-memory',
        });
      }

      // Fallback in-memory storage so frontend works seamlessly without DB crashes
      const fallbackPrompt = {
        _id: _id || ('mem_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7)),
        topic,
        persona,
        tone: tone || 'Comprehensive & Actionable',
        outputFormat: outputFormat || 'Structured Markdown',
        generatedPrompt,
        tags: tags || [],
        tokensEstimate: tokensEstimate || 0,
        createdAt: nowIso,
        updatedAt: nowIso,
      };

      inMemoryHistory.unshift(fallbackPrompt);
      if (inMemoryHistory.length > 50) inMemoryHistory.pop();

      return res.status(201).json({
        success: true,
        message: 'Prompt saved to local cache',
        data: fallbackPrompt,
        storage: 'in-memory',
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Fetch latest generated prompts
 * @route   GET /api/history
 * @access  Public
 */
const getHistory = async (req, res, next) => {
  try {
    const isDbConnected = getDBStatus();

    if (isDbConnected) {
      const prompts = await Prompt.find()
        .sort({ createdAt: -1 })
        .limit(50)
        .lean();

      return res.status(200).json({
        success: true,
        count: prompts.length,
        data: prompts,
        storage: 'mongodb',
      });
    } else {
      // Return cached in-memory prompts
      return res.status(200).json({
        success: true,
        count: inMemoryHistory.length,
        data: inMemoryHistory,
        storage: 'in-memory',
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete prompt from history
 * @route   DELETE /api/history/:id
 * @access  Public
 */
const deletePrompt = async (req, res, next) => {
  try {
    const { id } = req.params;
    const isDbConnected = getDBStatus();

    if (isDbConnected && !id.startsWith('mem_') && !id.startsWith('gen_')) {
      try {
        await Prompt.findByIdAndDelete(id);
      } catch (err) {
        console.warn('DB delete error, continuing:', err.message);
      }
    }
    
    inMemoryHistory = inMemoryHistory.filter((p) => String(p._id) !== String(id));

    return res.status(200).json({
      success: true,
      message: 'Prompt removed from history',
      deletedId: id,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Health check & status
 * @route   GET /api/health
 * @access  Public
 */
const healthCheck = (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    database: getDBStatus() ? 'connected' : 'disconnected (in-memory mode)',
    uptimeSeconds: Math.floor(process.uptime()),
  });
};

module.exports = {
  generatePrompt,
  savePrompt,
  getHistory,
  deletePrompt,
  healthCheck,
};
