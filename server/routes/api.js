const express = require('express');
const { body, param } = require('express-validator');
const {
  generatePrompt,
  savePrompt,
  getHistory,
  deletePrompt,
  healthCheck,
} = require('../controllers/promptController');
const { generateLimiter } = require('../middleware/rateLimiter');
const authRoutes = require('./auth');

const router = express.Router();

// Mount authentication sub-router
router.use('/auth', authRoutes);

const VALID_PERSONAS = [
  'Developer',
  'Marketer',
  'Writer',
  'Academic',
  'Product Manager',
  'Designer',
  'Executive',
];

/**
 * Validation rules for generating a prompt
 */
const generateValidationRules = [
  body('topic')
    .trim()
    .notEmpty()
    .withMessage('Base topic is required')
    .isLength({ min: 3, max: 500 })
    .withMessage('Topic must be between 3 and 500 characters long'),
  body('persona')
    .trim()
    .notEmpty()
    .withMessage('Persona is required')
    .isIn(VALID_PERSONAS)
    .withMessage(`Persona must be one of: ${VALID_PERSONAS.join(', ')}`),
  body('tone')
    .optional()
    .trim()
    .isLength({ max: 80 })
    .withMessage('Tone description cannot exceed 80 characters'),
  body('outputFormat')
    .optional()
    .trim()
    .isLength({ max: 80 })
    .withMessage('Output format description cannot exceed 80 characters'),
];

/**
 * Validation rules for saving a prompt
 */
const saveValidationRules = [
  body('topic')
    .trim()
    .notEmpty()
    .withMessage('Base topic is required')
    .isLength({ min: 3, max: 500 })
    .withMessage('Topic must be between 3 and 500 characters long'),
  body('persona')
    .trim()
    .notEmpty()
    .withMessage('Persona is required')
    .isIn(VALID_PERSONAS)
    .withMessage(`Persona must be one of: ${VALID_PERSONAS.join(', ')}`),
  body('generatedPrompt')
    .trim()
    .notEmpty()
    .withMessage('Generated prompt content is required')
    .isLength({ min: 10 })
    .withMessage('Generated prompt must be at least 10 characters long'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array of strings'),
  body('tokensEstimate')
    .optional()
    .isNumeric()
    .withMessage('Tokens estimate must be a number'),
];

// Routes
router.get('/health', healthCheck);
router.post('/generate', generateLimiter, generateValidationRules, generatePrompt);
router.post('/save', saveValidationRules, savePrompt);
router.get('/history', getHistory);
router.delete('/history/:id', param('id').notEmpty().withMessage('Prompt ID is required'), deletePrompt);

module.exports = router;
