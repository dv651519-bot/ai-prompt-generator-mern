const mongoose = require('mongoose');

const promptSchema = new mongoose.Schema(
  {
    topic: {
      type: String,
      required: [true, 'Base topic is required'],
      trim: true,
      minlength: [3, 'Topic must be at least 3 characters long'],
      maxlength: [500, 'Topic cannot exceed 500 characters'],
    },
    persona: {
      type: String,
      required: [true, 'Persona selection is required'],
      enum: {
        values: [
          'Developer',
          'Marketer',
          'Writer',
          'Academic',
          'Product Manager',
          'Designer',
          'Executive',
        ],
        message: '{VALUE} is not a supported persona',
      },
    },
    tone: {
      type: String,
      default: 'Comprehensive & Actionable',
      enum: [
        'Comprehensive & Actionable',
        'Direct & Technical',
        'Creative & Inspiring',
        'Persuasive & Engaging',
        'Academic & Analytical',
      ],
    },
    outputFormat: {
      type: String,
      default: 'Structured Markdown',
      enum: ['Structured Markdown', 'System Prompt', 'Step-by-Step Guide', 'JSON Specification'],
    },
    generatedPrompt: {
      type: String,
      required: [true, 'Generated prompt content is required'],
    },
    tags: {
      type: [String],
      default: [],
    },
    tokensEstimate: {
      type: Number,
      default: 0,
    },
    isFavorite: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for high-performance retrieval of latest prompts
promptSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Prompt', promptSchema);
