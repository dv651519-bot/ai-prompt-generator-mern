const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [60, 'Name cannot exceed 60 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email address is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    role: {
      type: String,
      default: 'Prompt Engineer',
    },
    avatar: {
      type: String,
      default: '',
    },
    plan: {
      type: String,
      default: 'Pro Tier',
      enum: ['Free Tier', 'Pro Tier', 'Enterprise'],
    },
  },
  {
    timestamps: true,
  }
);

// Method to return user info without sensitive fields like password
userSchema.methods.toSafeObject = function () {
  return {
    _id: this._id,
    name: this.name,
    email: this.email,
    role: this.role,
    avatar: this.avatar,
    plan: this.plan,
    createdAt: this.createdAt,
  };
};

module.exports = mongoose.model('User', userSchema);
