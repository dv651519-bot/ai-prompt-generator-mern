const { validationResult } = require('express-validator');
const User = require('../models/User');
const { hashPassword, verifyPassword, generateToken, verifyToken } = require('../services/authUtils');
const { getDBStatus } = require('../config/db');

// Seed default in-memory users for instant testing & offline resilience
const defaultDemoUsers = [
  {
    _id: 'usr_demo_alex_001',
    name: 'Alex Mercer',
    email: 'alex@promptforge.ai',
    passwordHash: hashPassword('password123'),
    role: 'Principal AI Engineer',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    plan: 'Pro Tier',
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'usr_demo_elena_002',
    name: 'Elena Rostova',
    email: 'elena@promptforge.ai',
    passwordHash: hashPassword('password123'),
    role: 'Lead Prompt Architect',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&q=80',
    plan: 'Enterprise',
    createdAt: new Date().toISOString(),
  },
];

let inMemoryUsers = [...defaultDemoUsers];

/**
 * Format safe user object (stripping password hash)
 */
function sanitizeUser(user) {
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role || 'Prompt Engineer',
    avatar: user.avatar || '',
    plan: user.plan || 'Pro Tier',
    createdAt: user.createdAt,
  };
}

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array().map((e) => e.msg).join(', '),
        errors: errors.array(),
      });
    }

    const { name, email, password, role, plan } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    const isDbConnected = getDBStatus();

    // Check if user already exists
    if (isDbConnected) {
      const existingUser = await User.findOne({ email: normalizedEmail });
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'An account with this email address already exists',
        });
      }
    } else {
      const existingInMemory = inMemoryUsers.find((u) => u.email === normalizedEmail);
      if (existingInMemory) {
        return res.status(409).json({
          success: false,
          message: 'An account with this email address already exists',
        });
      }
    }

    const hashedPassword = hashPassword(password);
    let createdUser;

    if (isDbConnected) {
      try {
        const newUser = await User.create({
          name: name.trim(),
          email: normalizedEmail,
          password: hashedPassword,
          role: role || 'Prompt Engineer',
          plan: plan || 'Pro Tier',
          avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(normalizedEmail)}`,
        });
        createdUser = newUser.toSafeObject();
      } catch (dbErr) {
        console.warn('[User DB Registration fallback]:', dbErr.message);
      }
    }

    if (!createdUser) {
      const memUser = {
        _id: 'usr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
        name: name.trim(),
        email: normalizedEmail,
        passwordHash: hashedPassword,
        role: role || 'Prompt Engineer',
        plan: plan || 'Pro Tier',
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(normalizedEmail)}`,
        createdAt: new Date().toISOString(),
      };
      inMemoryUsers.unshift(memUser);
      createdUser = sanitizeUser(memUser);
    }

    const token = generateToken({
      userId: createdUser._id,
      email: createdUser.email,
      name: createdUser.name,
    });

    return res.status(201).json({
      success: true,
      message: 'Account registered successfully',
      data: {
        user: createdUser,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Authenticate user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array().map((e) => e.msg).join(', '),
        errors: errors.array(),
      });
    }

    const { email, password } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    const isDbConnected = getDBStatus();
    let userRecord = null;
    let storedPasswordHash = null;

    if (isDbConnected) {
      const foundUser = await User.findOne({ email: normalizedEmail });
      if (foundUser) {
        userRecord = foundUser.toSafeObject();
        storedPasswordHash = foundUser.password;
      }
    }

    // Fallback to in-memory store if not found in DB or DB offline
    if (!userRecord) {
      const memUser = inMemoryUsers.find((u) => u.email === normalizedEmail);
      if (memUser) {
        userRecord = sanitizeUser(memUser);
        storedPasswordHash = memUser.passwordHash;
      }
    }

    if (!userRecord || !storedPasswordHash) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email address or password',
      });
    }

    const isPasswordValid = verifyPassword(password, storedPasswordHash);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email address or password',
      });
    }

    const token = generateToken({
      userId: userRecord._id,
      email: userRecord.email,
      name: userRecord.name,
    });

    return res.status(200).json({
      success: true,
      message: 'Signed in successfully',
      data: {
        user: userRecord,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get currently authenticated user info
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authorization token required',
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    if (!decoded || !decoded.userId) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired session token',
      });
    }

    const isDbConnected = getDBStatus();
    let user = null;

    if (isDbConnected) {
      try {
        const dbUser = await User.findById(decoded.userId);
        if (dbUser) {
          user = dbUser.toSafeObject();
        }
      } catch (err) {
        console.warn('[GetMe DB Fetch]:', err.message);
      }
    }

    if (!user) {
      const memUser = inMemoryUsers.find((u) => String(u._id) === String(decoded.userId));
      if (memUser) {
        user = sanitizeUser(memUser);
      } else {
        // Construct fallback user based on decoded token
        user = {
          _id: decoded.userId,
          name: decoded.name || 'Prompt Engineer',
          email: decoded.email,
          role: 'Prompt Engineer',
          plan: 'Pro Tier',
          avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(decoded.email || 'user')}`,
        };
      }
    }

    return res.status(200).json({
      success: true,
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
};
