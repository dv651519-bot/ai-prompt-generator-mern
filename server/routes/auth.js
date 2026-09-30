const express = require('express');
const { body } = require('express-validator');
const { register, login, getMe } = require('../controllers/authController');

const router = express.Router();

/**
 * Validation rules for user registration
 */
const registerValidationRules = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 60 })
    .withMessage('Name must be between 2 and 60 characters'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email address is required')
    .isEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('role')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Role cannot exceed 50 characters'),
  body('plan')
    .optional()
    .isIn(['Free Tier', 'Pro Tier', 'Enterprise'])
    .withMessage('Plan must be Free Tier, Pro Tier, or Enterprise'),
];

/**
 * Validation rules for user login
 */
const loginValidationRules = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email address is required')
    .isEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

// Mount endpoints
router.post('/register', registerValidationRules, register);
router.post('/login', loginValidationRules, login);
router.get('/me', getMe);

module.exports = router;
